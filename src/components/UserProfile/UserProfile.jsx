import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../../util/auth';
import db from '../../util/db';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import './style.css'
import collegeData from '../../content/college.json';
import subjectData from '../../content/subject.json';
import courseData from '../../content/courses.json';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [deletionMode, setDeletionMode] = useState(false);

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

    const handleDeleteSection = async (e, courseTitle, sectionCode) => {
        e.preventDefault();
        e.stopPropagation();
        if (
            !window.confirm(
                `Are you sure you want to delete section ${sectionCode} from ${courseTitle}?`
            )
        ) {
            return;
        }
        const docRef = doc(db, 'Users', user.uid);
        const updatedCourses = profileData.courses.reduce((acc, courseObj) => {
            if (courseObj.course === courseTitle) {
                const updatedSections = courseObj.sections.filter(
                    (sec) => sec.code !== sectionCode
                );
                if (updatedSections.length > 0) {
                    acc.push({
                        ...courseObj,
                        sections: updatedSections
                    });
                }
            } else {
                acc.push(courseObj);
            }
            return acc;
        }, []);
        try {
            await updateDoc(docRef, { courses: updatedCourses });
            setProfileData((prev) => ({ ...prev, courses: updatedCourses }));
        } catch (error) {
            console.error("Error deleting section: ", error);
        }
    };

    const totalCards =
        profileData?.courses?.flatMap((course) =>
            course.sections && course.sections.length > 0 ? course.sections : [course]
        ).length || 0;

    if (!user) {
        return (
            <div className="user-main-block">
                <p>No user signed in</p>
            </div>
        );
    }

    const getCollegeColor = (code, color) => {
        const subject = subjectData.find(subject => subject.code === code);
        if (subject) {
            const college = collegeData.find(college => college.college === subject.college);
            return college ? college[color] : '';
        }
        return '';
    }

    return (
        <>
            <div className="user-main-block">
                <div className="user-main-header">
                    <h2>Hi, {profileData?.info?.username || "UserName"}!</h2>
                    <div className="user-header-pf">
                        <div className="user-pf-name">{profileData?.info?.username || "User Name"}</div>
                        <div className="user-pf-img"></div>
                    </div>
                </div>
                <div className="user-profile-main-info">
                    <div className="user-profile-info-item" style={{ width: '22%' }}>
                        <p className="user-profile-info-label">Gender:</p>
                        <p className="user-profile-info-value">{profileData?.info?.gender || "N/A"}</p>
                        <div className="user-profile-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M12 14V22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM21.4462 20.032L22.9497 21.5355L21.5355 22.9497L20.032 21.4462C19.4365 21.7981 18.7418 22 18 22C15.7909 22 14 20.2091 14 18C14 15.7909 15.7909 14 18 14C20.2091 14 22 15.7909 22 18C22 18.7418 21.7981 19.4365 21.4462 20.032ZM18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16C16.8954 16 16 16.8954 16 18C16 19.1046 16.8954 20 18 20Z"></path></svg>
                        </div>
                    </div>
                    <div className="user-profile-info-item" style={{ width: '46%' }}>
                        <p className="user-profile-info-label">Email:</p>
                        <p className="user-profile-info-value">{profileData?.info?.email || "example@illinois.edu"}</p>
                        <div className="user-profile-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path></svg>
                        </div>
                    </div>
                    <div className="user-profile-info-item" style={{ width: '22%' }}>
                        <p className="user-profile-info-label">Year:</p>
                        <p className="user-profile-info-value">{profileData?.info?.year || "N/A"}</p>
                        <div className="user-profile-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M23 18.9999H22V8.99991H18V6.58569L12 0.585693L6 6.58569V8.99991H2V18.9999H1V20.9999H23V18.9999ZM6 19H4V11H6V19ZM18 11H20V19H18V11ZM11 12H13V19H11V12Z"></path></svg>
                        </div>
                    </div>
                    <div className="user-profile-info-item" style={{ width: '46%' }}>
                        <p className="user-profile-info-label">Major:</p>
                        <p className="user-profile-info-value">{profileData?.info?.major || "N/A"}</p>
                        <div className="user-profile-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M20 22H6.5C4.567 22 3 20.433 3 18.5V5C3 3.34315 4.34315 2 6 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V17H6.5C5.67157 17 5 17.6716 5 18.5C5 19.3284 5.67157 20 6.5 20H19ZM10 4V12L13.5 10L17 12V4H10Z"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="user-main-courses">
                    <h2>
                        Your Sections&nbsp;
                        {profileData?.courses?.length > 0 && (
                            <span onClick={() => setDeletionMode((prev) => !prev)}>Delete</span>
                        )}
                    </h2>
                    <div className="user-profile-browse-subjects-list">
                        {profileData?.courses &&
                            (() => {
                                const allCards = profileData.courses.flatMap((course, courseIndex) => {
                                    if (course.sections && course.sections.length > 0) {
                                        return course.sections.map((section, sectionIndex) => (
                                            <Link to={`/browse/subject/${course.course.split(' ')[0]}/${course.course.split(' ')[1]}`} key={`${courseIndex}-${sectionIndex}`} className="user-profile-browse-subjects-card">
                                                <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: getCollegeColor(course.course.split(' ')[0], 'color1') }}></div>
                                                <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: getCollegeColor(course.course.split(' ')[0], 'color2') }}></div>
                                                <div className="user-profile-browse-subjects-section">
                                                    <p className="user-profile-browse-subjects-section-title">{course.course}</p>
                                                    <div className="user-profile-browse-subjects-section-item">
                                                        <p>{section.code} {section.type}</p>
                                                        {deletionMode && (
                                                            <button className="browse-subjects-card-delete-button" onClick={(e) => handleDeleteSection(e, course.course, section.code)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ));
                                    } else {
                                        return (
                                            <Link key={courseIndex} to={`/browse/subject/${course.course.split(' ')[0]}/${course.course.split(' ')[1]}`} className="browse-subjects-card" style={{ width: '26%', minHeight: '150px' }}>
                                                <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: getCollegeColor(course.course.split(' ')[0], 'color1') }}></div>
                                                <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: getCollegeColor(course.course.split(' ')[0], 'color2') }}></div>
                                                <p className="browse-subjects-card-text">{course.course}</p>
                                            </Link>
                                        );
                                    }
                                });
                                return allCards.length > 0 
                                    ? allCards.slice(currentPage * 6, currentPage * 6 + 6)
                                    : <p className="no-info-text">You haven't added any sections yet. Why not <Link to='/browse'>browse courses</Link> and add some?</p>;
                            })()}
                        {profileData?.courses?.length > 0 && (
                            <>
                                <button className="user-browse-section-btn" type="button" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 0}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg>
                                </button>
                                <button className="user-browse-section-btn" type="button" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={(currentPage + 1) * 6 >= totalCards}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="user-side-info-block">
                    <h2>WatchList</h2>
                    <div className="user-side-info">
                        {profileData?.watchlist && profileData.watchlist.length > 0 ? (
                            profileData.watchlist.map((courseId) => {
                                const [subj, codeStr] = courseId.split(" ");
                                const code = Number(codeStr);
                                const course = courseData.find((item) => item.subj === subj && item.code === code);
                                return (
                                    <Link to={`../../browse/subject/${subj}`} key={courseId} className="course-list-item unclicked" style={{ width: '92%', marginTop: '3dvh' }}>
                                        <div className="course-icon"></div>
                                        <div className="course-details">
                                            <h3>{course.name}</h3>
                                            <p>{course.subj} {course.code}</p>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <p className="no-info-text" style={{ textAlign: 'center', fontSize: '.9rem', marginTop: '2dvh' }}>
                                It looks like you have no courses listed as watchlist. Why not <Link to='/browse'>browse courses</Link> and add some?
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile