import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './style.css';

const HomeBrowseSubjectsCard = ({to, containerClassName, containerStyle, circle1Style, circle2Style, title, subtitle, sectionList, textContent, deleteButton}) => {
    return (
        <Link to={to} className={containerClassName} style={containerStyle}>
            <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={circle1Style}></div>
            <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={circle2Style}></div>
            {sectionList && sectionList.length > 0 ? (
                <div className="user-profile-browse-subjects-section">
                    <p className="user-profile-browse-subjects-section-title">{title}</p>
                    <p className="user-profile-browse-subjects-section-label">Sections: </p>
                    <div className="user-profile-browse-subjects-section-item">
                        {sectionList.map((section, index) => (
                            <p key={index}>
                                {section.code} {section.type}
                            </p>
                        ))}
                    </div>
                </div>
            ) : (
                textContent || (
                    <>
                        <p className="browse-subjects-card-text">{title}</p>
                        {subtitle && <p className="browse-subjects-card-subtext">{subtitle}</p>}
                    </>
                )
            )}
            {deleteButton && (
                <button className="browse-subjects-card-delete-button" onClick={(e) => onDeleteSection(title, section.code)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--button-color)"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                </button>
            )}
        </Link>
    );
};

HomeBrowseSubjectsCard.propTypes = {
    to: PropTypes.string.isRequired,
    containerClassName: PropTypes.string,
    containerStyle: PropTypes.object,
    circle1Style: PropTypes.object,
    circle2Style: PropTypes.object,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    sectionList: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string,
            type: PropTypes.string
        })
    ),
    textContent: PropTypes.node
};

HomeBrowseSubjectsCard.defaultProps = {
    containerClassName: 'browse-subjects-card',
    containerStyle: {},
    circle1Style: {},
    circle2Style: {},
    title: '',
    subtitle: '',
    sectionList: [],
    textContent: null
};

export default HomeBrowseSubjectsCard;
