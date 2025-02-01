import { Link, useParams } from 'react-router-dom';

import './style.css'

const BrowseCourse = () => {
    const { subj } = useParams();
    
    const handleItemClick = (e) => {
        const browseMainCol2 = document.querySelector('.browse-main-col-2');
        if (e.currentTarget.classList.contains('browse-main-close-btn')) {
            browseMainCol2.style.opacity = 0;
            browseMainCol2.style.transform = 'translateY(10px)';
            return;
        }
        const code = e.currentTarget.querySelector('.browse-main-code').textContent;
        const name = e.currentTarget.querySelector('p').textContent;
        if (browseMainCol2.style.opacity === '1' && code === browseMainCol2.querySelector('h2').textContent.split(' ')[1].replace(':', '')) {
            browseMainCol2.style.opacity = 0;
            browseMainCol2.style.transform = 'translateY(10px)';
            if (e.currentTarget.querySelector('.browse-main-code').classList.contains('clicked')) {
                e.currentTarget.querySelector('.browse-main-code').classList.remove('clicked');
            }
        } else {
            browseMainCol2.querySelector('h2').textContent = `${subj} ${code}: ${name}`;
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

    return (
        <>
            <div className="browse-container" style={{ width: '80%' }}>
                <div className="search-block">
                    <button className="search-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color"><path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path></svg></button>
                    <input type="text" placeholder="Search for courses" />
                </div>
                <div className="browse-main-subject-block">
                    <div className="browse-main-col-1">
                        <h1 className='browse-main-letter'>{ subj }</h1>
                        <div className="browse-main-item" onClick={handleItemClick}>
                            <h3 className="browse-main-code">101</h3>
                            <p>Intro Asian American Studies</p>
                        </div>
                        <div className="browse-main-item" onClick={handleItemClick}>
                            <h3 className="browse-main-code">102</h3>
                            <p>Agricultural and Biological Engineering</p>
                        </div>
                        <div className="browse-main-item" onClick={handleItemClick}>
                            <h3 className="browse-main-code">103</h3>
                            <p>Accountancy</p>
                        </div>
                        <div className="browse-main-item" onClick={handleItemClick}>
                            <h3 className="browse-main-code">104</h3>
                            <p>Agricultural and Consumer Economics</p>
                        </div>
                    </div>
                    <div className="browse-main-col-2">
                        <h2></h2>
                        <span className='browse-info-attr'>Credits: 3 &nbsp; | &nbsp; Avg. GPA: 3.75</span>
                        <p className='browse-info-desc'>Interdisciplinary introduction to the basic concepts and approaches in Asian American Studies. Surveys the various dimensions of Asian American experiences including history, social organization, literature, arts, and politics.</p>
                        <h3>Sections</h3>
                        <div className="browse-main-section-list">
                            <Link className="browse-main-section-list-item" to={`/browse/subject/${subj}/101/AL1`}>
                                <h4>AL1</h4>
                                <p>Lecture</p>
                                <span>POT 1</span>
                                <p>09:00 - 09:50</p>
                                <span>MWF</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>
                                {/* <p>Literatures, Cultures, & Ling | Room 1030</p>
                                <p>Siglos, D/Wang, Y</p> */}
                            </Link>
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
                    <div className="browse-filter-list-item unclicked">
                        <div className="browse-filter-circle" style={{ background: 'linear-gradient(90deg, var(--details-color-2) 0%, #46dde9 40%, #ededfa 80%)' }}></div>
                        <p>100-Level courses</p>
                    </div>
                    <div className="browse-filter-list-item unclicked">
                        <div className="browse-filter-circle" style={{ background: 'linear-gradient(90deg, var(--details-color-3) 0%, #f9a826 40%, #ededfa 80%)' }}></div>
                        <p>200-Level courses</p>
                    </div>
                    <div className="browse-filter-list-item unclicked">
                        <div className="browse-filter-circle" style={{ background: 'linear-gradient(90deg, var(--details-color-3) 0%, #f9a826 40%, #ededfa 80%)' }}></div>
                        <p>300-Level courses</p>
                    </div>
                    <div className="browse-filter-list-item unclicked">
                        <div className="browse-filter-circle" style={{ background: 'linear-gradient(90deg, var(--details-color-3) 0%, #f9a826 40%, #ededfa 80%)' }}></div>
                        <p>400-Level courses</p>
                    </div>
                    <div className="browse-filter-list-item unclicked">
                        <div className="browse-filter-circle" style={{ background: 'linear-gradient(90deg, var(--details-color-3) 0%, #f9a826 40%, #ededfa 80%)' }}></div>
                        <p>500-Level courses</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BrowseCourse