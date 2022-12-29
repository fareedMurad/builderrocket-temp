import React from 'react';
import { } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getProjectByProjectID, deleteProject } from '../../actions/projectActions';
import { withSwal } from 'react-sweetalert2';
import toast from 'react-hot-toast';
import Utils from '../../utils';
import './ProjectCard.scss';

const ProjectCard = withSwal((props) => {
    const { project, history, swal } = props;

    const dispatch = useDispatch();
    
    const goToProject = () => {
        dispatch(getProjectByProjectID(project?.ID))
            .then(() => {
                history.push(`/project/${project?.ProjectNumber}/projectInformation`)
            });
    }

    function handleDelete(e){
        swal.fire({
            title: 'Confirm Delete',
            text: 'Deleting project will also delete all its files,documents & any related info, do you want to continue?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            showCancelButton: true
        }).then((result) => handleConfirmDelete(result));
        e.stopPropagation();
        return false;
    }

    function handleConfirmDelete(result){
        if(result.isConfirmed){
            dispatch(deleteProject(project.ID)).then(result => {
                if(result.success){
                    toast.success('Project deleted successfully');
                    window.location.reload(true);
                }else{
                    toast.error(result.message);
                }
            });
        }
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
                <div className='top-section'>
                    <div className='lot-number'>
                        {project?.ProjectNumber}
                        <a onClick={handleDelete.bind(this)} className={'fa-stack pointer float-right mr-3 '}>
                            <i className="fas fa-circle fa-stack-2x text-white-50"></i>
                            <i className="fas fa-lg fa-trash text-danger fa-stack-1x fa-inverse"></i>
                        </a>
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

});

export default withSwal(ProjectCard);
