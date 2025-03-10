import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore';

import auth from '../../util/auth';
import db from '../../util/db';

import './style.css';

const UserCoursemates = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [filterCourse, setFilterCourse] = useState("");
    const [filterGender, setFilterGender] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [courseMapping, setCourseMapping] = useState({});

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

    useEffect(() => {
        const fetchAllUsers = async () => {
            if (user) {
                const usersCol = collection(db, "Users");
                const querySnapshot = await getDocs(usersCol);
                const users = [];
                querySnapshot.forEach((docSnap) => {
                    if (docSnap.id !== user.uid) {
                        const data = docSnap.data();
                        if (data.info?.visible) {
                            users.push({ uid: docSnap.id, ...data });
                        }
                    }
                });
                setAllUsers(users);
            }
        };
        fetchAllUsers();
    }, [user]);

    useEffect(() => {
        const mapping = {};
        allUsers.forEach((u) => {
            if (u.courses && Array.isArray(u.courses)) {
                u.courses.forEach((courseObj) => {
                    const courseCode = courseObj.course;
                    if (!mapping[courseCode]) {
                        mapping[courseCode] = [];
                    }
                    mapping[courseCode].push({
                        name: u.info?.username || u.name,
                        gender: u.info?.gender || "",
                        major: u.info?.major || "",
                        year: u.info?.year || "",
                        email: u.info?.email || u.email || "",
                        uid: u.uid,
                        hasInvite: u.invites?.some(invite => 
                            invite.course === courseCode && 
                            invite.name === (profileData?.info?.username || "") &&
                            invite.email === (profileData?.info?.email || "") &&
                            invite.gender === (profileData?.info?.gender || "") &&
                            invite.year === (profileData?.info?.year || "")
                        ) || false
                    });
                });
            }
        });

        if (filterGender || filterYear) {
            Object.keys(mapping).forEach((courseCode) => {
                mapping[courseCode] = mapping[courseCode].filter((mate) => {
                    let match = true;
                    if (filterGender) {
                        match = match && mate.gender.toLowerCase() === filterGender;
                    }
                    if (filterYear) {
                        match = match && mate.year.toLowerCase() === filterYear;
                    }
                    return match;
                });
            });
        }
        setCourseMapping(mapping);
    }, [allUsers, filterGender, filterYear]);

    const handleInviteClick = async (e, uid, courseCode) => {
        if (!user) return;

        const spanElement = e.currentTarget.querySelector('span');
        const inviteText = spanElement.textContent;

        try {
            const userDocRef = doc(db, 'Users', uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let invites = userData.invites || [];
                let notifications = userData.notifications || { invite: [] };

                if (inviteText === 'Invite Sent') {
                    invites = invites.filter(invite => 
                        invite.course !== courseCode || 
                        invite.name !== (profileData?.info?.username || "") ||
                        invite.email !== (profileData?.info?.email || "") ||
                        invite.gender !== (profileData?.info?.gender || "") ||
                        invite.year !== (profileData?.info?.year || "")
                    );
                    spanElement.textContent = 'Send Invite';
                    notifications = notifications.filter(notification => 
                        !(notification.type === 'invite' && notification.course === courseCode || notification.from === (profileData?.info?.username || ""))
                    );
                } else {
                    const newInvite = {
                        name: profileData?.info?.username || "",
                        course: courseCode,
                        gender: profileData?.info?.gender || "",
                        year: profileData?.info?.year || "",
                        major: profileData?.info?.major || "",
                        email: profileData?.info?.email || ""
                    };
                    invites.push(newInvite);
                    spanElement.textContent = 'Invite Sent';

                    if (userData.info?.notification) {
                        notifications.push({
                            type: 'invite',
                            course: courseCode,
                            from: profileData?.info?.username || ""
                        });
                    }
                }
                await setDoc(userDocRef, { invites, notifications }, { merge: true });
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error handling invite: ', error);
        }
    };

    if (!user) {
        return (
            <div className="user-main-block">
                <p>No user signed in</p>
            </div>
        );
    }

    return (
        <div className="user-main-block">
            <div className="user-course-list">
                <select className="user-course-item" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                    <option value="">Any Course</option>
                    {profileData?.courses?.map((course, index) => (
                        <option key={index} value={course.course}>
                            {course.course}
                        </option>
                    ))}
                </select>
                <select className="user-course-item" value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <select className="user-course-item" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                    <option value="">Any Year</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="master">Master</option>
                    <option value="phd">PhD</option>
                </select>
            </div>
            <div className="user-coursmate-block">
                {profileData?.courses?.length === 0 ? (
                    <p className='no-info-text'>
                        You haven't added any sections yet. Why not <Link to='/browse'>browse courses</Link> and add some?
                    </p>
                ) : (
                    (profileData?.courses?.filter(course => !filterCourse || course.course === filterCourse) || []).map((courseObj, index) => {
                        const courseCode = courseObj.course;
                        const mates = courseMapping[courseCode] || [];
                        return (
                            <div key={index}>
                                <h2 className='user-course-headings'>{courseCode}</h2>
                                <div className="user-coursemate-list">
                                    {mates.length === 0 ? (
                                        <p className='no-info-text'>There seems to be no other people taking this course.</p>
                                    ) : (
                                        mates.map((mate, idx) => (
                                            <div key={idx} className="user-coursemate-card">
                                                <div className="user-img-container">
                                                    <div className="user-coursemate-img"></div>
                                                    <h3>{mate.name}</h3>
                                                </div>
                                                <div className="user-info">
                                                    <p className="user-meta">
                                                        <span className="gender">{mate.gender}</span> •
                                                        <span className="major"> {mate.year}</span> •
                                                        <span className="major"> {mate.major}</span>
                                                    </p>
                                                    <div className="user-email-section" onClick={(e) => handleInviteClick(e, mate.uid, courseCode)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M22 13.3414C21.3744 13.1203 20.7013 13 20 13C16.6863 13 14 15.6863 14 19C14 19.7013 14.1203 20.3744 14.3414 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V13.3414ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829ZM21 18H24V20H21V23H19V20H16V18H19V15H21V18Z"></path></svg>
                                                        <span>{mate.hasInvite ? 'Invite Sent' : 'Send Invite'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="user-side-info-block">
                <h2>Pending Invites</h2>
                <div className="user-side-info">
                    {profileData?.invites?.map((invite, index) => (
                        <div key={index} className="course-list-item unclicked" style={{ width: '92%'}}>
                            <div className="course-icon"></div>
                            <div className="course-details">
                                <h3>
                                    {invite.gender === 'Male' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#16b4dc"><path d="M15.0491 8.53666L18.5858 5H14V3H22V11H20V6.41421L16.4633 9.95088C17.4274 11.2127 18 12.7895 18 14.5C18 18.6421 14.6421 22 10.5 22C6.35786 22 3 18.6421 3 14.5C3 10.3579 6.35786 7 10.5 7C12.2105 7 13.7873 7.57264 15.0491 8.53666ZM10.5 20C13.5376 20 16 17.5376 16 14.5C16 11.4624 13.5376 9 10.5 9C7.46243 9 5 11.4624 5 14.5C5 17.5376 7.46243 20 10.5 20Z"></path></svg>
                                    ) : invite.gender === 'Female' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#ff8da1"><path d="M11 15.9339C7.33064 15.445 4.5 12.3031 4.5 8.5C4.5 4.35786 7.85786 1 12 1C16.1421 1 19.5 4.35786 19.5 8.5C19.5 12.3031 16.6694 15.445 13 15.9339V18H18V20H13V24H11V20H6V18H11V15.9339ZM12 14C15.0376 14 17.5 11.5376 17.5 8.5C17.5 5.46243 15.0376 3 12 3C8.96243 3 6.5 5.46243 6.5 8.5C6.5 11.5376 8.96243 14 12 14Z"></path></svg>
                                    ) : null}
                                    {invite.name}
                                </h3>
                                <span>{invite.course}</span>
                                <p>{invite.email}</p>
                                <p>{invite.major} | {invite.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserCoursemates;