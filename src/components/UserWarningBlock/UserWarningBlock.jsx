import React, { useState, useEffect } from 'react';

import './style.css';

const UserWarningBlock = ({ text, showWarning, setShowWarning }) => {
    return (
        <>
            {showWarning && (
                <div className="user-warning-block">
                    <h2>Warning!</h2>
                    <p>{text}</p>
                    <button className="close-btn" onClick={() => setShowWarning(false)}>
                        Close
                    </button>
                </div>
            )}
        </>
    );
};

export default UserWarningBlock;