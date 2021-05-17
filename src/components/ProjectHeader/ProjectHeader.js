import React from 'react';
import { Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Utils from '../../utils';
import './ProjectHeader.scss';

const ProjectHeader = () => {

    const statusMap = {
        1: 'Open',
        2: '',
        3: 'Closed'
    }

    const project = useSelector(state => state.project.project);

    console.log('Project Header', project);

    return (
        <div className='project-header'>
            {/* <Container> */}
                <div className='d-flex flex-wrap justify-content-around'>
                        <div className='d-flex pt-2'>
                            <Col>   
                                <div className='project-image d-flex'>
                                    <img 
                                        alt='project' 
                                        height='119' 
                                        width='167' 
                                        src={project?.thumbnailURL}
                                    />
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className='text'>Project # {project?.projectNumber} </div>

                                <div className='pt-2 d-flex'>
                                    <div className='project-name'>Project Name</div>   
                                    <div className='text pl-2 pt-1'>{project?.projectName}</div>
                                </div>

                                <div className='d-flex'>
                                    Address
                                    {'    '}
                                    {project?.streetAddress1}
                                </div>

                                <div className='pt-2'>
                                    <a href='/' className='text'>Save as New Project</a>
                                </div>
                            </Col>
                        </div>

                    <div>
                        <div className='bold-text pt-5'>Customer Name</div>
                        <div className='d-flex'>
                            <div className='pr-2 text'>Phone</div>
                            <div className='text'>Email Address {project?.customers?.[0]?.email}</div>
                        </div>
                        <div className='d-flex pt-3'>
                            <div className='bold-text pr-3'>
                                Closed On 
                                {'    '}
                                {Utils.formatDateDashes (project?.closeDate)}</div>
                            <div className='bold-text pl-3'>Build Time</div>
                        </div>
                    </div>


                    <div>
                        <div className='d-flex pt-3 justify-content-end'>
                            <div className='pr-3 text'>Status: <span className='bold-text'>{statusMap[project?.statusID]}</span></div>
                            <button className='snapshot-btn'>Project Snapshot</button>
                        </div>

                        <div className='d-flex total justify-content-end text'>
                            Project Total: $0.00 Margin: $0.00
                        </div>
                    </div>
                </div>
            {/* </Container> */}
        </div>
    )
}

export default ProjectHeader;
