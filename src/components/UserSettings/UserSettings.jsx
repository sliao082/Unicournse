import { useState, useEffect } from 'react';
import auth from '../../util/auth';
import db from '../../util/db';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import UserWarningBlock from '../UserWarningBlock/UserWarningBlock';

import './style.css'

const UserSettings = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [warningText, setWarningText] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [notificationEnabled, setNotificationEnabled] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, 'Users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } else {
                setUser(null);
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleProfileSave = async () => {
        if (!user) {
            return;
        }
        const usernameInput = document.getElementById('username-input').value.trim();
        const userIdInput = document.getElementById('userid-input').value.trim();
        const docRef = doc(db, 'Users', user.uid);

        let updateData = {};

        if (usernameInput !== "") {
            updateData["info.username"] = usernameInput;
        }

        if (userIdInput !== "") {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const currentUserIdField = data.info && data.info.userid;
                if (
                    currentUserIdField &&
                    Array.isArray(currentUserIdField) &&
                    currentUserIdField.length >= 2 &&
                    currentUserIdField[1]
                ) {
                    const lastModifiedDate = currentUserIdField[1].toDate();
                    const now = new Date();
                    const sevenDays = 7 * 24 * 60 * 60 * 1000;
                    if (now - lastModifiedDate < sevenDays) {
                        setWarningText("User ID can only be changed once every 7 days. Please try again later.");
                        setShowWarning(true);
                        return;
                    } else {
                        updateData["info.userid"] = [userIdInput, Timestamp.now()];
                    }
                } else {
                    updateData["info.userid"] = [userIdInput, Timestamp.now()];
                }
            }
        }

        if (Object.keys(updateData).length === 0) {
            setWarningText("Please enter a valid update.");
            setShowWarning(true);
            return;
        }

        try {
            await updateDoc(docRef, updateData);
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile: ", error);
            setWarningText("Failed to update profile. Please try again.");
            setShowWarning(true);
        }
    };

    const handleUserInfoSave = async () => {
        if (!user) {
            return;
        }
        const docRef = doc(db, "Users", user.uid);

        const genderInput = document.getElementById('gender-select').value.trim();
        const emailInput = document.getElementById('email-input').value.trim();
        const yearInput = document.getElementById('year-select').value.trim();
        const majorInput = document.getElementById('major-input').value.trim();
        const isVisible = document.getElementById('vis-switch').checked;

        let updateData = {};

        if (emailInput !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput)) {
                setWarningText("Please enter a valid email address");
                return;
            }
            updateData["info.email"] = emailInput;
        }
        if (genderInput !== "") {
            updateData["info.gender"] = genderInput;
        }
        if (yearInput !== "") {
            updateData["info.year"] = yearInput;
        }
        if (majorInput !== "") {
            updateData["info.major"] = majorInput;
        }
        updateData["info.visible"] = isVisible;

        try {
            await updateDoc(docRef, updateData);
            window.location.reload();
        } catch (error) {
            console.error("Error updating user information: ", error);
            setWarningText("Failed to update user information. Please try again.");
            setShowWarning(true);
        }
    };

    const handleNotificationToggle = async () => {
        if (!user) {
            return;
        }
        const docRef = doc(db, "Users", user.uid);
        const newNotificationStatus = !userData.info.notification;

        try {
            await updateDoc(docRef, {
                "info.notification": newNotificationStatus
            });
            setUserData(prevState => ({
                ...prevState,
                info: {
                    ...prevState.info,
                    notification: newNotificationStatus
                }
            }));
        } catch (error) {
            console.error("Error updating notification status: ", error);
        }
    };

    return (
        <div className="user-main-block">
            <div className="settings-container">
                <div className="settings-header">
                    <h2>Account Settings</h2>
                </div>
                <div className="settings-block">
                    <div className="settings-profile-section">
                        <h3 className="section-title">Profile Information</h3>
                        <div className="profile-info">
                            <div className="avatar-wrapper">
                                <button className="upload-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#fff">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="profile-user">
                                <div className="profile-user-content">
                                    <p>User Name</p>
                                    <input className="user-input-text" type="text" placeholder={userData?.info?.username} style={{ width: '60%' }} id='username-input' />
                                </div>
                                <div className="profile-user-content">
                                    <p>User ID</p>
                                    <input className="user-input-text" type="text" placeholder={userData?.info?.userid ? userData.info.userid[0] : ""} style={{ width: '60%' }} id='userid-input' />
                                    <small>You may only change User ID every 7 days</small>
                                </div>
                                <button type="button" className="user-btn" style={{ marginLeft: '0', position: 'absolute', bottom: '15px', right: '15px' }} onClick={handleProfileSave}>Save</button>
                            </div>
                        </div>
                    </div>
                    <div className="settings-profile-section" style={{ marginBottom: '0' }}>
                        <h3 className="section-title">User Information</h3>
                        <div className="user-main-info">
                            <div className="user-info-item" style={{ width: '35%' }}>
                                <p>Gender:</p>
                                <select className="user-input-text" id="gender-select" value={userData?.info?.gender}>
                                    <option value="" disabled>Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="user-info-item" style={{ width: '48%' }}>
                                <p>Email:</p>
                                <input className="user-input-text" type="text" placeholder={userData?.info?.email} id="email-input" />
                            </div>
                            <div className="user-info-item" style={{ width: '35%' }}>
                                <p>Year:</p>
                                <select className="user-input-text" id="year-select" value={userData?.info?.year}>
                                    <option value="" disabled>Select year</option>
                                    <option value="Freshman">Freshman</option>
                                    <option value="Sophomore">Sophomore</option>
                                    <option value="Junior">Junior</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Master">Master</option>
                                    <option value="PhD">PhD</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="user-info-item" style={{ width: '48%' }}>
                                <p>Major:</p>
                                <input className="user-input-text" type="text" placeholder={userData?.info?.major} id="major-input" />
                            </div>
                            <div className="user-info-item" style={{ width: '46%', justifyContent: 'flex-end', transform: 'translateX(110%)' }}>
                                <label className="user-switch">
                                    <p>Visible to others</p>
                                    <input type="checkbox" id='vis-switch' defaultChecked={userData?.info?.visible} />
                                    <span className="user-slider round"></span>
                                </label>
                                <button type="button" className="user-btn" onClick={handleUserInfoSave}>Save</button>
                            </div>
                        </div>
                    </div>
                    <div className="setting-meta-section">
                        <h3 className="section-title">Meta Information</h3>
                        <div className="setting-item">
                            <div className="item-content">
                                <h4>Password</h4>
                                <p>Last changed 2 weeks ago</p>
                            </div>
                            <button className="user-btn">Change</button>
                        </div>
                        <div className="setting-item">
                            <div className="item-content">
                                <h4>Dark Mode</h4>
                                <p>Toggle interface theme</p>
                            </div>
                            <label className="user-switch">
                                <input type="checkbox" id='dark-switch' />
                                <span className="user-slider round"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="item-content">
                                <h4>Notifications</h4>
                                <p>Manage notification preferences</p>
                            </div>
                            <label className="user-switch">
                                <input type="checkbox" id='notif-switch' defaultChecked={userData?.info?.notification}/>
                                <span className="user-slider round" onClick={handleNotificationToggle}></span>
                            </label>
                        </div>
                        <div className="setting-item danger-item">
                            <div className="item-content">
                                <h4 style={{ color: 'var(--button-color)' }}>Deactivate Account</h4>
                                <p>Temporarily disable your account</p>
                            </div>
                            <button className="user-btn">Deactivate</button>
                        </div>
                        <div className="setting-item danger-item">
                            <div className="item-content">
                                <h4 style={{ color: 'var(--button-color)' }}>Delete Account</h4>
                                <p>Permanently remove all data</p>
                            </div>
                            <button className="user-btn">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            {showWarning && <UserWarningBlock text={warningText} showWarning={showWarning} setShowWarning={setShowWarning} width='30%' />}
        </div>
    )
}

export default UserSettings