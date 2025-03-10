import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import auth from '../../util/auth';
import db from '../../util/db';
import './style.css';
import { Link } from 'react-router-dom';

const HomeNotificationBlock = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);

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

    if (profileData && (!profileData.info || !profileData.info.notification)) {
        return (
            <div className='home-notification-block'>
                <p className='no-info-text' style={{ marginRight: '0' }}>You have not enabled notifications yet, go to <Link to={`/user/${profileData?.info?.userid[0]}/settings`}>settings</Link> to enable.</p>
            </div>
        );
    }

    const notifications = profileData?.notifications || [];
    
    if (notifications.length > 0) {
        return (
            <div className='home-notification-block'>
                {notifications.map((item, idx) => {
                    if (item.type === 'invite') {
                        return (
                            <div className='home-notification-content' key={`notification-${idx}`}>
                                <div className="notification-img" style={{ backgroundImage: `url(src/assets/invite.svg)` }}></div>
                                <p className='notification-text' style={{ color: "var(--text-color)" }}>
                                    You received a coursemate invitation from {item.from} for {item.course}!
                                </p>
                            </div>
                        );
                    } else if (item.type === 'comment') {
                        return (
                            <div className='home-notification-content' key={`notification-${idx}`}>
                                <div className="notification-img" style={{ backgroundImage: `url(src/assets/comment.svg)` }}></div>
                                <p className='notification-text' style={{ color: "var(--text-color)" }}>
                                    A new comment was posted for your selected course {item.course}!
                                </p>
                            </div>
                        );
                    } else if (item.type === 'system') {
                        return (
                            <div className='home-notification-content' key={`notification-${idx}`}>
                                <div className="notification-img" style={{ backgroundImage: `url(src/assets/system.svg)` }}></div>
                                <p className='notification-text' style={{ color: "var(--button-color)" }}>
                                    {item.text}
                                </p>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    }

    return (
        <div className='home-notification-block'>
            <p className="no-info-text" style={{ marginRight: '0' }}>No new notifications</p>
        </div>
    );
};

export default HomeNotificationBlock;