import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from '../../util/db';

import './style.css';

const BrowseCourse = () => {
    const { subj } = useParams();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    // const [selectedSections, setSelectedSections] = useState([]);

    const db = getFirestore(app);

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
                        sections: course.sections.map(section => ({
                            id: section.code,
                            days: section.days,
                            loc: section.loc,
                            pot: section.pot,
                            prof: section.prof,
                            rmp: section.rmp,
                            room: section.room,
                            time: section.time,
                            type: section.type,
                        }))
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

    const handleItemClick = (e) => {
        const browseMainCol2 = document.querySelector('.browse-main-col-2');

        if (e.currentTarget.classList.contains('browse-main-close-btn')) {
            browseMainCol2.style.opacity = 0;
            browseMainCol2.style.transform = 'translateY(10px)';
            document.querySelectorAll('.browse-main-code').forEach(codeElement => {
                if (codeElement.classList.contains('clicked')) {
                    codeElement.classList.remove('clicked');
                }
            });
            return;
        }

        const code = e.currentTarget.querySelector('.browse-main-code').textContent;
        const name = e.currentTarget.querySelector('p').textContent;
        const credits = e.currentTarget.dataset.credits;
        const gpa = e.currentTarget.dataset.gpa;
        const desc = e.currentTarget.dataset.desc;

        const selectedCourse = courses.find(course => course.id.toString() === code);
        if (!selectedCourse) return;
        const sectionsByProf = {};
        selectedCourse.sections.forEach(section => {
            if (!sectionsByProf[section.prof]) {
                sectionsByProf[section.prof] = [];
            }
            sectionsByProf[section.prof].push(section);
        });

        const sectionListContainer = browseMainCol2.querySelector('.browse-main-section-list');
        sectionListContainer.innerHTML = '';
        Object.entries(sectionsByProf).forEach(([professor, sections]) => {
            const professorHeader = document.createElement('h4');
            professorHeader.className = 'browse-main-section-headings';
            const uniqueRMPs = [...new Set(sections.map(section => section.rmp || 'N/A'))];
            const uniqueGPAs = [...new Set(sections.map(section => section.gpa || 'N/A'))];
            console.log(uniqueRMPs);
            professorHeader.innerHTML = `
            ${professor}
            <div>
                <p>RMP: ${uniqueRMPs.join(' / ')}
                <a href="https://www.ratemyprofessors.com/search/professors/1112?q=${professor.replace("Prof. ", "")}" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                    <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path>
                    </svg>
                </a>
                </p>
                <p>Avg. GPA: ${uniqueGPAs.join(' / ')}</p>
            </div>
            `;
            sectionListContainer.appendChild(professorHeader);
            sections.forEach(section => {
            const sectionItem = document.createElement('div');
            sectionItem.className = 'browse-main-section-list-item';
            sectionItem.innerHTML = `
                <h4>${section.id}</h4>
                <p>${section.type}</p>
                <span>POT ${section.pot}</span>
                <p>${section.time}</p>
                <span>${section.days}</span>
                <div style="width: 100%; margin: 4px 0;"></div>
                <p>${section.loc} &nbsp; | &nbsp; Room ${section.room}</p>
            `;
            sectionListContainer.appendChild(sectionItem);
            });
        });

        if (browseMainCol2.style.opacity === '1' && code === browseMainCol2.querySelector('h2').textContent.split(' ')[1].replace(':', '')) {
            browseMainCol2.style.opacity = 0;
            browseMainCol2.style.transform = 'translateY(10px)';
            if (e.currentTarget.querySelector('.browse-main-code').classList.contains('clicked')) {
                e.currentTarget.querySelector('.browse-main-code').classList.remove('clicked');
            }
        } else {
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
        }
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
                    <button className="search-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path></svg></button>
                    <input type="text" placeholder="Search for courses" onChange={handleSearchChange} />
                </div>
                <div className="browse-main-subject-block">
                    <div className="browse-main-col-1">
                        <h1 className='browse-main-letter'>{subj}</h1>
                        {filteredCourses.map(course => (
                            <div key={course.id} className="browse-main-item" onClick={handleItemClick} data-code={course.id} data-gpa={course.gpa} data-credits={course.credits} data-desc={course.desc}>
                                <h3 className="browse-main-code">{course.id}</h3>
                                <p>{course.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="browse-main-col-2">
                        <h2></h2>
                        <span className='browse-info-attr'></span>
                        <p className='browse-info-desc'></p>
                        <h3>Sections</h3>
                        <div className="browse-main-section-list">
                            <div className="browse-main-section-list-item">
                                <h4>AL1</h4>
                                <p>Lecture</p>
                                <span>POT 1</span>
                                <p>09:00 - 09:50</p>
                                <span>MWF</span>
                                <div style={{ width: '100%', margin: '4px 0' }}></div>
                                <p>Literatures, Cultures, & Ling &nbsp; | &nbsp; Room 1030</p>
                            </div>
                            <div className="browse-main-section-list-item">
                                <h4>AL1</h4>
                                <p>Lecture</p>
                                <span>POT 1</span>
                                <p>09:00 - 09:50</p>
                                <span>MWF</span>
                                <div style={{ width: '100%', margin: '4px 0' }}></div>
                                <p>Literatures, Cultures, & Ling &nbsp; | &nbsp; Room 1030</p>
                            </div>
                        </div>
                        <button className="browse-main-close-btn" onClick={handleItemClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
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
