import React from 'react';
import { useDispatch } from 'react-redux';
import { getProjectByProjectID } from '../../actions/projectActions';
import Utils from '../../utils';
import './ProjectCard.scss';
import toast from "react-hot-toast";
import Toaster from "react-hot-toast";

const ProjectCard = (props) => {
    const { project, history } = props;

    const dispatch = useDispatch();
    
    const goToProject = () => {
        dispatch(getProjectByProjectID(project?.ID))
            .then(() => {
                history.push(`/project/${project?.ProjectNumber}/projectInformation`)
            }).catch((response) => {
            alert("Error! Can't load the project");
        });
    }

    return (
        <div 
            className='project-card' 
            onClick={goToProject}
            style={{ 
                backgroundImage: `url(${project?.ThumbnailURL})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className='card-container'>
                <Toaster position="top-center" />
                <div className='top-section'>
                    <div className='lot-number'>
                        {project?.ProjectNumber}
                        <span className={'float-right mr-3 bottom-title'}>
                            {project?.Status}
                        </span>
                    </div>
                    <div className='project-name'>{project?.ProjectName}</div>
                </div>
                
                <div className='address-section'>
                    <div>
                        {project?.StreetAddress1} {project?.City}
                    </div>
                    <div>
                        {project?.State} {project?.Zip}
                    </div>
                </div>

                <div className='d-flex justify-content-center align-items-end bottom-section'>
                    <div className='date-col'>
                        <div className='bottom-title'>Permit Date</div>
                        <div className='bottom-text'>{Utils.formatDateDashes(project?.PermitDate)}</div>
                    </div>
                    <div className='date-col'>
                        <div className='bottom-title'>C.O. Date</div>
                        <div className='bottom-text'>{Utils.formatDateDashes(project?.OccupencyCreated)}</div>
                    </div>
                    <div className='date-col'>
                        <div className='bottom-title'>Closed On</div>
                        <div className='bottom-text'>{Utils.formatDateDashes(project?.CloseCreated)}</div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default ProjectCard;
