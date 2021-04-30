import React from 'react';
import { Nav, Container } from 'react-bootstrap';
import './ProjectSubheader.scss';


const ProjectSubheader = () => {

    return (
        <Container className='project-subheader'>
            <Nav
                activeKey="/home"
                onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
            >
                <Nav.Item>
                    <Nav.Link className='active' eventKey="link-0">Project Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Documents</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Utilities</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Contractors</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Drawings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Room/Area Layout</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Products</Nav.Link>
                </Nav.Item>
            </Nav>
        </Container>
    )
}

export default ProjectSubheader;