import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './ProjectHeader.scss';

const ProjectHeader = () => {

    return (
        <div className='project-header'>
            <Row>
                <Col lg={4}>Hello</Col>
                <Col lg={4}></Col>
                <Col lg={4}></Col>
            </Row>
        </div>
    )
}

export default ProjectHeader;
