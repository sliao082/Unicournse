import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import auth from '../../util/auth';
import db from '../../util/db';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UserComments = () => {
    const [comments, setComments] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentEditComment, setCurrentEditComment] = useState(null);

    const fetchComments = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return;
        }
        const userDocRef = doc(db, 'Users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const fetchedComments = userData?.comments || [];
            setComments(fetchedComments);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toISOString().split('T')[0];
    };

    const handleEditClick = (comment) => {
        setCurrentEditComment(comment);
        setEditModalOpen(true);
    };

    const handleModalClose = () => {
        setEditModalOpen(false);
        setCurrentEditComment(null);
    };

    const handleModalSave = async () => {
        const newContent = document.getElementById('edit-textarea').value.trim();
        if (newContent === "") return;
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const userDocRef = doc(db, 'Users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const commentsArray = userData?.comments || [];
            const updatedComments = commentsArray.map((c) => {
                if (c.id === currentEditComment.id) {
                    return { ...c, content: newContent };
                }
                return c;
            });
            await updateDoc(userDocRef, { "comments": updatedComments });
            setComments(updatedComments);
            setEditModalOpen(false);
            setCurrentEditComment(null);
        }
    };

    const handleDeleteClick = async (e) => {
        const commentId = Number(e.currentTarget.getAttribute('data-comment-id'));
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const userDocRef = doc(db, 'Users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const commentsArray = userData?.comments || [];
            const updatedComments = commentsArray.filter(c => c.id !== commentId);
            await updateDoc(userDocRef, { "comments": updatedComments });
            setComments(updatedComments);
        }
    };

    return (
        <>
            <div className="user-main-block">
                <div className="user-main-header">
                    <h2>My Comments</h2>
                </div>
                <div className="comments-container">
                    {comments.length === 0 ? (
                        <div className="no-info-text">
                            It looks like you haven't posted any comments yet. Why not{' '}
                            <Link to="/browse">browse courses</Link> and share your thoughts?
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment-card">
                                <div className="comment-content">
                                    <div className="course-header">
                                        <h3 className="course-code">{comment.course}</h3>
                                        <span className="course-title">{comment.name}</span>
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                    <div className="comment-date">
                                        Posted on {formatTimestamp(comment.date)}
                                    </div>
                                </div>
                                <div className="comment-actions">
                                    <button className="icon-button edit-button" onClick={() => handleEditClick(comment)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="var(--button-color)">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button className="icon-button delete-button" data-comment-id={comment.id} onClick={handleDeleteClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="var(--button-color)">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {editModalOpen && currentEditComment && (
                <div className="modal-overlay">
                    <div className="neumorphic-modal">
                        <h3>{currentEditComment.course}</h3>
                        <h4>{currentEditComment.name}</h4>
                        <textarea id="edit-textarea" defaultValue={currentEditComment.content}></textarea>
                        <p>Posted on: {formatTimestamp(currentEditComment.date)}</p>
                        <div className="modal-buttons">
                            <button onClick={handleModalSave}>Save</button>
                            <button onClick={handleModalClose}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserComments