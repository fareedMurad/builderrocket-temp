import React from 'react';
import { Col } from 'react-bootstrap';
import './ProjectHeader.scss';

const ProjectHeader = () => {

    return (
        <div className='project-header'>
            {/* <Container> */}
                <div className='d-flex ml-3'>
                    <Col lg={4}>
                        <div className='d-flex'>
                            <Col>   
                                <div className='project-image'>
                                    <img alt='project' height='119' width='167' />
                                </div>
                            </Col>
                            <Col>
                                <div className='text'>Project #</div>
                                <div className='pt-3 project-name'>Project Name</div>
                                <div>Address</div>

                                <div className='pt-2'>
                                    <a href='/' className='text'>Save as New Project</a>
                                </div>
                            </Col>
                        </div>
                    </Col>
                    <Col lg={{ offset: 1, span: 3 }}>
                        <div className='bold-text pt-5'>Customer Name</div>
                        <div className='d-flex'>
                            <div className='pr-2 text'>Phone</div>
                            <div className='text'>Email Address</div>
                        </div>
                        <div className='d-flex pt-3'>
                            <div className='bold-text pr-5'>Closed On</div>
                            <div className='bold-text pl-5'>Build Time</div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className='d-flex pt-3 justify-content-end'>
                            <div className='pr-3 text'>Status: <span className='bold-text'>Open Project</span></div>
                            <button className='snapshot-btn'>Project Snapshot</button>
                        </div>

                        <div className='d-flex total justify-content-end text'>
                            Project Total: $0.00 Margin: $0.00
                        </div>
                    </Col>
                </div>
            {/* </Container> */}
        </div>
    )
}

export default ProjectHeader;
