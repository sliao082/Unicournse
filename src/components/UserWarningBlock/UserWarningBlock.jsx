import './style.css';

const UserWarningBlock = ({ text, showWarning, setShowWarning, width }) => {
    return (
        <>
            {showWarning && (
                <div className="user-warning-block" style={{ width: width }}>
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