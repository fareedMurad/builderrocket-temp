import React from 'react';
import { } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setSelectedProject } from '../../actions/projectActions';
import Utils from '../../utils';
import './ProjectCard.scss';

const ProjectCard = (props) => {
    const { project, history } = props;
    const dispatch = useDispatch();
    
    const goToProject = () => {
        dispatch(setSelectedProject(project))
        .then(() => {
            history.push(`/project/${project?.projectNumber}`)
        })
        console.log('project', project);
    }

    return (
        <div className='project-card mr-5' onClick={goToProject}>
            <div className='lot-number'>{project?.projectNumber}</div>
            <div className='project-name'>{project?.projectName}</div>
            
            <div className='address'>
                {`${project?.streetAddress1} ${project?.city}`}
                {/* <p className='address'>{`${project?.state} ${project?.zip}`}</p> */}
            </div>

            <div className='d-flex justify-content-center align-items-end bottom-section'>
                <div className='date-col'>
                    <div className='bottom-title'>Permit Date</div>
                    <div className='bottom-text'>{Utils.formatDateDashes(project?.permitDate)}</div>
                </div>
                <div className='date-col'>
                    <div className='bottom-title'>C.O. Date</div>
                    <div className='bottom-text'>{Utils.formatDateDashes(project?.closedCreated)}</div>
                </div>
                <div className='date-col'>
                    <div className='bottom-title'>Closed On</div>
                    <div className='bottom-text'>{project?.closedDate}</div>
                </div>
            </div>
        </div>
    )

}

export default ProjectCard;