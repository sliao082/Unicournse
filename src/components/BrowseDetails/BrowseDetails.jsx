import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../util/db';

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './style.css'

const BrowseDetails = () => {
    const { subj, code } = useParams();
    const [courseData, setCourseData] = useState(null);

    // Demo resources for the sidebar
    const resources = [
        {
            title: "Lecture Slides",
            description: "Clean and concise lecture slides.",
            link: "/resources/lecture-slides"
        },
        {
            title: "Practice Problems",
            description: "Extra problems for hands-on practice.",
            link: "/resources/practice-problems"

        },
        {
            title: "Video Tutorials",
            description: "In-depth video tutorials that explain key concepts.",
            link: "/resources/video-tutorials"
        },
        {
            title: "Reading Materials",
            description: "Additional readings and research papers.",
            link: "/resources/reading-materials"
        }
    ];

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const docRef = doc(db, "Courses", subj);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const courseList = docSnap.data().info;
                    const foundCourse = courseList.find(course => course.code.toString() === code);
                    if (foundCourse) {
                        setCourseData(foundCourse);
                    } else {
                        console.error("Course not found");
                    }
                } else {
                    console.error("No such subject found in Firestore!");
                }
            } catch (err) {
                console.error("Error fetching course:", err);
            }
        };

        if (subj && code) {
            fetchCourse();
        }
    }, [subj, code, db]);

    if (!courseData) {
        return <div>Loading course data...</div>;
    }

    return (
        <>
            <div className='browse-container' style={{ width: '70%' }}>
                <div className="browse-details-block">
                    <div className="browse-details-info">
                        <div className="browse-details-info-content">
                            <h3>{subj} {courseData.code}: {courseData.name}</h3>
                            <Link to={`/browse/subject/${subj}`} className='browse-details-info-link'>Back to Subject</Link>
                        </div>
                        {/* <div className="browse-details-info-gpa">
                            <CircularProgressbarWithChildren  value={courseData.gpa} maxValue={4} styles={buildStyles({
                                textSize: '1rem',
                                pathColor: '#78bdff',
                                textColor: '#78bdff',
                                trailColor: 'none'
                            })}>
                                <h3>GPA: {courseData.gpa}</h3>
                            </CircularProgressbarWithChildren >
                        </div> */}
                    </div>
                    <h2 className='browse-details-headings'>Comments</h2>
                    <div className="browse-details-comments">
                        <div className="browse-details-comments-item">
                            <div className="browse-details-comments-item-profile">
                                <div className="browse-details-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>This course is very informative and engaging.</p>
                        </div>
                        <div className="browse-details-comments-item">
                            <div className="browse-details-comments-item-profile">
                                <div className="browse-details-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>I found the lectures to be quite insightful.</p>
                        </div>
                        <div className="browse-details-comments-item">
                            <div className="browse-details-comments-item-profile">
                                <div className="browse-details-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>The professor explains concepts very clearly.</p>
                        </div>
                        <div className="browse-details-comments-item">
                            <div className="browse-details-comments-item-profile">
                                <div className="browse-details-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>I enjoyed the class discussions and activities.</p>
                        </div>
                        <div className="browse-details-comments-item">
                            <div className="browse-details-comments-item-profile">
                                <div className="browse-details-comments-item-profile-img"></div>
                                <h3>Anonymous</h3>
                                <span>2024 - 01 - 12</span>
                            </div>
                            <p>The course material is well-organized and easy to follow.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="browse-resources-block">
                <h2 className="browse-resources-title">Resources</h2>
                <div className="browse-resources-list">
                    {resources.map((resource) => (
                        <Link to={resource.link} className="resource-card" key={resource.title}>
                            <div className="resource-card-image"></div>
                            <div className="resource-card-content">
                                <h3 className="resource-card-title">{resource.title}</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--shadow-color)">
                                    <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path>
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BrowseDetails