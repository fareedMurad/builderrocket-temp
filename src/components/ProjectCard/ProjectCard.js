import React from 'react';
import { Container } from 'react-bootstrap';
import './ProjectCard.scss';

const ProjectCard = (props) => {
    const { project } = props;

    return (
        <div className='project-card'>
            <Container>
                <div>
                    <p className='lot-number'>{project?.lotNumber}</p>
                </div>
                <div>
                    <p>{project?.projectName}</p>
                </div>
                <div>
                    <p className='address'>{project?.address}</p>
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
            </Container>
        </div>
    )

}

export default ProjectCard;