import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../../util/auth';
import db from '../../util/db';
import { doc, getDoc } from 'firebase/firestore';
import UserWarningBlock from '../UserWarningBlock/UserWarningBlock';

import './style.css'

const UserSchedule = () => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [scheduleBlocks, setScheduleBlocks] = useState([]);
    const [warningText, setWarningText] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

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

    useEffect(() => {
        async function computeScheduleBlocks() {
            const blocks = [];
            const colors = [
                'var(--details-color-1)',
                'var(--details-color-2)',
                'var(--details-color-3)',
                'var(--details-color-4)',
                'var(--details-color-5)',
                'var(--details-color-6)',
            ];
            if (profileData?.courses && profileData.courses.length > 0) {
                for (let courseIndex = 0; courseIndex < profileData.courses.length; courseIndex++) {
                    const course = profileData.courses[courseIndex];
                    const backgroundColor = colors[courseIndex % colors.length];

                    const [subject, courseNumStr] = course.course.split(' ');
                    const courseNum = Number(courseNumStr);
                    const courseDocRef = doc(db, 'Courses', subject);
                    const courseDocSnap = await getDoc(courseDocRef);
                    if (!courseDocSnap.exists()) continue;
                    const courseData = courseDocSnap.data();
                    const courseInfo = courseData.info.find(info => Number(info.code) === courseNum);
                    if (!courseInfo || !courseInfo.sections) continue;

                    if (course.sections && course.sections.length > 0) {
                        for (const userSection of course.sections) {
                            let matchingSection = null;
                            for (const prof in courseInfo.sections) {
                                const sectionList = courseInfo.sections[prof].sectionList;
                                matchingSection = sectionList.find(sec =>
                                    sec.code === userSection.code
                                );
                                if (matchingSection) break;
                            }
                            if (matchingSection) {
                                const [startTimeStr, endTimeStr] = matchingSection.time.split(' - ').map(s => s.trim());
                                const start = parseTime(startTimeStr);
                                const end = parseTime(endTimeStr);
                                const startTotalMinutes = start.hour * 60 + start.minute;
                                const duration = (end.hour * 60 + end.minute) - startTotalMinutes;
                                const topCalc = `calc(((${start.hour} + ${start.minute}/60 - 8) * 4 * (var(--user-schedule-height) + var(--user-schedule-gap)) + 0.5 * var(--user-schedule-height)))`;
                                const heightCalc = `calc(100% * (${duration} / 780))`;
                                const daysStr = matchingSection.days;
                                for (const dayChar of daysStr.split('')) {
                                    blocks.push({
                                        courseName: course.course,
                                        day: dayChar,
                                        top: topCalc,
                                        height: heightCalc,
                                        time: matchingSection.time,
                                        loc: matchingSection.loc,
                                        room: matchingSection.room,
                                        code: matchingSection.code,
                                        backgroundColor: backgroundColor
                                    });
                                }
                            }
                        }
                    }
                }
            }
            setScheduleBlocks(blocks);
        }
        computeScheduleBlocks();
    }, [profileData]);

    const parseTime = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hour, minute] = time.split(':').map(Number);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        return { hour, minute };
    };

    useEffect(() => {
        const checkOverlaps = () => {
            const dayColumns = document.querySelectorAll('.day-column');

            dayColumns.forEach((dayColumn) => {
                const existingOverlays = dayColumn.querySelectorAll('.overlap-overlay');
                existingOverlays.forEach((overlay) => overlay.remove());
                const dayRect = dayColumn.getBoundingClientRect();
                const slots = dayColumn.querySelectorAll('.time-slot');

                for (let i = 0; i < slots.length; i++) {
                    const rectA = slots[i].getBoundingClientRect();
                    const relTopA = rectA.top - dayRect.top;
                    for (let j = i + 1; j < slots.length; j++) {
                        const rectB = slots[j].getBoundingClientRect();
                        const relTopB = rectB.top - dayRect.top;

                        if (
                            rectA.left < rectB.right &&
                            rectA.right > rectB.left &&
                            rectA.top < rectB.bottom &&
                            rectA.bottom > rectB.top
                        ) {
                            if (!showWarning) {
                                setWarningText("Overlapping sections detected. Please adjust your schedule to avoid conflicts.");
                                setShowWarning(true);
                            }
                            let higherRelTop, higherHeight, lowerRelTop;
                            if (relTopA <= relTopB) {
                                higherRelTop = relTopA;
                                higherHeight = rectA.height;
                                lowerRelTop = relTopB;
                            } else {
                                higherRelTop = relTopB;
                                higherHeight = rectB.height;
                                lowerRelTop = relTopA;
                            }
                            const overlayTop = lowerRelTop;
                            const overlayHeight = (higherRelTop + higherHeight) - lowerRelTop;

                            if (overlayHeight > 0) {
                                const overlayDiv = document.createElement('div');
                                overlayDiv.classList.add('overlap-overlay');
                                overlayDiv.style.position = 'absolute';
                                overlayDiv.style.left = '0';
                                overlayDiv.style.top = `${overlayTop}px`;
                                overlayDiv.style.width = '100%';
                                overlayDiv.style.height = `${overlayHeight}px`;
                                overlayDiv.style.background = 'repeating-linear-gradient(45deg, var(--button-color), var(--button-color) 10px, var(--selected-color) 10px, var(--selected-color) 13px)';
                                overlayDiv.style.opacity = '0.7';
                                overlayDiv.style.zIndex = '9';
                                dayColumn.appendChild(overlayDiv);
                            }
                        }
                    }
                }
            });
        };

        checkOverlaps();
    }, [scheduleBlocks]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            const timeStr = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
            times.push(timeStr);
        }
    }

    const handleCourseListItemClick = (e) => {
        const courseItem = e.currentTarget;
        const isAlreadyClicked = courseItem.classList.contains('clicked');

        if (isAlreadyClicked) {
            courseItem.classList.remove('clicked');
            courseItem.classList.add('unclicked');
        } else {
            const allCourseItems = document.querySelectorAll('.course-list-item');
            allCourseItems.forEach(item => {
                item.classList.remove('clicked');
                item.classList.add('unclicked');
            });
            courseItem.classList.remove('unclicked');
            courseItem.classList.add('clicked');
        }

        const sectionCode = courseItem.getAttribute('data-code');
        const courseNameElement = courseItem.querySelector('.course-details h3');
        const courseName = courseNameElement ? courseNameElement.innerText.trim() : '';
        const timeSlots = document.querySelectorAll('.time-slot');

        if (courseItem.classList.contains('clicked')) {
            timeSlots.forEach(slot => {
                const slotCode = slot.getAttribute('data-code');
                const slotCourseNameElement = slot.querySelector('.course-schedule-details h3');
                const slotCourseName = slotCourseNameElement ? slotCourseNameElement.innerText.trim() : '';

                if (slotCode === sectionCode && slotCourseName === courseName) {
                    slot.style.transform = 'scale(1.1)';
                    slot.style.boxShadow = '3px 3px 6px var(--shadow-color), -3px -3px 6px #fff';
                } else {
                    slot.style.transform = '';
                    slot.style.boxShadow = '2px 2px 4px var(--shadow-color), -2px -2px 4px #fff';
                }
            });
        } else {
            timeSlots.forEach(slot => {
                const slotCode = slot.getAttribute('data-code');
                const slotCourseNameElement = slot.querySelector('.course-schedule-details h3');
                const slotCourseName = slotCourseNameElement ? slotCourseNameElement.innerText.trim() : '';
                if (slotCode === sectionCode && slotCourseName === courseName) {
                    slot.style.transform = '';
                    slot.style.boxShadow = '2px 2px 4px var(--shadow-color), -2px -2px 4px #fff';
                }
            });
        }
    };

    if (!user) {
        return (
            <div className="user-main-block">
                <p>No user signed in</p>
            </div>
        );
    }

    return (
        <>
            <div className="user-main-block">
                <div className="user-schedule-block">
                    <div className="schedule-container">
                        <div className="days-header">
                            <div className="time-label-header">
                                
                            </div>
                            {days.map(day => (
                                <div key={day} className="day-header">{day}</div>
                            ))}
                        </div>
                        <div className="schedule-grid">
                            <div className="time-column">
                                {times.map((time, index) => (
                                    <div key={time} className="time-slot-label">
                                        {index % 4 === 0 ? (
                                            <p>{time}</p>
                                        ) : (
                                            <span>{time.replace(/ (AM|PM)$/, '')}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {['M', 'T', 'W', 'R', 'F'].map(dayLetter => (
                                <div key={dayLetter} className="day-column">
                                    {scheduleBlocks
                                        .filter(block => block.day === dayLetter)
                                        .map((block, i) => (
                                            <div key={i} className="time-slot"
                                                style={{ height: block.height, top: block.top, backgroundColor: block.backgroundColor }}
                                                data-time={block.time} data-loc={block.loc} data-room={block.room} data-day={block.day} data-code={block.code}>
                                                <div className="course-schedule-details">
                                                    <h3>{block.courseName}</h3>
                                                    <p>
                                                        {block.room} {block.loc}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    {showWarning && <UserWarningBlock text={warningText} showWarning={showWarning} setShowWarning={setShowWarning} width='48%' />}
                </div>
                <div className="user-side-info-block">
                    <h2>Your Sections</h2>
                    <div className="user-side-info">
                        {profileData?.courses && profileData.courses.length > 0 ? (
                            profileData.courses.flatMap((course, courseIndex) => {
                                if (course.sections && course.sections.length > 0) {
                                    return course.sections.map((section, secIndex) => (
                                        <div key={`${courseIndex}-${secIndex}`} className="course-list-item unclicked" style={{ width: '92%', marginTop: '3dvh' }} data-code={section.code} onClick={handleCourseListItemClick}>
                                            <div className="course-icon"></div>
                                            <div className="course-details">
                                                <h3>{course.course}</h3>
                                                <p>
                                                    {section.code} <b>|</b> {section.type}
                                                </p>
                                            </div>
                                        </div>
                                    ));
                                } else {
                                    return (
                                        <div key={courseIndex} className="course-list-item" style={{ width: '92%', marginTop: '3dvh' }}>
                                            <div className="course-icon"></div>
                                            <div className="course-details">
                                                <h3>{course.course}</h3>
                                                <p>No sections available</p>
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        ) : (
                            <p className='no-info-text' style={{ textAlign: 'center', fontSize: '.9rem', marginTop: '2dvh' }}>
                                You haven't added any sections yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserSchedule