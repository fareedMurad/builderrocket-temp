import React from 'react';
import { } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setSelectedProject } from '../../actions/projectActions';
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
            <div>
                <p className='lot-number'>{project?.projectNumber}</p>
            </div>
            <div>
                <p>{project?.projectName}</p>
            </div>
            <div>
                <p className='address'>{`${project?.streetAddress1} ${project?.city}`}</p>
                {/* <p className='address'>{`${project?.state} ${project?.zip}`}</p> */}
            </div>

            <div className='d-flex justify-content-center bottom-section'>
                <div className='date-col'>
                    <p className='bottom-title'>Permit Date</p>
                    <p className='bottom-text'>{project?.permitDate}</p>
                </div>
                <div className='date-col'>
                    <p className='bottom-title'>C.O. Date</p>
                    <p className='bottom-text'>{project?.coDate}</p>
                </div>
                <div className='date-col'>
                    <p className='bottom-title'>Closed On</p>
                    <p className='bottom-text'>{project?.closedDate}</p>
                </div>
            </div>
        </div>
    )

}

export default ProjectCard;