import { Outlet } from 'react-router-dom';

import BrowseSmallNavBar from '../BrowseSmallNavBar/BrowseSmallNavBar';
import BrowseReportProblem from '../BrowseReportProblem/BrowseReportProblem';

import './style.css'

const BrowsePage = () => {
    return (
        <div className="container">
            <BrowseSmallNavBar />
            <Outlet />
            <BrowseReportProblem />
        </div>

    )
}

export default BrowsePage;