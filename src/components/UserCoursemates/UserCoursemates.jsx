import './style.css'
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import auth from '../../util/auth';
import db from '../../util/db';

const UserCoursemates = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (user) {
                const userDocRef = doc(db, 'Users', user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    setProfileData(docSnap.data());
                } else {
                    console.error('No such document!');
                }
            }
        };

        fetchProfileData();
    }, [user]);

    if (!user) {
        return (
            <div className="user-main-block">
                <p>No user signed in</p>
            </div>
        );
    }

    const coursemates = [
        {
            id: 1,
            name: "Sarah Johnson",
            gender: "Female",
            major: "Computer Science",
            email: "s.johnson@university.edu",
            image: "https://example.com/sarah.jpg"
        },
        {
            id: 2,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        },
        {
            id: 3,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        },
        {
            id: 4,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        },
        {
            id: 5,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        },
        {
            id: 6,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        }
    ];

    return (
        <div className="user-main-block">
            <div className="user-course-list">
                <select className="user-course-item">
                    <option value="">Any Course</option>
                    {profileData?.courses?.map((course, index) => (
                        <option key={index} value={course.course}>
                            {course.course}
                        </option>
                    ))}
                </select>
                <select className="user-course-item">
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <select className="user-course-item">
                    <option value="">Any Year</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="master">Master</option>
                    <option value="phd">PhD</option>
                </select>
                <button className="user-course-item-btn">Search</button>
            </div>
            <div className="user-coursmate-block">
                {profileData?.courses?.map((course, index) => (
                    <div key={index}>
                        <h2 className='user-course-headings'>{course.course}</h2>
                        <div className="user-coursemate-list">
                    {coursemates.map((mate) => (
                        <div key={mate.id} className="user-coursemate-card">
                            <div className="user-img-container">
                                <div className="user-coursemate-img"></div>
                                <h3>{mate.name}</h3>
                            </div>
                            <div className="user-info">
                                <p className="user-meta">
                                    <span className="gender">{mate.gender}</span> •
                                    <span className="major"> {mate.major}</span>
                                </p>
                                <div className="user-email-section">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='var(--button-color)'>
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span>Send Invite</span>
                                </div>
                            </div>
                        </div>
                            ))}
                        </div>
                    </div>
                ))}
                <h2 className='user-course-headings'>CS 124</h2>
                <div className="user-coursemate-list">
                    {coursemates.map((mate) => (
                        <div key={mate.id} className="user-coursemate-card">
                            <div className="user-img-container">
                                <div className="user-coursemate-img"></div>
                                <h3>{mate.name}</h3>
                            </div>
                            <div className="user-info">
                                <p className="user-meta">
                                    <span className="gender">{mate.gender}</span> •
                                    <span className="major"> {mate.major}</span>
                                </p>
                                <div className="user-email-section">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='var(--button-color)'>
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span>Send Invite</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className='user-course-headings'>CS 124</h2>
                <div className="user-coursemate-list">
                    {coursemates.map((mate) => (
                        <div key={mate.id} className="user-coursemate-card">
                            <div className="user-img-container">
                                <div className="user-coursemate-img"></div>
                                <h3>{mate.name}</h3>
                            </div>
                            <div className="user-info">
                                <p className="user-meta">
                                    <span className="gender">{mate.gender}</span> •
                                    <span className="major"> {mate.major}</span>
                                </p>
                                <div className="user-email-section">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='var(--button-color)'>
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span>Send Invite</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="user-side-info-block">
                <h2>Pending Invites</h2>
                <div className="user-side-info">

                </div>
            </div>

        </div>
    )
}

export default UserCoursemates