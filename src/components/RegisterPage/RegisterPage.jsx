import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './style.css';

function RegisterPage() {
    return (
        <div className="register-page">
            <Link to="../" className="register-logo"></Link>
            <div className="form-container">
                <Outlet />
                <div className="register-circle"></div>
                <div className="register-circle"></div>
            </div>
        </div>

    );
}

export default RegisterPage;
