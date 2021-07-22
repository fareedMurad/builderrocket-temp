import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getRoomTypes } from '../../actions/roomActions';
import { handleProductForProject } from '../../actions/projectActions';
import { isEmpty } from 'lodash';
import './ProductModal.scss';

const ProductModal = (props) => {
    const { show, handleClose, handleCloseModal } = props;

    const dispatch = useDispatch();

    const product = useSelector(state => state.product.product);
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
            let tempRoomList = roomList;

            const index = tempRoomList.indexOf(roomID);

            if (index > -1) 
                tempRoomList.splice(index, 1);

            setRoomList(tempRoomList);
        } else {
            setRoomList([ ...roomList, roomID ]);
        }
    }

    const addToRooms = () => {
        if (roomList.length === 0) return;

        let newProductObj = product;

        const newProducts = roomList.map((roomID) => {
            return {
                ...newProductObj,
                ProductID: productDetails?.ID,
                ProjectRoomID: roomID
            }
        });

        dispatch(handleProductForProject(newProducts))
            .then(
                handleClose()
            );
    }

    return (
        <Modal 
            size='lg'
            show={show}
            onHide={handleCloseModal}
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
                                        defaultChecked={roomList.includes(room?.ID)} 
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
                        onClick={handleCloseModal}
                    >
                            Cancel
                    </Button>
                    <Button 
                        className='primary-gray-btn next-btn ml-3'
                        onClick={addToRooms}
                    >
                        Add to Rooms
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ProductModal;