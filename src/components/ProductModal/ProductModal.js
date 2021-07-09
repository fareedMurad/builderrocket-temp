import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './ProductModal.scss';

const ProductModal = (props) => {
    const { show, handleClose } = props;

    const selectedRoom = useSelector(state => state.room.selectedRoom);
    console.log('SELECTED ROOM', selectedRoom);
    return (
        <Modal 
            show={show}
            onHide={() => handleClose(false)}
            className='product-modal'
        >
            <div className='header-container'>
                <div className='product-modal-header'>
                    You are currently in the {selectedRoom?.RoomName}
                </div>
            </div>

            <div className='product-modal-body'>
                <div className='body-header'>Would you like to add to these rooms as well?</div>

                <div className='d-flex justify-content-center pt-5'>
                    <Button 
                            variant='link' 
                            className='cancel'
                            onClick={() => handleClose(false)}
                        >
                            Cancel
                    </Button>
                    <Button className='primary-gray-btn next-btn ml-3'>Add to Rooms</Button>
                </div>
            </div>
        </Modal>
    )
}

export default ProductModal;