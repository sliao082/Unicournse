import './style.css'
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import auth from '../../util/auth';
import db from '../../util/db';
import coursesData from '../../content/courses.json';
import { Link } from 'react-router-dom';

const HomeCourseBar = () => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userData) => {
            setUser(userData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchUserInfo = async () => {
                try {
                    const docRef = doc(db, 'Users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserInfo(docSnap.data());
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            };
            fetchUserInfo();
        }
    }, [user]);

    return (
        <div className="course-bar">
            <h2>Your Courses</h2>
            <div className="course-list">
                {user ? (
                    userInfo && userInfo.courses && userInfo.courses.length > 0 ? (
                        userInfo.courses.map((courseObj, index) => {
                            const courseCodeStr = courseObj.course;
                            const parts = courseCodeStr.split(' ');
                            let courseName = 'Course name not found';
                            if (parts.length >= 2) {
                                const subj = parts[0];
                                const code = Number(parts[1]);
                                const courseData = coursesData.find(
                                    (c) => c.subj === subj && c.code === code
                                );
                                if (courseData) {
                                    courseName = courseData.name;
                                }
                            }
                            return (
                                <Link key={index} to={`/browse/subject/${parts[0]}/${parts[1]}`} className="course-list-item unclicked">
                                    <div className="course-icon"></div>
                                    <div className="course-details">
                                        <h3>{courseCodeStr}</h3>
                                        <p>{courseName}</p>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <p className='no-info-text'>No courses added.</p>
                    )
                ) : (
                    <p className='no-info-text'>You have to <Link to="/register/login">log in</Link> to add courses</p>
                )}
            </div>
        </div>
    )
}

export default HomeCourseBar