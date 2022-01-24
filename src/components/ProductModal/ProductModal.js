import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getRoomTypes } from '../../actions/roomActions';
import { handleProductForProject } from '../../actions/projectActions';
import { getProductDetails, replaceProductService } from '../../actions/productActions';
import { isEmpty } from 'lodash';
import './ProductModal.scss';

const ProductModal = (props) => {
    const { show, handleClose, handleCloseModal } = props;

    const dispatch = useDispatch();

    const product = useSelector(state => state.product.product);
    const project = useSelector(state => state.project.project);
    const replaceProduct = useSelector(state => state.product.replaceProduct);
    const roomTypes = useSelector(state => state.room.roomTypes);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const productDetails = useSelector(state => state.product.productDetail);

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
            setRoomList([...roomList, roomID]);
        }
    }

    const addToRooms = () => {
        console.log(roomList)
        if (roomList.length === 0) return;
        dispatch(replaceProductService(project?.ID, {
            OldProductID: product?.TemplateItemID,
            NewProductID: replaceProduct?.ID,
            ProjectRoomIDs: roomList
        }))
        .then(() => {
            handleCloseModal()
        })
    }

    const includedRooms = (ProductID) => {
        let roomIds = []
        project?.ProjectRooms?.map(room => {
            room?.Items?.map(item => {
                return item?.ProductID === ProductID ? !roomIds.includes(room?.ID) && roomIds.push(room?.ID) : item
            })
        })

        return roomIds;
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
                        Are you sure you want to replace:
                    </div>

                    <div className='d-flex'>
                        <img
                            alt='product'
                            width='50'
                            height='50'
                            src={productDetails?.ThumbnailURL}
                        />

                        <div className='product-details-text'>
                            <div  className="mb-2">{productDetails?.ShortDescription}</div>
                            Model: {productDetails?.ModelNumber}
                            <span className="ml-md-5">
                                Part: {productDetails?.ProductNumber}
                                </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='product-modal-body'>

                <div className='replce-product-header-container'>
                    <div className='product-details'>
                        <div className='product-details-header'>
                            With this:
                        </div>

                        <div className='d-flex'>
                            <img
                                alt='product'
                                width='50'
                                height='50'
                                src={replaceProduct?.ThumbnailURL}
                            />

                            <div className='product-details-text'>
                                <div className="mb-2">{replaceProduct?.ShortDescription}</div>
                                Model: {replaceProduct?.ModelNumber}
                                <span className="ml-md-5">
                                Part: {replaceProduct?.ProductNumber}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='body-header'>This item is currently assigned to the following rooms. Would you like to add to these rooms as well?</div>

                <div className='rooms d-flex flex-wrap justify-content-around'>
                    {roomTypes?.map((roomType, index) => (
                        <div key={index} className='room-type-container'>
                            <div className='room-type'>{roomType?.Name}</div>

                            {roomType?.Rooms?.map((room, index) => (
                                <div key={index} className='room-name'>
                                    <Form.Check
                                        type='checkbox'
                                        // checked={room?.ProductID === replaceProduct?.ID ? true : false}
                                        defaultChecked={includedRooms(replaceProduct?.ProductID)?.includes(room.ID)}
                                        onChange={() =>  handleCheckBox(room?.ID)}
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