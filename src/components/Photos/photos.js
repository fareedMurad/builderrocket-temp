import React from 'react'
import './Photo.scss'
import { Button, Form, Modal } from 'react-bootstrap';
import HousePhotos from '../../assets/images/img-placeholder.png';
const Photos = () => {
  const componentRef = React.useRef(null);
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className='d-flex products'>
      <div className='reports-container' ref={componentRef}>
        <div className='d-flex justify-content-between flex-wrap'>
          <div>
            <div className='page-title'>
              Photos
            </div>
          </div>
          <div>
            <Button
              variant='link'
              className='link-btn'
              onClick={handleShow}
            >
              + Add Photos
            </Button>
          </div>
        </div>
        <div className='photos-grid'>
          <div className='item'>
            <Button className='btn' variant=''>
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </Button>
            <img src={HousePhotos} alt='he' />
          </div>
          <div className='item'>
            <Button className='btn' variant=''>
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </Button>
            <img src={HousePhotos} alt='he' />
          </div>
          <div className='item'>
            <Button className='btn' variant=''>
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </Button>
            <img src={HousePhotos} alt='he' />
          </div>
          <div className='item'>
            <Button className='btn' variant=''>
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </Button>
            <img src={HousePhotos} alt='he' />
          </div>
          <div className='item'>
            <Button className='btn' variant=''>
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </Button>
            <img src={HousePhotos} alt='he' />
          </div>
          <div className='item'>
            <Button className='btn' variant=''>
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </Button>
            <img src={HousePhotos} alt='he' />
          </div>
          <div className='item'>
            <Button className='btn' variant=''>
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </Button>
            <img src={HousePhotos} alt='he' />
          </div>
          <div className='item'>
            <Button className='btn' variant=''>
              <i class="far fa-trash-alt" aria-hidden="true"></i>
            </Button>
            <img src={HousePhotos} alt='he' />
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select Photo</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
          <div className='d-flex justify-content-center align-items-center gap-2'>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Photos