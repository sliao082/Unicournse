import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import collegeData from '../../content/college.json';
import subjectData from '../../content/subject.json';
import './style.css'

const BrowseSubject = () => {    
    const [colleges, setColleges] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        if (term === '') {
            setFilteredSubjects(subjectData);
        } else {
            setFilteredSubjects(
                subjectData.filter(subject => 
                    subject.code.toLowerCase().includes(term) || 
                    subject.name.toLowerCase().includes(term)
                )
            );
        }
    };

    useEffect(() => {
        setColleges(collegeData);
        setFilteredSubjects(subjectData);
    }, []);

    const handleCollegeClick = (collegeName) => {
        if (selectedCollege === collegeName) {
            setSelectedCollege(null);
            setFilteredSubjects(subjectData);
        } else {
            setSelectedCollege(collegeName);
            const filtered = subjectData.filter(subject => subject.college === collegeName);
            setFilteredSubjects(filtered);
        }
    };

    return (
        <>
            <div className="browse-container" style={{ width: '70%' }}>
                <div className="search-block">
                    <button className="search-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path></svg></button>
                    <input type="text" placeholder="Search for subjects" onChange={handleSearchChange} />
                </div>
                <div className="browse-main-block">
                    {filteredSubjects.reduce((acc, subject, index) => {
                        const firstLetter = subject.code.charAt(0).toUpperCase();
                        if (!acc.letters.includes(firstLetter)) {
                            acc.letters.push(firstLetter);
                            acc.elements.push(<h1 key={firstLetter} className='browse-main-letter'>{firstLetter}</h1>);
                        }
                        acc.elements.push(
                            <Link key={index} className="browse-main-item" to={`/browse/subject/${subject.code}`} style={{ width: '50%' }}>
                                <h3 className="browse-main-code">{subject.code}</h3>
                                <p>{subject.name}</p>
                            </Link>
                        );
                        return acc;
                    }, { letters: [], elements: [] }).elements}
                </div>
            </div>
            <div className="browse-filter-container" style={{ width: '30%' }}>
                <h2>Browse by College</h2>
                <div className="browse-filter-list">
                    {colleges.map((college, index) => (
                        <div key={index} className={`browse-filter-list-item ${selectedCollege === college.college ? 'clicked' : 'unclicked'}`} onClick={() => handleCollegeClick(college.college)}>
                            <div className="browse-filter-circle" style={{ background: `linear-gradient(90deg, ${college.color1} 0%, ${college.color2} 40%, #ededfa 80%)` }}></div>
                            <p>{college.college}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BrowseSubject