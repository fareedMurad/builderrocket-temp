import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getRoomTypes } from '../../actions/roomActions';
import { isEmpty } from 'lodash';
import './ProductModal.scss';

const ProductModal = (props) => {
    const { show, handleClose } = props;

    const dispatch = useDispatch();

    const roomTypes = useSelector(state => state.room.roomTypes);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const productDetails = useSelector(state => state.product.productDetails);

    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        if (isEmpty(roomTypes))
            dispatch(getRoomTypes());
    }, [dispatch, roomTypes]);

    const handleCheckBox = (roomID) => {
        if (!roomID) return;

        if (roomList?.includes(roomID)) {
            
        }
    }

    console.log('product details', productDetails);
    return (
        <Modal 
            show={show}
            onHide={() => handleClose(false)}
            size='lg'
            className='product-modal'
        >
            <div className='header-container'>
                <div className='product-modal-header'>
                    You are currently in the {selectedRoom?.RoomName}
                </div>

                <div className='product-details'>
                    <div className='product-details-header'>
                        Add this product
                    </div>

                    <div className='d-flex'>
                        <img
                            alt='product' 
                            width='50'
                            height='50'
                            src={productDetails?.ThumbnailURL}
                        />

                        <div className='product-details-text'>
                            <div>{productDetails?.ShortDescription}</div>
                            Model: {productDetails?.ModelNumber}
                            {' '}
                            Part: {productDetails?.ProductNumber}
                        </div>

                        <div>

                        </div>
                    </div>
                </div>
            </div>

            <div className='product-modal-body'>
                <div className='body-header'>Would you like to add to these rooms as well?</div>

                <div className='rooms d-flex flex-wrap justify-content-around'>
                    {roomTypes?.map((roomType, index) => (
                        <div key={index} className='room-type-container'>
                            <div className='room-type'>{roomType?.Name}</div>

                            {roomType?.Rooms?.map((room, index) => (
                                <div key={index} className='room-name'>
                                    <Form.Check 
                                        type='checkbox'
                                        // defaultChecked={isRoomInProject(room?.ID)} 
                                        onChange={() => handleCheckBox(room?.ID)}
                                        label={`${room?.Name}`} 
                                    />
                                </div>
                            ))}
                        </div>

                    ))}
                </div>

                <div className='d-flex justify-content-center'>
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