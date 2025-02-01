import { useParams } from 'react-router-dom';
import './style.css'

const UserProfile = () => {
    const { id } = useParams();

    const handleTodoClick = (event) => {
        const checkbox = event.currentTarget.querySelector('.user-side-info-checkbox');
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
            const todoItem = event.currentTarget;
            setTimeout(() => {
                todoItem.remove();
            }, 500);
        }
    };

    const addBtnClick = () => {
        const input = document.querySelector('.user-side-info-add-input');
        if (input.style.opacity === '0') {
            input.style.opacity = '1';
            input.style.border = '2px solid var(--shadow-color)';
            input.style.height = '50px';
            input.style.margin = '10px 0';
            input.focus();
        } else {
            input.style.opacity = '0';
            input.style.border = '0px solid var(--shadow-color)';
            input.style.height = '0';
            input.style.margin = '0';
        }
    };

    const handleAddInputChange = (event) => {
        if (event.key === 'Enter') {
            const input = document.querySelector('.user-side-info-add-input');
            if (input.value) {
                const todoItem = document.createElement('div');
                todoItem.className = 'user-side-info-item';
                todoItem.addEventListener('click', handleTodoClick);
                todoItem.innerHTML = `<input type="checkbox" class='user-side-info-checkbox' />
                <p>${input.value}</p>`;
                const todoList = document.querySelector('.user-side-info');
                const addInput = document.querySelector('.user-side-info-add-input');
                todoList.insertBefore(todoItem, addInput);
                input.value = '';
                input.style.opacity = '0';
                input.style.border = '0px solid var(--shadow-color)';
                input.style.height = '0';
                input.style.margin = '0';
            }
        }
    }

    return (
        <>
            <div className="user-main-block">
                <div className="user-main-header">
                    <h2>Hi, UserName!</h2>
                    <div className="user-header-pf">
                        <div className="user-pf-name">User Name</div>
                        <div className="user-pf-img"></div>
                    </div>
                </div>
                <div className="user-main-info" style={{ width: '76%' }}>
                    <div className="user-info-item" style={{ width: '22%' }}>
                        <p>Gender:</p>
                        <input type="text" placeholder='N/A'/>
                    </div>
                    <div className="user-info-item" style={{ width: '22%' }}>
                        <p>Year:</p>
                        <input type="text" placeholder='N/A'/>
                    </div>
                    <div className="user-info-item" style={{ width: '46%' }}>
                        <p>Major:</p>
                        <input type="text" placeholder='N/A'/>
                    </div>
                    <div className="user-info-item" style={{ width: 'calc(44% + 10% / 3)' }}>
                        <p>Email:</p>
                        <input type="text" placeholder='N/A'/>
                    </div>
                    <div className="user-info-item" style={{ width: '46%', justifyContent: 'flex-end' }}>
                        <label className="user-switch">
                            <p>Visible to others</p>
                            <input type="checkbox" />
                            <span className="user-slider round"></span>
                        </label>
                        <button type="button" className='user-btn'>Save</button>
                    </div>
                </div>
                <div className="user-main-courses">
                    <h2>Your Courses</h2>
                    <div className="browse-subjects-list" style={{ justifyContent: 'flex-start', margin: '0' }}>
                        <div className="browse-subjects-card" style={{ marginRight: '4%', marginBottom: '4dvh', width: '26%' }}>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: 'var(--details-color-2)' }}></div>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: '#46dde963' }}></div>
                            <p>AAS 101<br /><span>Intro Asian American Studies</span></p>
                        </div>
                        <div className="browse-subjects-card" style={{ marginRight: '4%', marginBottom: '4dvh', width: '26%' }}>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: 'var(--details-color-3)' }}></div>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: '#f9a82663' }}></div>
                            <p>AAS 101<br /><span>Intro Asian American Studies</span></p>
                        </div>
                        <div className="browse-subjects-card" style={{ marginRight: '4%', marginBottom: '4dvh', width: '26%' }}>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: 'var(--details-color-4)' }}></div>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: '#ec7ada63' }}></div>
                            <p>AAS 101<br /><span>Intro Asian American Studies</span></p>
                        </div>
                        <div className="browse-subjects-card" style={{ marginRight: '4%', marginBottom: '4dvh', width: '26%' }}>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: 'var(--details-color-2)' }}></div>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: '#46dde963' }}></div>
                            <p>AAS 101<br /><span>Intro Asian American Studies</span></p>
                        </div>
                        <div className="browse-subjects-card" style={{ marginRight: '4%', marginBottom: '4dvh', width: '26%' }}>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: 'var(--details-color-3)' }}></div>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: '#f9a82663' }}></div>
                            <p>AAS 101<br /><span>Intro Asian American Studies</span></p>
                        </div>
                        <div className="browse-subjects-card" style={{ marginRight: '4%', marginBottom: '4dvh', width: '26%' }}>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-1" style={{ backgroundColor: 'var(--details-color-4)' }}></div>
                            <div className="browse-subjects-card-circle browse-subjects-card-circle-2" style={{ backgroundColor: '#ec7ada63' }}></div>
                            <p>AAS 101<br /><span>Intro Asian American Studies</span></p>
                        </div>
                    </div>
                </div>
                <div className="user-side-info-block">
                    <h2>To-Do List</h2>
                    <div className="user-side-info">
                        <div className="user-side-info-item" onClick={handleTodoClick}>
                            <input type="checkbox" className='user-side-info-checkbox' />
                            <p>Finish AAS 101 Assignment</p>
                        </div>
                        <div className="user-side-info-item" onClick={handleTodoClick}>
                            <input type="checkbox" className='user-side-info-checkbox' />
                            <p>Study for AAS 101 Midterm</p>
                        </div>
                        <div className="user-side-info-item" onClick={handleTodoClick}>
                            <input type="checkbox" className='user-side-info-checkbox' />
                            <p>Meet with AAS 101 Group</p>
                        </div>
                        <input type='text' className="user-side-info-add-input" placeholder='Press Enter to add' style={{ opacity: '0' }} onKeyDown={handleAddInputChange} />
                        <button type='button' className="user-side-info-add" onClick={addBtnClick}>+</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile