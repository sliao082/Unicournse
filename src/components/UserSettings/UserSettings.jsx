import './style.css'

const UserSettings = () => {
    
    return (
        <div className="user-main-block">
            <div className="settings-container">
                <div className="settings-header">
                    <h2>Account Settings</h2>
                </div>
                <div className="settings-section">
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
                                <input type="text" placeholder='N/A' />
                            </div>
                            <div className="profile-user-content">
                                <p>User ID</p>
                                <input type="text" placeholder='N/A' />
                                <small>You may only change User ID every 7 days</small>    
                            </div>
                        </div>
                    </div>

                    <div className="user-main-info">
                        <div className="user-info-item" style={{ width: '22%' }}>
                            <p>Gender:</p>
                            <input type="text" placeholder='N/A' />
                        </div>
                        <div className="user-info-item" style={{ width: '22%' }}>
                            <p>Year:</p>
                            <input type="text" placeholder='N/A' />
                        </div>
                        <div className="user-info-item" style={{ width: '46%' }}>
                            <p>Major:</p>
                            <input type="text" placeholder='N/A' />
                        </div>
                        <div className="user-info-item" style={{ width: 'calc(44% + 10% / 3)' }}>
                            <p>Email:</p>
                            <input type="text" placeholder='N/A' />
                        </div>
                        <div className="user-info-item" style={{ width: '46%', justifyContent: 'flex-end' }}>
                            <label className="user-switch">
                                <p>Visible to others</p>
                                <input type="checkbox" id='vis-switch' />
                                <span className="user-slider round"></span>
                            </label>
                            <button type="button" className='user-btn'>Save</button>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="settings-section">
                    <h3 className="section-title">Security</h3>
                    <div className="security-items">
                        <div className="setting-item">
                            <div className="item-content">
                                <h4>Two-Factor Authentication</h4>
                                <p>Add an extra layer of security</p>
                            </div>
                            <label className="user-switch">
                                <input type="checkbox" id='tfa-switch' />
                                <span className="user-slider round"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="item-content">
                                <h4>Password</h4>
                                <p>Last changed 2 weeks ago</p>
                            </div>
                            <button className="user-btn">Change Password</button>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="settings-section">
                    <h3 className="section-title">Preferences</h3>
                    <div className="preference-items">
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
                            <button className="user-btn">Configure</button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="settings-section danger-zone">
                    <h3 className="section-title">Danger Zone</h3>
                    <div className="danger-items">
                        <div className="setting-item">
                            <div className="item-content">
                                <h4>Deactivate Account</h4>
                                <p>Temporarily disable your account</p>
                            </div>
                            <button className="danger-button">Deactivate</button>
                        </div>

                        <div className="setting-item">
                            <div className="item-content">
                                <h4>Delete Account</h4>
                                <p>Permanently remove all data</p>
                            </div>
                            <button className="danger-button">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserSettings