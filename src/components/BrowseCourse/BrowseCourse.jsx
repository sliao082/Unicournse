import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from '../../util/db';
import auth from '../../util/auth';

import './style.css';

const BrowseCourse = () => {
    const { subj } = useParams();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedCourseCode, setSelectedCourseCode] = useState(null);
    const [courseLink, setCourseLink] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sectionFilter, setSectionFilter] = useState(null);
    const [availableSectionTypes, setAvailableSectionTypes] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const docRef = doc(db, "Courses", subj);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const courseList = docSnap.data().info.map(course => ({
                        id: course.code,
                        name: course.name,
                        gpa: course.gpa,
                        desc: course.description,
                        credits: course.credits,
                        sections: course.sections
                    }));

                    setCourses(courseList);
                    setFilteredCourses(courseList);
                } else {
                    console.error("No such subject found in Firestore!");
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        if (subj) fetchCourses();
    }, [subj]);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        if (term === '') {
            setFilteredCourses(courses);
        } else {
            setFilteredCourses(
                courses.filter(course =>
                    course.id.toString().toLowerCase().startsWith(term) ||
                    course.name.toLowerCase().includes(term)
                )
            );
        }
    };

    const getDetailsColor = (index) => {
        switch(index) {
            case 0: return 'var(--details-color-1)';
            case 1: return 'var(--details-color-2)';
            case 2: return 'var(--details-color-3)';
            default: return 'var(--details-color-1)';
        }
    };

    const handleSectionFilterClick = (type) => {
        if(sectionFilter === type) {
            setSectionFilter(null);
        } else {
            setSectionFilter(type);
        }
    };

    const renderSectionList = () => {
        const browseMainCol2 = document.querySelector('.browse-main-col-2');
        if (!browseMainCol2) return;
        const sectionListContainer = browseMainCol2.querySelector('.browse-main-section-list');
        sectionListContainer.innerHTML = '';
        if (!selectedCourse || !selectedCourse.sections) return;
        
        Object.entries(selectedCourse.sections).forEach(([professor, sectionsData]) => {
            const filteredSections = sectionFilter 
                ? sectionsData.sectionList.filter(section => section.type === sectionFilter) 
                : sectionsData.sectionList;
            if (filteredSections.length > 0) {
                const professorHeader = document.createElement('h4');
                professorHeader.className = 'browse-main-section-headings';
                professorHeader.innerHTML = `
                    Prof. ${professor}
                    <div>
                        <p>RMP: ${sectionsData.rmp === 0 ? 'N/A' : sectionsData.rmp}
                            <a href="https://www.ratemyprofessors.com/search/professors/1112?q=${professor}" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                                    <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path>
                                </svg>
                            </a>
                        </p>
                        <p>Avg. GPA: ${sectionsData.avg_gpa === 0 ? 'N/A' : sectionsData.avg_gpa}</p>
                    </div>
                `;
                sectionListContainer.appendChild(professorHeader);

                filteredSections.forEach(section => {
                    const sectionItem = document.createElement('div');
                    sectionItem.className = 'browse-main-section-list-item';
                    sectionItem.setAttribute('data-type', section.type);
                    sectionItem.setAttribute('data-code', section.code);

                    sectionItem.innerHTML = `
                        <h4>${section.code}</h4>
                        <p>${section.type}</p>
                        <span>POT ${section.pot}</span>
                        <p>${section.time}</p>
                        <span>${section.days}</span>
                        <div style="width: 100%; margin: 4px 0;"></div>
                        <p>${section.loc} &nbsp; | &nbsp; Room ${section.room}</p>
                        <p class='browse-main-section-list-item-add-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)">
                                <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
                            </svg> Add
                        </p>
                    `;
                    sectionListContainer.appendChild(sectionItem);
    
                    sectionItem.addEventListener('click', async () => {
                        const currentUser = auth.currentUser;
                        if (!currentUser) {
                            alert("You are not logged in.");
                            return;
                        }
    
                        const userDocRef = doc(db, 'Users', currentUser.uid);
                        const userDocSnap = await getDoc(userDocRef);
                        let coursesArr = [];
                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data();
                            coursesArr = userData.courses || [];
                        }
                        const courseIdentifier = `${subj} ${selectedCourseCode}`;
                        const existingCourseIndex = coursesArr.findIndex(entry => entry.course === courseIdentifier);
                        let isCurrentlyAdded = false;
                        if (existingCourseIndex !== -1) {
                            let courseEntry = coursesArr[existingCourseIndex];
                            if (!courseEntry.sections) courseEntry.sections = [];
                            const existingSectionIndex = courseEntry.sections.findIndex(sec => sec.type === section.type);
                            if (existingSectionIndex !== -1) {
                                if (courseEntry.sections[existingSectionIndex].code === section.code) {
                                    isCurrentlyAdded = true;
                                    courseEntry.sections.splice(existingSectionIndex, 1);
                                    if (courseEntry.sections.length === 0) {
                                        coursesArr.splice(existingCourseIndex, 1);
                                    } else {
                                        coursesArr[existingCourseIndex] = courseEntry;
                                    }
                                } else {
                                    courseEntry.sections[existingSectionIndex].code = section.code;
                                    coursesArr[existingCourseIndex] = courseEntry;
                                }
                            } else {
                                courseEntry.sections.push({
                                    code: section.code,
                                    type: section.type
                                });
                                coursesArr[existingCourseIndex] = courseEntry;
                            }
                        } else {
                            coursesArr.push({
                                course: courseIdentifier,
                                sections: [{
                                    code: section.code,
                                    type: section.type
                                }]
                            });
                        }
                        await updateDoc(userDocRef, { courses: coursesArr });
    
                        const sameTypeItems = sectionListContainer.querySelectorAll(`.browse-main-section-list-item[data-type="${section.type}"]`);
                        sameTypeItems.forEach(item => {
                            const addBtn = item.querySelector('.browse-main-section-list-item-add-btn');
                            if (item === sectionItem) {
                                if (isCurrentlyAdded) {
                                    addBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"> <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path></svg>Add';
                                } else {
                                    addBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 11H17V13H7V11Z"></path></svg>Added';
                                }
                            } else {
                                addBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"> <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path></svg>Add';
                            }
                        });
                    });
                });
            }
        });
    
        if (auth.currentUser) {
            (async () => {
                const userDocRef = doc(db, 'Users', auth.currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const coursesArr = userData.courses || [];
                    const courseIdentifier = `${subj} ${selectedCourseCode}`;
                    const courseEntry = coursesArr.find(entry => entry.course === courseIdentifier);
                    if (courseEntry && courseEntry.sections) {
                        const sectionItems = sectionListContainer.querySelectorAll('.browse-main-section-list-item');
                        sectionItems.forEach(item => {
                            const currentType = item.getAttribute('data-type');
                            const currentCode = item.getAttribute('data-code');
                            const addBtn = item.querySelector('.browse-main-section-list-item-add-btn');
                            if (courseEntry.sections.some(sec => sec.type === currentType && sec.code === currentCode)) {
                                addBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 11H17V13H7V11Z"></path></svg>Added';
                            } else {
                                addBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path></svg>Add';
                            }
                        });
                    }
                }
            })();
        }
    };

    useEffect(() => {
        if (selectedCourse) {
            renderSectionList();
        }
    }, [selectedCourse, sectionFilter]);

    const handleCourseItemClick = (e) => {
        const browseMainCol2 = document.querySelector('.browse-main-col-2');

        if (e.currentTarget.classList.contains('browse-main-close-btn')) {
            browseMainCol2.style.opacity = 0;
            browseMainCol2.style.transform = 'translateY(10px)';
            document.querySelectorAll('.browse-main-code').forEach(codeElement => {
                if (codeElement.classList.contains('clicked')) {
                    codeElement.classList.remove('clicked');
                }
            });
            setSelectedCourse(null);
            setAvailableSectionTypes([]);
            setSectionFilter(null);
            return;
        }

        const code = e.currentTarget.querySelector('.browse-main-code').textContent;
        setSelectedCourseCode(code);
        const name = e.currentTarget.querySelector('p').textContent;
        const credits = e.currentTarget.dataset.credits;
        const gpa = e.currentTarget.dataset.gpa;
        const desc = e.currentTarget.dataset.desc;
        const computedLink = `/browse/subject/${subj}/${code}`;
        setCourseLink(computedLink);

        const foundCourse = courses.find(course => course.id.toString() === code);

        if (browseMainCol2.style.opacity === '1' && code === browseMainCol2.querySelector('h2').textContent.split(' ')[1].replace(':', '')) {
            browseMainCol2.style.opacity = 0;
            browseMainCol2.style.transform = 'translateY(10px)';
            document.querySelectorAll('.browse-main-code').forEach(codeElement => {
                if (codeElement.classList.contains('clicked')) {
                    codeElement.classList.remove('clicked');
                }
            });
            setSelectedCourse(null);
            setAvailableSectionTypes([]);
            setSectionFilter(null);
            return;
        }

        browseMainCol2.querySelector('h2').textContent = `${subj} ${code}: ${name}`;
        browseMainCol2.querySelector('.browse-info-attr').textContent = `Credits: ${credits} | Avg. GPA: ${gpa}`;
        browseMainCol2.querySelector('.browse-info-desc').textContent = desc;
        browseMainCol2.style.opacity = 1;
        browseMainCol2.style.transform = 'translateY(0)';
        document.querySelectorAll('.browse-main-code').forEach(codeElement => {
            if (codeElement !== e.currentTarget.querySelector('.browse-main-code')) {
                codeElement.classList.remove('clicked');
            }
        });
        if (!e.currentTarget.querySelector('.browse-main-code').classList.contains('clicked')) {
            e.currentTarget.querySelector('.browse-main-code').classList.add('clicked');
        }

        if (!foundCourse || !foundCourse.sections) return;

        setSelectedCourse(foundCourse);
        const typesSet = new Set();
        Object.values(foundCourse.sections).forEach(prof => {
            prof.sectionList.forEach(section => typesSet.add(section.type));
        });
        setAvailableSectionTypes(Array.from(typesSet));
        setSectionFilter(null);
    };

    const handleLevelClick = (level) => {
        if (selectedLevel === level) {
            setSelectedLevel(null);
            setFilteredCourses(courses);
        } else {
            setSelectedLevel(level);
            const filtered = courses.filter(course => Math.floor(course.id / 100) === level);
            setFilteredCourses(filtered);
        }
    };

    return (
        <>
            <div className="browse-container" style={{ width: '80%' }}>
                <div className="search-block">
                    <button className="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)">
                            <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                        </svg>
                    </button>
                    <input type="text" placeholder="Search for courses" onChange={handleSearchChange} />
                </div>
                <div className="browse-main-subject-block">
                    <div className="browse-main-col-1">
                        <h1 className='browse-main-letter'>{subj}</h1>
                        {filteredCourses.map(course => (
                            <div key={course.id} className="browse-main-item" onClick={handleCourseItemClick} data-code={course.id} data-gpa={course.gpa} data-credits={course.credits} data-desc={course.desc}>
                                <h3 className="browse-main-code">{course.id}</h3>
                                <p>{course.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="browse-main-col-2">
                        <h2></h2>
                        <span className='browse-info-attr'></span>
                        <p className='browse-info-desc'></p>
                        <h3>
                            Sections
                            {availableSectionTypes.length > 0 && (
                                <div className="section-tags-container">
                                    <p>Filter by:</p>
                                    {availableSectionTypes.map((type, index) => (
                                        <button key={type} 
                                            className={`section-tag ${sectionFilter === type ? 'selected' : ''}`}
                                            onClick={() => handleSectionFilterClick(type)}
                                            style={{ background: getDetailsColor(index) }}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </h3>
                        <div className="browse-main-section-list" style={{ height: 'calc(80% - 158px)', overflowY: 'scroll' }}>
                        </div>
                        <Link to={courseLink} className='user-btn browse-details-btn'>
                            Reviews
                        </Link>
                        <button className="browse-main-close-btn" onClick={handleCourseItemClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)">
                                <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="browse-filter-container" style={{ width: '20%' }}>
                <h2>Browse by Course Level</h2>
                <div className="browse-filter-list">
                    {[1, 2, 3, 4, 5].map(level => (
                        <div key={level} className={`browse-filter-list-item ${selectedLevel === level ? 'clicked' : 'unclicked'}`} onClick={() => handleLevelClick(level)}>
                            <div className="browse-filter-circle" style={{ background: 'linear-gradient(90deg, var(--details-color-2) 0%, #46dde9 40%, #ededfa 80%)' }}></div>
                            <p>{level}00-Level courses</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BrowseCourse;
