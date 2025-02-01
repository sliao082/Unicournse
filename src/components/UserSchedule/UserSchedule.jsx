import './style.css'

const UserSchedule = () => {
    const generateTimeSlots = () => {
        const times = [];
        for (let hour = 8; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12;
                const time = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
                times.push(time);
            }
        }
        return times;
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = generateTimeSlots();
    console.log(times);
    return (
        <>
            <div className="user-main-block">
                <div className="user-schedule-block">
                    <div className="schedule-container">
                        <div className="days-header">
                            <div className="time-label-header"></div>
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
                            <div className="day-column">
                                <div className="time-slot" style={{ height: 'calc(100% * (75 / 780))', backgroundColor: 'var(--details-color-1)', top: 'calc((12 - 8) * 4 * (var(--user-schedule-height) + var(--user-schedule-gap)) + 0.5 * var(--user-schedule-height))' }} data-time="8:00 AM" data-day="M"></div>
                            </div>
                            <div className="day-column">
                                <div className="time-slot" style={{ height: 'calc(100% * (50 / 780))', backgroundColor: 'var(--details-color-2)', top: 'calc((9.5 - 8) * 4 * (var(--user-schedule-height) + var(--user-schedule-gap)) + 0.5 * var(--user-schedule-height))' }} data-time="8:00 AM" data-day="T"></div>
                            </div>
                            <div className="day-column">
                                <div className="time-slot" style={{ height: 'calc(100% * (75 / 780))', backgroundColor: 'var(--details-color-3)', top: 'calc((11 - 8) * 4 * (var(--user-schedule-height) + var(--user-schedule-gap)) + 0.5 * var(--user-schedule-height))' }} data-time="8:00 AM" data-day="W"></div>
                            </div>
                            <div className="day-column">
                                <div className="time-slot" style={{ height: 'calc(100% * (50 / 780))', backgroundColor: 'var(--details-color-2)', top: 'calc((9.5 - 8) * 4 * (var(--user-schedule-height) + var(--user-schedule-gap)) + 0.5 * var(--user-schedule-height))' }} data-time="8:00 AM" data-day="R"></div>
                            </div>
                            <div className="day-column">
                                <div className="time-slot" style={{ height: 'calc(100% * (75 / 780))', backgroundColor: 'var(--details-color-3)', top: 'calc((11 - 8) * 4 * (var(--user-schedule-height) + var(--user-schedule-gap)) + 0.5 * var(--user-schedule-height))' }} data-time="8:00 AM" data-day="F"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-side-info-block">
                    <h2>Course List</h2>
                    <div className="user-side-info">
                        <div className="course-list-item" style={{ width: '92%', marginTop: '3dvh' }}>
                            <div className="course-icon"></div>
                            <div className="course-details">
                                <h3>Bayes Theorem</h3>
                                <p>STAT 431</p>
                            </div>
                        </div>
                        <div className="course-list-item" style={{ width: '92%', marginTop: '3dvh' }}>
                            <div className="course-icon"></div>
                            <div className="course-details">
                                <h3>Bayes Theorem</h3>
                                <p>STAT 431</p>
                            </div>
                        </div>
                        <div className="course-list-item" style={{ width: '92%', marginTop: '3dvh' }}>
                            <div className="course-icon"></div>
                            <div className="course-details">
                                <h3>Bayes Theorem</h3>
                                <p>STAT 431</p>
                            </div>
                        </div>
                        <div className="course-list-item" style={{ width: '92%', marginTop: '3dvh' }}>
                            <div className="course-icon"></div>
                            <div className="course-details">
                                <h3>Bayes Theorem</h3>
                                <p>STAT 431</p>
                            </div>
                        </div>
                        <div className="course-list-item" style={{ width: '92%', marginTop: '3dvh' }}>
                            <div className="course-icon"></div>
                            <div className="course-details">
                                <h3>Bayes Theorem</h3>
                                <p>STAT 431</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserSchedule