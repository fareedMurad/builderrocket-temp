import React, { useCallback, useEffect, useState } from 'react';
import { setProduct, getCategories, setSelectedProductTab } from '../../actions/productActions';
import { editProduct, handleProductForProject } from '../../actions/projectActions';
import { Button, Form, Table, Modal, Spinner } from 'react-bootstrap';
import { setSelectedRoom } from '../../actions/roomActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isUndefined } from 'lodash';
import './Products.scss';


const Products = (props) => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tempProduct, setTempProduct] = useState({});
    const [templateItems, setTemplateItems] = useState({});
    
    useEffect(() => {
        if (isEmpty(selectedRoom))
            dispatch(setSelectedRoom(project?.ProjectRooms?.[0]));
    }, [dispatch, project, selectedRoom]);
 
    const handleSelectedRoom = useCallback((roomID) => {
        const selectedRoomObj = project?.ProjectRooms?.find((room) => room.ID === parseInt(roomID));
        
        dispatch(setSelectedRoom(selectedRoomObj));
    }, [dispatch, project]);

    useEffect(() => {
        if (!isEmpty(selectedRoom))
            handleSelectedRoom(selectedRoom?.ID);
    }, [project, selectedRoom, handleSelectedRoom]);
    
    const handleSelectedCategoryID = (templateItem) => {
        if (!templateItem) return;

        if (templateItem) {
            const product = {
                Quantity: 1, 
                TemplateItemID: templateItem.ID,
                CategoryID: templateItem.CategoryID,
                RoughInTrimOutEnum: 'RoughIn',
                IsApproved: false,
            }

            dispatch(setProduct(product))
                .then(dispatch(getCategories(product?.CategoryID)))
                .then(dispatch(setSelectedProductTab('addProduct')))
                .catch(() => {});
        }

    }

    const handleDeleteProduct = (product) => {
        if (!product || !selectedRoom?.ID) return;
 
        const productDeleteObj = {
            ID: product.ID,
            Quantity: 0,
            ProductID: product.ProductID,
            ProjectRoomID: selectedRoom.ID,
            IsApproved: product.IsApproved,
            IsFavorite: product.IsFavorite,
            TemplateItemID: product.TemplateID,
            RequiredApproval: product.RequiredApproval,
            RoughInTrimOutEnum: product.RoughInTrimOutEnum
        } 

        dispatch(handleProductForProject([productDeleteObj]))
            .then(setShowModal(false));
    }

    const handleOpenModal = (item) => {
        if (item.IsTemplate) return;

        setTempProduct(item);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setTempProduct({});
        setShowModal(false);
    }

    const handleQuantity = (incomingItem, value) => {
        const itemQuantity = parseInt(value);   
        
        if (!incomingItem?.ID || !itemQuantity || itemQuantity < 0) {
            document.getElementById(`quantity-${incomingItem?.ID}`).value = '';

            return;
        }

        handleItems(incomingItem, 'Quantity', itemQuantity);
    }

    const handleItems = (incomingItem, key, value) => {
        if (!incomingItem?.ID) return;

        let newValue = value;

        if (key === 'IsApproved')
            newValue = !value;

        if (!templateItems?.[incomingItem?.ID]) {

            setTemplateItems({ 
                ...templateItems, 
                [incomingItem?.ID]: {
                    ...incomingItem,
                    TemplateItemID: incomingItem?.ID,
                    CategoryID: incomingItem?.CategoryID,
                    IsApproved: false,
                    Quantity: 1,
                    [key]: newValue
                }
            });

        } else {
            setTemplateItems({
                ...templateItems, 
                [incomingItem?.ID]: {
                    ...templateItems?.[incomingItem?.ID],
                    [key]: newValue
                }
            })
        }
        
    }

    const saveProducts = () => {
        if (isEmpty(templateItems)) return;

        setIsLoading(true);

        const updatedItems = Object.keys(templateItems)?.map((itemKey) => {
            return {
                ID: parseInt(itemKey),
                ProjectRoomID: selectedRoom.ID,
                ...templateItems[itemKey]
            };
        });

        dispatch(editProduct(updatedItems))
            .then(() => {
                setIsLoading(false);
            });
    }

    const deleteModal = () => {
        return (
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
            >
                <div className='p-3'>
                    <b>Delete Product</b>
                </div>
                <Modal.Body>
                    Are you sure you want to delete this product? 

                    <div className='d-flex justify-content-center pt-5'>
                        <Button 
                            variant='link' 
                            className='cancel'
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className='primary-gray-btn next-btn ml-3'
                            onClick={() => handleDeleteProduct(tempProduct)}>Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    const showProducts = () => {
        dispatch(getCategories(''))
            .then(dispatch(setProduct({})))
            .then(dispatch(setSelectedProductTab('addProduct')))
            .catch(() => {});
    }

    console.log('selected room', selectedRoom);
    return (
        <div className='d-flex products'>
            <div className='products-container'>
                <div className='d-flex justify-content-between'>
                    <div>
                        <div className='page-title'>Products - {selectedRoom?.RoomName ? selectedRoom?.RoomName : ''}</div>
                        <div className='subtext'>The products assinged to each room are displayed below.</div>
                    </div>
                    <div>
                        <Button variant='link' className='link-btn'>
                            <i className='fas fa-download'></i>
                            Download Report
                        </Button>
                        <Button variant='link' className='link-btn'>
                            <i className='fas fa-share-alt'></i>
                            Share to Distributor
                        </Button>
                        <Button variant='link' className='link-btn'>
                            <i className='fas fa-share-square'></i>
                            Share to Customer
                        </Button>
                        <Button variant='link' className='link-btn'>
                            <i className='fas fa-th'></i>
                            Category Layout
                        </Button>
                    </div>
                </div>

                <div className='middle-section'>
                    <div className='d-flex'>
                        <div>
                            <Form.Control 
                                as='select'
                                value={selectedRoom?.ID}
                                onChange={(e) => handleSelectedRoom(e.target.value)}
                            >
                                {project?.ProjectRooms?.map((projectRoom, index) => (
                                    <option 
                                        key={index} 
                                        value={projectRoom?.ID}
                                    >
                                        {projectRoom.RoomName}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>

                        <div className='ml-1'>
                            <Button 
                                variant='link' 
                                className='link-btn'
                                onClick={showProducts}
                            >
                                + Add Products
                            </Button>
                        </div>  
                    </div>
                    <div className='total'>
                        Total: $0.00
                    </div>
                </div>

                {deleteModal()}

                <div className='products-table'>
                    <div className='table-title'>Title</div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Needs Approval</th>
                                <th>
                                    <div className='d-flex justify-content-center'>
                                        Product Name
                                    </div>
                                </th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>UOM</th>
                                <th className='radios'>Rough In / Trim Out</th>
                                <th>Distributor</th>
                                <th>QTY</th>
                                <th>Price</th>
                                <th>Customer Approval</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedRoom?.Items?.map((templateItem, index) => {
                                const tempTemplateItem = templateItems?.[templateItem?.ID];

                                let isApproved = !!(templateItem?.IsApproved);
                                let isRoughIn = templateItem?.RoughInTrimOutEnum === 'RoughIn';
                                let isTrimOut = templateItem?.RoughInTrimOutEnum === 'TrimOut';
                                let quantity = templateItem?.Quantity ? templateItem?.Quantity : 1;

                                if (!isEmpty(tempTemplateItem)) {
                                    quantity = tempTemplateItem.Quantity;
                                    isApproved = tempTemplateItem.IsApproved;
                                    isRoughIn = tempTemplateItem.RoughInTrimOutEnum === 'RoughIn';
                                    isTrimOut = tempTemplateItem.RoughInTrimOutEnum === 'TrimOut';
                                }

                                return (
                                    <tr key={index}>
                                        <td className='approval-checkbox'>
                                            <div className='d-flex justify-content-center'>
                                                <Form>
                                                    <Form.Check 
                                                        type='checkbox'
                                                        checked={!(isApproved) ? false : isApproved}
                                                        disabled={isUndefined(templateItem?.IsApproved) ? true : false}
                                                        onChange={
                                                            () => handleItems(templateItem, 'IsApproved', isApproved)
                                                        }
                                                    />
                                                </Form>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='d-flex add-btn-templateItem'>
                                                {templateItem?.ProductThumbnailURl && (
                                                    <img 
                                                        width='50' 
                                                        height='50' 
                                                        alt='template item' 
                                                        src={templateItem?.ProductThumbnailURl} 
                                                    />
                                                )}
                                                <div>
                                                    <Button 
                                                        variant='link' 
                                                        className='link-btn item-button'
                                                        onClick={() => handleSelectedCategoryID(templateItem)}
                                                    >
                                                        {templateItem?.IsTemplate ? 
                                                            <>
                                                                <i className='fas fa-plus-circle plus-circle'></i>
                                                                {templateItem?.AddLabel} 
                                                            </>
                                                        : 
                                                            <>
                                                                {templateItem?.ProductName}
                                                            </>
                                                        }
                                                    </Button>

                                                    {!templateItem?.IsTemplate && (
                                                        <div className='model-number'>
                                                            Model: {templateItem?.ModelNumber}
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>  
                                        </td>
                                        <td>{templateItem?.ShortDescription}</td>
                                        <td>{templateItem?.CategoryName}</td>
                                        <td>{templateItem?.UnitOfMeasure}</td>
                                        <td>
                                            <Form className='d-flex justify-content-center'>
                                                <Form.Check 
                                                    type='radio'
                                                    checked={isRoughIn}
                                                    disabled={isUndefined(templateItem?.RoughInTrimOutEnum)}
                                                    onChange={
                                                        () => handleItems(templateItem, 'RoughInTrimOutEnum', 'RoughIn')
                                                    }
                                                />
                                                <Form.Check 
                                                    type='radio'
                                                    checked={isTrimOut}
                                                    disabled={isUndefined(templateItem?.RoughInTrimOutEnum)}
                                                    onChange={
                                                        () => handleItems(templateItem, 'RoughInTrimOutEnum', 'TrimOut')
                                                    }
                                                />
                                            </Form>
                                        </td>
                                        <td>
                                            <div className='distributor-select'>
                                                <Form.Control as='select'>
                                                </Form.Control>
                                            </div>
                                        </td>
                                        <td>  
                                            <div className='qty-input'>
                                                <Form.Control 
                                                    min='0'
                                                    type='number'
                                                    id={`quantity-${templateItem?.ID}`}
                                                    disabled={!templateItem?.Quantity}
                                                    defaultValue={quantity}
                                                    onChange={(e) => handleQuantity(templateItem, e.target.value)}
                                                >
                                                </Form.Control>
                                            </div>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className='d-flex justify-content-between'>
                                                <i className='fas fa-retweet'></i>
                                                <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                                <i 
                                                    className='far fa-trash-alt'
                                                    onClick={() => handleOpenModal(templateItem)}
                                                ></i>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            )}
                        </tbody>

                    </Table>
                </div>

                <div className='d-flex justify-content-center pt-5'>
                    {isLoading ? (
                        <Spinner 
                            animation='border'
                            variant='primary' 
                        />
                    ) : (
                        <>
                            {/* <Button 
                                variant='link' 
                                className='cancel'
                                // onClick={() => setShowModal(true)}
                            >
                                Cancel
                            </Button> */}
                            <Button 
                                onClick={saveProducts}
                                className='primary-gray-btn next-btn ml-3'
                            >
                                Save
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Products;