import React from 'react';
import { } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getProjectByProjectNumber } from '../../actions/projectActions';
import Utils from '../../utils';
import './ProjectCard.scss';

const ProjectCard = (props) => {
    const { project, history } = props;

    const dispatch = useDispatch();
    
    const goToProject = () => {
        dispatch(getProjectByProjectNumber(project?.projectNumber))
            .then(() => {
                history.push(`/project/${project?.projectNumber}`)
            });
    }

    return (
        <div 
            className='project-card' 
            onClick={goToProject}
            style={{ 
                backgroundImage: `url(${project?.thumbnailURL})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className='card-container'>
                <div className='top-section'>
                    <div className='lot-number'>{project?.projectNumber}</div>
                    <div className='project-name'>{project?.projectName}</div>
                </div>
                
                <div className='address-section'>
                    <div>
                        {project?.streetAddress1} {project?.city}
                    </div>
                    <div>
                        {project?.state} {project?.zip}
                    </div>
                </div>

                <div className='d-flex justify-content-center align-items-end bottom-section'>
                    <div className='date-col'>
                        <div className='bottom-title'>Permit Date</div>
                        <div className='bottom-text'>{Utils.formatDateDashes(project?.permitDate)}</div>
                    </div>
                    <div className='date-col'>
                        <div className='bottom-title'>C.O. Date</div>
                        <div className='bottom-text'>{Utils.formatDateDashes(project?.occupencyCreated)}</div>
                    </div>
                    <div className='date-col'>
                        <div className='bottom-title'>Closed On</div>
                        <div className='bottom-text'>{Utils.formatDateDashes(project?.closeCreated)}</div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProjectCard;