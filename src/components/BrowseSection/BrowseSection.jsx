import { CircularProgressbarWithChildren , buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './style.css'

const BrowseSection = () => {
    return (
        <>
            <div className='browse-container' style={{ width: '70%' }}>
                <div className="browse-section-block">
                    <div className="browse-section-info">
                        <div className="browse-section-info-content">
                            <h3>AAS 101 Asian American Studies</h3>
                            <p>Section AL1 &nbsp; | &nbsp; Type: Lecture</p>
                        </div>
                        <div className="browse-section-info-gpa">
                            <CircularProgressbarWithChildren  value={3.75} maxValue={4} styles={buildStyles({
                                textSize: '1rem',
                                pathColor: '#78bdff',
                                textColor: '#78bdff',
                                trailColor: 'none'
                            })}>
                                <h3>GPA: 3.75</h3>
                            </CircularProgressbarWithChildren >
                        </div>
                    </div>
                    <h2 className='browse-section-headings'>Attributes</h2>
                    <div className="browse-section-subinfo">
                        <p>Time: MWF 09:00 - 09:30 &nbsp; | &nbsp; Location: Campus Instructional Facility</p>
                        <p>Professor: Solomon, Brad &nbsp; | &nbsp; RMP:<span></span><span></span><small>4.5</small><a href="https://www.ratemyprofessors.com/professor/2873724" target='blank'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--secondary-text-color)"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path></svg></a></p>
                    </div>
                    <h2 className='browse-section-headings'>Comments</h2>
                    <div className="browse-section-comments">
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>This course is very informative and engaging.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>I found the lectures to be quite insightful.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>The professor explains concepts very clearly.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>I enjoyed the class discussions and activities.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>The course material is well-organized and easy to follow.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>Overall, a great learning experience!</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>This course is very informative and engaging.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>I found the lectures to be quite insightful.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>The professor explains concepts very clearly.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>I enjoyed the class discussions and activities.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>The course material is well-organized and easy to follow.</p>
                        </div>
                        <div className="browse-section-comments-item">
                            <div className="browse-section-comments-item-profile">
                                <div className="browse-section-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>Overall, a great learning experience!</p>
                        </div>
                    </div>
                    <h2 className='browse-section-headings'>Resources</h2>
                </div>
            </div>
            <div className="browse-related-block"></div>
        </>
    )
}

export default BrowseSection