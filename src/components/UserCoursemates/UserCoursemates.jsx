import './style.css'

const UserCoursemates = () => {
    const coursemates = [
        {
            id: 1,
            name: "Sarah Johnson",
            gender: "Female",
            major: "Computer Science",
            email: "s.johnson@university.edu",
            image: "https://example.com/sarah.jpg" // Add image URLs
        },
        {
            id: 2,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        },
        {
            id: 3,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        },
        {
            id: 4,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        },
        {
            id: 5,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        },
        {
            id: 6,
            name: "Michael Chen",
            gender: "Male",
            major: "Data Science",
            email: "m.chen@university.edu",
            image: "https://example.com/michael.jpg"
        }
    ];

    return (
        <div className="user-main-block">
            <div className="user-course-list">
                <div className="user-course-item">
                    <div className="course-icon"></div>
                    <p>CS 124</p>
                </div>
                <div className="user-course-item">
                    <div className="course-icon"></div>
                    <p>CS 128</p>
                </div>
                <div className="user-course-item">
                    <div className="course-icon"></div>
                    <p>CS 173</p>
                </div>
                <div className="user-course-item">
                    <div className="course-icon"></div>
                    <p>CS 173</p>
                </div>
                <div className="user-course-item">
                    <div className="course-icon"></div>
                    <p>CS 173</p>
                </div>
                <div className="user-course-item">
                    <div className="course-icon"></div>
                    <p>CS 173</p>
                </div>
                <div className="user-course-item">
                    <div className="course-icon"></div>
                    <p>CS 173</p>
                </div>
                <div className="user-course-item">
                    <div className="course-icon"></div>
                    <p>CS 173</p>
                </div>
            </div>
            <h2 className='user-course-headings'>CS 124</h2>
            <div className="user-coursemate-list">
                {coursemates.map((mate) => (
                    <div key={mate.id} className="user-coursemate-card">
                        <div className="user-img-container">
                            <div className="user-coursemate-img"></div>
                            <h3>{mate.name}</h3>
                        </div>
                        <div className="user-info">
                            <p className="user-meta">
                                <span className="gender">{mate.gender}</span> •
                                <span className="major"> {mate.major}</span>
                            </p>
                            <div className="user-email-section">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='var(--button-color)'>
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                <span>{mate.email}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserCoursemates