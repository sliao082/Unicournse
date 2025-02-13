import { useState } from 'react';
import './style.css';

const BrowseReportProblem = () => {
    const [showModal, setShowModal] = useState(false);

    const handleReportClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <button className="report-problem-button" onClick={handleReportClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path></svg>            
                Report
            </button>
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="report-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Report a Problem</h2>
                        <form className="report-form">
                            <label htmlFor="problem-category">Select Category:</label>
                            <select id="problem-category" name="problemCategory">
                                <option value="">Select a category</option>
                                <option value="bug">Bug</option>
                                <option value="feature">Feature Request</option>
                                <option value="other">Other</option>
                            </select>
                            <label htmlFor="problem-description">Description:</label>
                            <textarea
                                id="problem-description"
                                name="problemDescription"
                                rows="4"
                                placeholder="Describe the problem..."
                            ></textarea>
                            <button type="button" className="modal-report-button">Report</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default BrowseReportProblem;
