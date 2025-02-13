import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../../util/auth';
import db from '../../util/db';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './style.css';

function RegisterLogin() {
    const navigate = useNavigate();

    const generateRandomId = (length = 8) => {
        const characters = '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters[Math.floor(Math.random() * characters.length)];
        }
        return result;
    };

    useEffect(() => {
        if (auth.currentUser) {
            const fetchUserAndNavigate = async () => {
                const userDocRef = doc(db, "Users", auth.currentUser.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data && data.info && data.info.userid && Array.isArray(data.info.userid)) {
                        navigate(`/user/${data.info.userid[0]}/profile`);
                    }
                }
            };
            fetchUserAndNavigate();
        }
    }, [auth, db, navigate]);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userDocRef = doc(db, "Users", result.user.uid);
            const docSnap = await getDoc(userDocRef);
            let randomUserId;

            if (docSnap.exists()) {
                const data = docSnap.data();
                navigate(`/user/${data.info.userid[0]}/profile`);
            } else {
                randomUserId = generateRandomId();
                await setDoc(userDocRef, {
                    comments: [],
                    sections: [],
                    info: {
                        email: result.user.email,
                        gender: "N/A",
                        major: "N/A",
                        userid: [randomUserId, new Date('2000-01-01T00:00:00Z')],
                        username: result.user.displayName,
                        year: "N/A",
                        deactivate: false,
                        visible: false
                    },
                    watchlist: [],
                    notifications: [],
                    invites: []
                }, { merge: true });
                navigate(`/user/${randomUserId}/settings`);
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="register-block">
            <h2>Login</h2>
            <form>
                <input type="text" placeholder="Email or User ID" className="input-group" required />
                <input type="password" placeholder="Password" className="input-group" required />
                <button type="submit" className="register-btn">Login</button>
            </form>
            <div className="divider">
                <span>or</span>
            </div>
            <button className="google-btn" onClick={handleGoogleSignIn}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--email-color)"><path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path></svg>
                Login with Google
            </button>
            <div className="toggle-link">
                <span>Don't have an account? </span>
                <Link to="/register/signup">Create one</Link>
            </div>
        </div>
    );
}

export default RegisterLogin;
