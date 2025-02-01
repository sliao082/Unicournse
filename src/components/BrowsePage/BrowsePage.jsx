// import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import BrowseSmallNavBar from '../BrowseSmallNavBar/BrowseSmallNavBar';
import './style.css'

const BrowsePage = () => {
    // const [colleges, setColleges] = useState([]);
    // const [filteredSubjects, setFilteredSubjects] = useState([]);
    // const [selectedCollege, setSelectedCollege] = useState(null);
    // const [searchTerm, setSearchTerm] = useState('');
    
    // const handleSearchChange = (e) => {
    //     const term = e.target.value.toLowerCase();
    //     setSearchTerm(term);
    //     if (term === '') {
    //         setFilteredSubjects(subjectData);
    //     } else {
    //         setFilteredSubjects(
    //             subjectData.filter(subject => 
    //                 subject.code.toLowerCase().includes(term) || 
    //                 subject.name.toLowerCase().includes(term)
    //             )
    //         );
    //     }
    // };

    // useEffect(() => {
    //     setColleges(collegeData);
    //     setFilteredSubjects(subjectData);
    // }, []);

    // const handleCollegeClick = (collegeName) => {
    //     if (selectedCollege === collegeName) {
    //         setSelectedCollege(null);
    //         setFilteredSubjects(subjectData);
    //     } else {
    //         setSelectedCollege(collegeName);
    //         const filtered = subjectData.filter(subject => subject.college === collegeName);
    //         setFilteredSubjects(filtered);
    //     }
    // };

    return (
        <div className="container">
            <BrowseSmallNavBar />
            <Outlet />
        </div>
    )
}

export default BrowsePage;