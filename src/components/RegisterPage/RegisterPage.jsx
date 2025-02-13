import React from 'react';
import { Outlet } from 'react-router-dom';
import './style.css';

function RegisterPage() {
    return (
        <div className="register-page">
            <div className="form-container">
                <Outlet />
                <div className="register-circle"></div>
                <div className="register-circle"></div>
            </div>
        </div>

    );
}

export default RegisterPage;
