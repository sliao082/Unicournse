import React from 'react';
import logo from '../../assets/react.svg';
import feature1 from '../../assets/feature_1.png';
// import feature2 from '../../assets/feature2.png';
// import feature3 from '../../assets/feature3.png';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';

import HomeSideBar from '../HomeSideBar/HomeSideBar';
import HomeCourseBar from '../HomeCourseBar/HomeCourseBar';
import HomeBrowseSubjectsCard from '../HomeBrowseSubjectsCard/HomeBrowseSubjectsCard';

import './style.css'

const HomePage = () => {
    const subjects = [
        {
            code: "CS",
            name: "Computer Science",
            subtitle: "Grainger College of Engineering",
            circle1Color: "var(--details-color-dark-green)",
            circle2Color: "#A8FFD884"
        },
        {
            code: "STAT",
            name: "Statistics",
            subtitle: "College of Liberal Arts & Sciences",
            circle1Color: "var(--details-color-dark-yellow)",
            circle2Color: "#F9D68984"
        },
        {
            code: "BUS",
            name: "Business",
            subtitle: "Gies College of Business",
            circle1Color: "var(--details-color-dark-blue)",
            circle2Color: "#46dde984"
        },
        {
            code: "ECE",
            name: "Electrical Engineering",
            subtitle: "Grainger College of Engineering",
            circle1Color: "var(--details-color-dark-green)",
            circle2Color: "#A8FFD884"
        },
        {
            code: "PSYC",
            name: "Psychology",
            subtitle: "College of Liberal Arts & Sciences",
            circle1Color: "var(--details-color-dark-yellow)",
            circle2Color: "#F9D68984"
        },
        {
            code: "ACCY",
            name: "Accountancy",
            subtitle: "Gies College of Business",
            circle1Color: "var(--details-color-dark-blue)",
            circle2Color: "#46dde984"
        }
    ];

    return (
        <div className="container">
            <div className="nav-bar">
                <h1>Unicournse</h1>
                <div className="nav-bar-user">
                    <Link className='nav-bar-user-icon' to="/user/id/settings">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)">
                            <path d="M2.21232 14.0601C1.91928 12.6755 1.93115 11.2743 2.21316 9.94038C3.32308 10.0711 4.29187 9.7035 4.60865 8.93871C4.92544 8.17392 4.50032 7.22896 3.62307 6.53655C4.3669 5.3939 5.34931 4.39471 6.53554 3.62289C7.228 4.50059 8.17324 4.92601 8.93822 4.60914C9.7032 4.29227 10.0708 3.32308 9.93979 2.21281C11.3243 1.91977 12.7255 1.93164 14.0595 2.21364C13.9288 3.32356 14.2964 4.29235 15.0612 4.60914C15.8259 4.92593 16.7709 4.5008 17.4843 3.62356C18.606 4.36739 19.6052 5.3498 20.377 6.53602C19.4993 7.22849 19.0739 8.17373 19.3907 8.93871C19.7076 9.70369 20.6768 10.0713 21.7871 9.94028C22.0801 11.3248 22.0682 12.726 21.7862 14.06C20.6784 13.9293 19.7075 14.2969 19.3907 15.0616C19.0739 15.8264 19.4991 16.7714 20.3784 17.4848C19.8425 18.6064 18.6501 19.6056 17.4848 20.3775C16.7714 19.4998 15.8261 19.0743 15.0612 19.3912C14.2962 19.7081 13.9286 20.6773 14.0596 21.7875C12.675 22.0806 11.2738 22.0687 9.93989 21.7867C10.0706 20.6768 9.70301 19.708 8.93822 19.3912C8.17343 19.0744 7.22848 19.4995 6.53606 20.3768C5.39341 19.843 4.39422 18.6506 3.62241 17.4643C4.5001 16.7719 4.92552 15.8266 4.60865 15.0616C4.29179 14.2967 3.32259 13.9291 2.21232 14.0601ZM3.99975 12.2104C5.09956 12.5148 6.00718 13.2117 6.45641 14.2984C6.90564 15.3808 6.75667 16.5154 6.19421 17.5083C6.29077 17.61 6.38998 17.7092 6.49173 17.8056C7.4846 17.2432 8.61912 17.0943 9.70359 17.5435C10.7881 17.9927 11.485 18.9002 11.7894 19.9999C11.9295 20.0037 12.0697 20.0038 12.2099 20.0001C12.5143 18.9003 13.2112 17.9927 14.2958 17.5435C15.3803 17.0942 16.5149 17.2432 17.5078 17.8057C17.6096 17.7091 17.7087 17.6099 17.8051 17.5081C17.2427 16.5153 17.0938 15.3807 17.543 14.2984C17.9922 13.2118 18.8997 12.5149 19.9994 12.2105C20.0032 12.0704 20.0033 11.9301 19.9996 11.7899C18.8998 11.4856 17.9922 10.7886 17.543 9.70407C17.0937 8.61953 17.2427 7.48494 17.8052 6.49204C17.7086 6.39031 17.6094 6.2912 17.5076 6.19479C16.5148 6.75717 15.3803 6.9061 14.2958 6.4569C13.2113 6.0077 12.5144 5.10016 12.21 4.00044C12.0699 3.99666 11.9297 3.99659 11.7894 4.00024C11.4851 5.10005 10.7881 6.00767 9.70359 6.4569C8.61904 6.90613 7.48446 6.75715 6.49155 6.1947C6.38982 6.29126 6.29071 6.39047 6.19431 6.49222C6.75668 7.48509 6.90561 8.61961 6.45641 9.70407C6.00721 10.7885 5.09967 11.4855 3.99995 11.7899C3.99617 11.93 3.9961 12.0702 3.99975 12.2104ZM11.9997 15.0002C10.3428 15.0002 8.99969 13.657 8.99969 12.0002C8.99969 10.3433 10.3428 9.00018 11.9997 9.00018C13.6565 9.00018 14.9997 10.3433 14.9997 12.0002C14.9997 13.657 13.6565 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z"></path>
                        </svg>
                    </Link>
                    <Link className='nav-bar-user-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)">
                            <path d="M22 20H2V18H3V11.0314C3 6.04348 7.02944 2 12 2C16.9706 2 21 6.04348 21 11.0314V18H22V20ZM5 18H19V11.0314C19 7.14806 15.866 4 12 4C8.13401 4 5 7.14806 5 11.0314V18ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path>
                        </svg>
                    </Link>
                    <Link className='nav-bar-user-name' to='/user/id/profile'>
                        <p>User Name</p>
                        <div className='user-img'></div>
                    </Link>
                </div>
            </div>
            <HomeSideBar />
            <div className="main-body">
                <div className="body-info">
                    <div className="body-info-text">
                        <h2>Course<br />Planning Helper</h2>
                        <p>A course planning helper that helps you plan wisely and efficiently. It is a tool that integrate all the information you need to select the most suitable courses for you.</p>
                    </div>
                    <div className="body-info-img">
                        <img src={logo} alt="" />
                    </div>
                </div>
                <div className="body-details">
                    <div className="details-card">
                        <h1>285</h1>
                        <p>Courses For Spring 2025</p>
                    </div>
                    <div className="details-card">
                        <div style={{ width: '85%', aspectRatio: '1/1' }}>
                            <CircularProgressbarWithChildren
                                value={4.5}
                                maxValue={5}
                                styles={buildStyles({
                                    textSize: '1rem',
                                    pathColor: '#78bdff',
                                    textColor: '#78bdff',
                                    trailColor: 'none'
                                })}
                            >
                                <h1>4.5 / 5</h1>
                                <p>Prof. Ratings</p>
                            </CircularProgressbarWithChildren>
                        </div>
                    </div>
                    <div className="details-card">
                        <h1>120+</h1>
                        <div className="details-bar">
                            <span style={{ backgroundColor: 'var(--details-color-5)', height: '60%' }}></span>
                            <span style={{ backgroundColor: 'var(--details-color-4)', height: '80%' }}></span>
                            <span style={{ backgroundColor: 'var(--details-color-5)', height: '70%' }}></span>
                            <span style={{ backgroundColor: 'var(--details-color-4)', height: '90%' }}></span>
                        </div>
                        <p>Student Reviews</p>
                    </div>
                </div>
                <div className="browse-subjects">
                    <h1>Browse Subjects</h1>
                    <div className="browse-subjects-list">
                        {subjects.map((subject, index) => (
                            <Link to={`/browse/subject/${subject.code}`} key={index} className="browse-subjects-card" style={{ margin: '2dvh 2%', minHeight: '120px' }}>
                                <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: subject.circle1Color }}></div>
                                <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: subject.circle2Color }}></div>
                                <p className="browse-subjects-card-text">
                                    {subject.name}<br /><span>{subject.subtitle}</span>
                                </p>
                            </Link>
                        ))}
                    </div>
                    <Link className="neu-button" to='/browse'>All Subjects</Link>
                </div>
                <div className="browse-geneds">
                    <h1>
                        Looking for some easy GenEds? <br />
                        Check for our GenEd recommendations!
                    </h1>
                    <div className="geneds-cards-container">
                        <div className="geneds-cards">
                            <div className="geneds-card-block">
                                <div className="geneds-card">Humanities and the Arts</div>
                                <svg className='second' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff" style={{ backgroundColor: 'var(--details-color-1)' }}><path d="M38-428q-18-36-28-73T0-576q0-112 76-188t188-76q63 0 120 26.5t96 73.5q39-47 96-73.5T696-840q112 0 188 76t76 188q0 38-10 75t-28 73q-11-19-26-34t-35-24q9-23 14-45t5-45q0-78-53-131t-131-53q-81 0-124.5 44.5T480-616q-48-56-91.5-100T264-760q-78 0-131 53T80-576q0 23 5 45t14 45q-20 9-35 24t-26 34ZM0-80v-63q0-44 44.5-70.5T160-240q13 0 25 .5t23 2.5q-14 20-21 43t-7 49v65H0Zm240 0v-65q0-65 66.5-105T480-290q108 0 174 40t66 105v65H240Zm540 0v-65q0-26-6.5-49T754-237q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM480-210q-57 0-102 15t-53 35h311q-9-20-53.5-35T480-210Zm-320-70q-33 0-56.5-23.5T80-360q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-280Zm640 0q-33 0-56.5-23.5T720-360q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-280Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-440q0 50-34.5 85T480-320Zm0-160q-17 0-28.5 11.5T440-440q0 17 11.5 28.5T480-400q17 0 28.5-11.5T520-440q0-17-11.5-28.5T480-480Zm0 40Zm1 280Z" /></svg>
                            </div>
                            <div className="geneds-card-block">
                                <div className="geneds-card">Social and Behavioral Science</div>
                                <svg className='first' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff" style={{ backgroundColor: 'var(--details-color-2)' }}><path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-54 80h80l6-50q8-3 14.5-7t11.5-9l46 20 40-68-40-30q2-8 2-16t-2-16l40-30-40-68-46 20q-5-5-11.5-9t-14.5-7l-6-50h-80l-6 50q-8 3-14.5 7t-11.5 9l-46-20-40 68 40 30q-2 8-2 16t2 16l-40 30 40 68 46-20q5 5 11.5 9t14.5 7l6 50Zm40-100q-25 0-42.5-17.5T420-520q0-25 17.5-42.5T480-580q25 0 42.5 17.5T540-520q0 25-17.5 42.5T480-460Z" /></svg>
                                <svg className='second' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff" style={{ backgroundColor: 'var(--details-color-2)' }}><path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-54 80h80l6-50q8-3 14.5-7t11.5-9l46 20 40-68-40-30q2-8 2-16t-2-16l40-30-40-68-46 20q-5-5-11.5-9t-14.5-7l-6-50h-80l-6 50q-8 3-14.5 7t-11.5 9l-46-20-40 68 40 30q-2 8-2 16t2 16l-40 30 40 68 46-20q5 5 11.5 9t14.5 7l6 50Zm40-100q-25 0-42.5-17.5T420-520q0-25 17.5-42.5T480-580q25 0 42.5 17.5T540-520q0 25-17.5 42.5T480-460Z" /></svg>
                            </div>
                            <div className="geneds-card-block">
                                <div className="geneds-card">Natural Sciences and Technology</div>
                                <svg className='first' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff" style={{ backgroundColor: 'var(--details-color-3)' }}><path d="M200-120v-80h200v-80q-83 0-141.5-58.5T200-480q0-61 33.5-111t90.5-73q8-34 35.5-55t62.5-21l-22-62 38-14-14-36 76-28 12 38 38-14 110 300-38 14 14 38-76 28-12-38-38 14-24-66q-15 14-34.5 21t-39.5 5q-22-2-41-13.5T338-582q-27 16-42.5 43T280-480q0 50 35 85t85 35h320v80H520v80h240v80H200Zm346-458 36-14-68-188-38 14 70 188Zm-126-22q17 0 28.5-11.5T460-640q0-17-11.5-28.5T420-680q-17 0-28.5 11.5T380-640q0 17 11.5 28.5T420-600Zm126 22Zm-126-62Zm0 0Z" /></svg>
                            </div>
                        </div>
                    </div>
                    <Link className="neu-button" to='/geneds'>All GenEds</Link>
                </div>
                <div className="feature-block">
                    <div className="feature-title">
                        <div className="feature-img" style={{ backgroundImage: `url(${feature1})` }}></div>
                        <div className="feature-img"></div>
                        <div className="feature-img"></div>
                        <h1>Want a more personalized experience? Join us!</h1>
                    </div>
                    <div className="join-buttons">
                        <Link className="neu-button" to="/register/login" style={{ margin: '0' }}>Log In</Link>
                        <Link className="neu-button" to="/register/signup" style={{ margin: '0' }}>Sign Up</Link>
                    </div>
                </div>
            </div>
            <HomeCourseBar />
        </div>
    )
}

export default HomePage