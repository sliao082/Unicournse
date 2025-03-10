import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, Timestamp, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import db from '../../util/db';
import auth from '../../util/auth'

import UserWarningBlock from '../UserWarningBlock/UserWarningBlock';

import './style.css'

const BrowseDetails = () => {
    const { subj, code } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [warningText, setWarningText] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    const resources = [
        {
            title: "Lecture Slides",
            description: "Clean and concise lecture slides.",
            link: "/resources/lecture-slides"
        },
        {
            title: "Practice Problems",
            description: "Extra problems for hands-on practice.",
            link: "/resources/practice-problems"
        },
        {
            title: "Video Tutorials",
            description: "In-depth video tutorials that explain key concepts.",
            link: "/resources/video-tutorials"
        },
        {
            title: "Reading Materials",
            description: "Additional readings and research papers.",
            link: "/resources/reading-materials"
        }
    ];

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const docRef = doc(db, "Courses", subj);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const courseList = docSnap.data().info;
                    const foundCourse = courseList.find(course => course.code.toString() === code);
                    if (foundCourse) {
                        setCourseData(foundCourse);
                    } else {
                        setWarningText('Course not found. Please try again later.');
                        setShowWarning(true);
                    }
                }
            } catch (err) {
                setWarningText('Error fetching course data. Please try again later.');
                setShowWarning(true)
            }
        };

        if (subj && code) {
            fetchCourse();
        }
    }, [subj, code]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, 'Users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            } else {
                setUser(null);
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year} - ${month} - ${day}`;
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const usersCol = collection(db, "Users");
                const querySnapshot = await getDocs(usersCol);
                const commentsArr = [];
                querySnapshot.forEach((userDoc) => {
                    const data = userDoc.data();
                    const username = data.info?.username || "Anonymous";
                    if (data.comments && Array.isArray(data.comments)) {
                        data.comments.forEach(comm => {
                            if (comm.course === `${subj} ${courseData.code}`) {
                                commentsArr.push({
                                    username,
                                    date: comm.date,
                                    content: comm.content
                                });
                            }
                        });
                    }
                });
                setAllComments(commentsArr);
            } catch (err) {
                setWarningText('Error fetching comments. Please try again later.');
                setShowWarning(true);
            }
        };

        if (courseData) {
            fetchComments();
        }
    }, [courseData, subj]);

    const handleCommentSubmit = async () => {
        if (!user) {
            setWarningText('Please sign in to submit a comment.');
            setShowWarning(true);
            return;
        }
        if (!comment.trim()) {
            setWarningText('Please enter a comment before submitting.');
            setShowWarning(true);
            return;
        }

        try {
            const userDocRef = doc(db, 'Users', user.uid);
            await updateDoc(userDocRef, {
                comments: arrayUnion({
                    id: (userData?.comments?.length || 0),
                    course: `${subj} ${courseData.code}`,
                    content: comment,
                    date: Timestamp.now()
                })
            });
            setComment('');
            alert('Comment submitted successfully.');
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Failed to submit comment.');
        }
    };

    if (!courseData) {
        return <div>Loading course data...</div>;
    }

    return (
        <>
            <div className='browse-container' style={{ width: '70%' }}>
                <div className="browse-details-block">
                    <div className="browse-details-info">
                        <div className="browse-details-info-content">
                            <h3>{subj} {courseData.code}: {courseData.name}</h3>
                            <Link to={`/browse/subject/${subj}`} className='browse-details-info-link'>Back to Browse Courses</Link>
                        </div>
                    </div>
                    <h2 className='browse-details-headings'>Comments</h2>
                    <div className="browse-details-comment-input">
                        <input type="text" placeholder="Share your comment and thoughts here..." onChange={(e) => setComment(e.target.value)} value={comment}></input>
                        <button type="button" onClick={handleCommentSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)">
                                <path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="browse-details-comments">
                        {allComments.length > 0 ? allComments.map((comm, idx) => (
                            <div className="browse-details-comments-item" key={idx}>
                                <div className="browse-details-comments-item-profile">
                                    <div className="browse-details-comments-item-profile-img"></div>
                                    <h3>{comm.username}</h3>
                                    <span>{formatTimestamp(comm.date)}</span>
                                </div>
                                <p>{comm.content}</p>
                            </div>
                        )) : <p className='no-info-text'>No comments yet. Why not share one by typing your thoughts above 👆?</p>}
                    </div>
                </div>
            </div>
            <div className="browse-resources-block">
                <h2 className="browse-resources-title">Resources</h2>
                <div className="browse-resources-list">
                    {resources.map((resource) => (
                        <Link to={resource.link} className="resource-card" key={resource.title}>
                            <div className="resource-card-image"></div>
                            <div className="resource-card-content">
                                <h3 className="resource-card-title">{resource.title}</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--shadow-color)">
                                    <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path>
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {showWarning && <UserWarningBlock text={warningText} showWarning={showWarning} setShowWarning={setShowWarning} width='40%' />}
        </>
    );
};

export default BrowseDetails;