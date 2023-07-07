import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { copyProject } from '../../actions/projectActions';
import Utils from '../../utils';
import './ProjectHeader.scss';
import ProjectPlaceholder from '../../assets/images/project_placeholder-image.png';

const ProjectHeader = () => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const refreshThumbnail = useSelector(state => state.project.refreshThumbnail);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [projectCopyName, setProjectCopyName] = useState(project?.ProjectName);

    const projectStatusMap = {
        1: 'Open',
        2: 'Completed',
        3: 'Closed'
    }

    const cancelModal = () => {
        setProjectCopyName(project?.ProjectName);

        setShowModal(false);
    }

    const saveAsNewProject = () => {
        if (!project?.ID) return;

        setIsLoading(true);

        const projectNameObj = { projectName: projectCopyName };

        dispatch(copyProject(project?.ID, projectNameObj))
            .then((project) => {
                setProjectCopyName(project.ProjectName);
                setIsLoading(false);
                cancelModal();
            })
            .catch(() => {
                setIsLoading(false);
                alert('Something went wrong creating copy of project try again');
            })
    }

    const saveNewProjectModal = () => {
        return (
            <Modal
                size='md'
                centered
                show={showModal}
                className='new-project-modal'
                onHide={() => setShowModal(false)}
            >
                <Modal.Body className='modal-container'>
                    <div className='page-title'>Save As New Project</div>
                    <Form>
                        <Form.Label className='input-label'>
                            Project Name
                        </Form.Label>
                        <Form.Control
                            className='input-gray'
                            value={projectCopyName}
                            onChange={(e) => setProjectCopyName(e.target.value)}
                        />
                    </Form>
                    <div className='d-flex justify-content-center mt-3'>
                        {isLoading ? (
                            <Spinner
                                animation='border'
                                variant='primary'
                            />
                        ) : (
                            <>
                                <Button
                                    variant='link'
                                    className='cancel'
                                    onClick={cancelModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className='primary-gray-btn next-btn ml-3'
                                    onClick={saveAsNewProject}
                                >
                                    Save
                                </Button>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <div className='project-header'>
            <div className='d-flex flex-wrap justify-content-between'>
                <div className='d-flex pt-2 flex-wrap'>
                    <div className='project-image justify-content-center d-flex'>
                        {refreshThumbnail ? (
                            <div className='spinner'>
                                <Spinner
                                    animation='border'
                                    variant='primary'
                                />
                            </div>
                        ) : (
                            <img
                                alt='project'
                                height='119'
                                width='167'
                                src={project?.ThumbnailURL+ `?${new Date().getTime()}`  || ProjectPlaceholder}
                            />
                        )}
                    </div>
                    <div>
                        <div className='text'>
                            {project?.ProjectNumber}
                            <i className='fas fa-share-square ml-5 share-icon'></i>
                        </div>

                        <div className='pt-2 d-flex'>
                            <div className='project-name'>{project?.ProjectName}</div>
                        </div>

                        <div className='d-flex'>
                            {project?.StreetAddress1}
                        </div>

                        <div className='d-flex'>
                            {project?.City}{project?.City ? "," : ""} {project?.State} {project?.Zip}
                        </div>

                        <div className='mt-1 d-flex'>
                            <Button
                                variant='link'
                                className='link-btn'
                                onClick={() => setShowModal(true)}
                            >
                                <i className='fas fa-file-download mr-2 save-icon'></i>
                                Save as New Project
                            </Button>
                        </div>
                    </div>
                </div>

                {saveNewProjectModal()}

                <div className='middle-section'>
                    <div className='bold-text'>
                        {project?.Customers?.[0]?.FirstName}{' '}{project?.Customers?.[0]?.LastName}
                    </div>
                    <div className='d-flex flex-wrap'>
                        <div className='pr-3 text phone'>
                            <i className='fas fa-phone mr-2'></i>
                            <a href={`tel:+1${project?.Customers?.[0]?.Phone}`}>
                                {project?.Customers?.[0]?.Phone || '000-000-0000'}
                            </a>
                        </div>

                        <div className='text email'>
                            <i className='fas fa-envelope mr-2'></i>
                            <a href={`mailto:${project?.Customers?.[0]?.Email}`}>
                                {project?.Customers?.[0]?.Email}
                            </a>
                        </div>
                    </div>
                    <div className='d-flex flex-wrap'>
                        <div className='pr-3 text phone'>
                            <i className='fas fa-phone mr-2'></i>
                            <a href={`tel:+1${project?.Customers?.[1]?.Phone}`}>
                                {project?.Customers?.[1]?.Phone || '000-000-0000'}
                            </a>
                        </div>

                        <div className='text email'>
                            <i className='fas fa-envelope mr-2'></i>
                            <a href={`mailto:${project?.Customers?.[1]?.Email}`}>
                                {project?.Customers?.[1]?.Email}
                            </a>
                        </div>
                    </div>
                    <div className='d-flex pt-3'>
                        <div className='bold-text pr-3'>
                            Closed On
                            {'    '}
                            {Utils.formatDateDashes(project?.CloseDate)}
                        </div>

                        {(project?.StatusID !== 2 && project?.BuildTime === null) &&
                            <div className='bold-text pl-3'>Build Time</div>
                        }
                    </div>
                </div>

                <div className='end-section'>
                    <div className='d-flex pt-2 justify-content-end'>
                        <div className='pt-1 pr-3 text'>
                            Status: <span className='bold-text pl-1'>{projectStatusMap[project?.StatusID]}</span>
                        </div>
                        <button className='snapshot-btn'>Project Snapshot</button>
                    </div>

                    <div className='d-flex total justify-content-end text'>
                        Project Total: $0.00 Margin: $0.00
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectHeader;
