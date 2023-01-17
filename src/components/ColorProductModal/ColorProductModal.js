import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getRoomTypes } from '../../actions/roomActions';
import { handleProductForProject } from '../../actions/projectActions';
import {getBrands, getProductDetails, replaceProductService} from '../../actions/productActions';
import { isEmpty } from 'lodash';
import './ColorProductModal.scss';
import {PaintSheens, PaintTypes, ProjectStatus} from "../../utils/contants";

const ColorProductModal = (props) => {
    const { show, handleClose, handleCloseModal } = props;

    const dispatch = useDispatch();

    const product = useSelector(state => state.product.product);
    const brands = useSelector(state => state.product.brands);
    const project = useSelector(state => state.project.project);
    const replaceProduct = useSelector(state => state.product.replaceProduct);
    const roomTypes = useSelector(state => state.room.roomTypes);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const productDetails = useSelector(state => state.product.productDetail);
    const [roomList, setRoomList] = useState([selectedRoom.RoomID]);
    const [selectedPaint, setSelectedPaint] = useState(1);
    const [paintInfo, setPaintInfo] = useState({
        PaintCode: '',
        Type: null,
        Brand: null,
        Sheen: null,
        Location: {
            Wall: false,
            Ceiling: false,
            Trim: false
        }
    });

    useEffect(() => {
        if (isEmpty(roomTypes))
            dispatch(getRoomTypes());
    }, [dispatch, roomTypes]);

    useEffect(() => {
        dispatch(getBrands());
    }, [dispatch]);

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

    const handleFindProduct = () => {
        setSelectedPaint(null);
    }

    const handleUpdateType = (type) => {
        setPaintInfo({...paintInfo, Type: type})
    }
    const handleUpdateBrand = (brand) => {
        setPaintInfo({...paintInfo, Brand: brand})
    }
    const handleUpdateSheen = (sheen) => {
        setPaintInfo({...paintInfo, Sheen: sheen})
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

    function includedRooms(roomId){
        console.log(roomId, roomList?.includes(roomId));
        return roomList?.includes(roomId);
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

                <div className='product-details inverse-form'>
                    <div className='product-details-header'>
                        Select Paint:
                    </div>
                    <div className='row'>
                        <div className='col-6'>

                            <div className="form-group row">
                                <Form.Label className="col-sm-3 col-form-label"></Form.Label>
                                <div className='col-sm-8'>
                                    <Form.Control
                                        placeholder='Paint Code'
                                        className="input-gray"
                                        value={paintInfo?.PaintCode}
                                        onChange={(event) =>
                                            setPaintInfo({
                                                ...paintInfo,
                                                PaintCode: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <Form.Label className="col-sm-3 col-form-label"></Form.Label>
                                <div className='col-sm-8'>
                                    <Form.Control
                                        placeholder='Type'
                                        as="select"
                                        value={paintInfo?.Type}
                                        onChange={(event) =>
                                            handleUpdateType(parseInt(event.target.value))
                                        }
                                    >
                                        <option value=''>
                                            Select Type
                                        </option>
                                        {PaintTypes.map((type, index) => (
                                            <option key={index} value={type.id}>
                                                {type.text}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </div>
                            </div>
                            <div className="form-group row">
                                <Form.Label className="col-sm-3 col-form-label"></Form.Label>
                                <div className='col-sm-8'>
                                    <Form.Control
                                        placeholder='Type'
                                        as="select"
                                        value={paintInfo?.Brand}
                                        onChange={(event) =>
                                            handleUpdateBrand(parseInt(event.target.value))
                                        }
                                    >
                                        <option value=''>
                                            Select Brand
                                        </option>
                                        {brands?.map((brand, index) => (
                                            <option key={index} value={brand.ID}>
                                                {brand.Name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </div>
                            </div>
                            <div className="form-group row">
                                <Form.Label className="col-sm-3 col-form-label"></Form.Label>
                                <div className='col-sm-8'>
                                    <Form.Control
                                        placeholder='Type'
                                        as="select"
                                        value={paintInfo?.Sheen}
                                        onChange={(event) =>
                                            handleUpdateSheen(parseInt(event.target.value))
                                        }
                                    >
                                        <option value=''>
                                            Select Sheen
                                        </option>
                                        {PaintSheens?.map((sheen, index) => (
                                            <option key={index} value={sheen.id}>
                                                {sheen.text}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </div>
                            </div>
                            <div className='form-group row justify-content-end'>
                                <a className='btn primary-gray-btn mr-5' onClick={handleFindProduct}>Find Paint</a>
                            </div>
                        </div>
                        <div className={'col-6' + (selectedPaint ? '' : ' d-flex justify-content-center align-items-center')}>
                            {selectedPaint ?
                                <div className='row'>
                                <div className='col-sm-3 pt-1'>
                                    <span className='color' style={{'backgroundColor': '#444'}}></span>
                                </div>
                                <div className='col-sm-9'>
                                    <span>{brands?.find(b => b.ID === paintInfo?.Brand)?.Name}</span>
                                    <div  className="mb-2">{productDetails?.ShortDescription}</div>
                                    Model: {productDetails?.ModelNumber}
                                    <span className="ml-md-5">
                                        Paint #: {productDetails?.ProductNumber}
                                    </span>
                                    <div className='row mt-3'>
                                        <div className='col-12'>
                                            <div className='product-details-header'>
                                                Select Location:
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-sm-8'>
                                            <Form.Check
                                                type='checkbox'
                                                className='mt-2'
                                                label='Wall Paint'
                                                id='wall-paint'
                                                defaultChecked={paintInfo?.Location.Wall}
                                                onChange={() => setPaintInfo({...paintInfo, Location: {...paintInfo.Location, Wall: !paintInfo?.Location.Wall}})}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-sm-8'>
                                            <Form.Check
                                                type='checkbox'
                                                className='mt-2'
                                                label='Ceiling Paint'
                                                id='ceiling-paint'
                                                defaultChecked={paintInfo?.Location.Ceiling}
                                                onChange={() => setPaintInfo({...paintInfo, Location: {...paintInfo.Location, Ceiling: !paintInfo?.Location.Ceiling}})}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-sm-8'>
                                            <Form.Check
                                                type='checkbox'
                                                className='mt-2'
                                                label='Trim Paint'
                                                id='trim-paint'
                                                defaultChecked={paintInfo?.Location.Trim}
                                                onChange={() => setPaintInfo({...paintInfo, Location: {...paintInfo.Location, Trim: !paintInfo?.Location.Trim}})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div> :
                                <div>No Paint found</div>}
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

                                        // checked={room?.ProductID === replaceProduct?.ID ? true : false}
                                        defaultChecked={includedRooms(room?.ID)}
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
                        disabled={(roomList.length < 1 || !selectedPaint) || true}
                    >
                        Add to Rooms
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ColorProductModal;
