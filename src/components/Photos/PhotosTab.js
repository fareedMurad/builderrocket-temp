import React from 'react'
import './Photo.scss'
import { Button, Card, Form, Modal, Overlay, Popover } from 'react-bootstrap';
import { deleteProjectPhotos, getProjectByProjectID, uploadProjectPhotos, uploadProjectThumbnail } from '../../actions/projectActions';
import { useDispatch, useSelector } from 'react-redux';

const PhotosTab = () => {

  const ref = React.useRef(null);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);

  const componentRef = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [uploadFiles, setUploadFiles] = React.useState([])
  const [Open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false)
  const [target, setTarget] = React.useState(null);
  const [id, setId] = React.useState('')

  const handleShow = () => setShow(true);


  React.useEffect(() => {
    const getData = async () => {
      setLoading(true)
      await dispatch(getProjectByProjectID(project.ID));
      setLoading(false)
    }
    getData();
  }, [project.ID])

  const handlerFile = async (e) => {
    if (e.target.files.length) {
      setUploadFiles(e.target.files)

    }
  }

  const handleClose = () => {
    setShow(false)
  };

  const handleSubmit = () => {
    const Files = uploadFiles
    const formData = new FormData();
    for (let i = 0; i < Files.length; i++) {
      formData.append("File", Files[i]);
    }
    // Save new thumbnail - update component state with updated data
    dispatch(uploadProjectPhotos(project?.ID, formData))
      .then(async (updatedProject) => {
        await dispatch(getProjectByProjectID(project.ID));
      })
      .catch(() => {
        alert("Something went wrong uploading Photo try again");
      });
    setShow(false)
  };
  const handlerDelete = (id, event) => {
    setTarget(event.target);
    setOpen(true)
    setId(id)

  }
  const handlerConfirmDelete = () => {
    setLoading(true)
    dispatch(deleteProjectPhotos(project?.ID, id))
      .then(async () => {
        setTarget(null);
        setOpen(false)
        setLoading(false)
      })
      .catch(() => {
        alert("Something went wrong uploading Photo try again");
      });
  }
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
          {

            project && project.Images.length ?
              project.Images.map(list => {
                return (
                  <div className='item' key={list.ID}>
                    <Button className='btn cut-btn' ref={ref} variant='' onClick={(e) => handlerDelete(list.ID, e)}>
                      <i className="far fa-trash-alt" aria-hidden="true"></i>
                    </Button>
                    <img src={list.URL} alt={list.FileName} />
                  </div>
                )
              })
              : false
          }
        </div>
      </div>
      <Overlay
        show={Open}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
        rootClose={true}
        onHide={() => setOpen(false)}
      >
        <Popover className='photos-popover' id="popover-contained">
          <div>
            <h5 className='text-center'>Are you sure you want Delete this image?</h5>
          </div>
          <div className='d-flex justify-content-center align-items-center gap-2'>
            <Button variant="primary" className='po-btn position-static' onClick={() => setOpen(false)}>
              No
            </Button>
            <Button variant="light" className='po-btn position-static' onClick={handlerConfirmDelete}>
              Yes
            </Button>
          </div>
        </Popover>
      </Overlay>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <Card>
          <Card.Body>
            <Form.Label>Select Photo</Form.Label>
            <Form.Control type="file" multiple className='form-input-file' s onChange={(e) => handlerFile(e)} />
          </Card.Body>
          </Card>
          <div className='d-flex justify-content-center align-items-center gap-2 p-3'>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PhotosTab