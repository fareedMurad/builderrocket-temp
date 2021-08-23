import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRoom } from '../../actions/roomActions';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { setProduct, getCategories } from '../../actions/productActions';
import { handleProductForProject } from '../../actions/projectActions';
import { isEmpty, isUndefined } from 'lodash';
import './Products.scss';

// components 
import AddProduct from '../../components/AddProduct';

const Products = (props) => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);

    const [showModal, setShowModal] = useState(false);
    const [tempProduct, setTempProduct] = useState({});
    const [templateItems, setTemplateItems] = useState({});
    const [isAddProducts, setIsAddProducts] = useState(false);
    
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
                .then(setIsAddProducts(true));
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
        dispatch(setProduct({}))
            .then(dispatch(getCategories('')))
            .then(setIsAddProducts(true));
    }
    // console.log('Project', project, selectedRoom);       

    return (
        <div className='d-flex products'>
            {!isAddProducts ? (
                <div className='products-container'>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <div className='page-title'>Products</div>
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
                                    const isApproved = !!(templateItem?.IsApproved);
                                    const isRoughIn = templateItem?.RoughInTrimOutEnum === 'RoughIn';
                                    const isTrimOut = templateItem?.RoughInTrimOutEnum === 'TrimOut';

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
                                                            className='link-btn'
                                                            onClick={() => handleSelectedCategoryID(templateItem)}
                                                        >
                                                            {templateItem?.IsTemplate ? 
                                                                <>
                                                                    <i className='fas fa-plus-circle plus-circle'></i>
                                                                    {templateItem?.AddLabel} 
                                                                </>
                                                            : 
                                                                <>
                                                                    {templateItem?.ShortDescription}
                                                                </>
                                                            }
                                                        </Button>

                                                        {!templateItem?.IsTemplate && (
                                                            <div>
                                                                Model: {templateItem?.ModelNumber}
                                                            </div>
                                                        )} 
                                                    </div>
                                                </div>  
                                            </td>
                                            <td></td>
                                            <td>{templateItem?.CategoryName}</td>
                                            <td></td>
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
                                                        defaultValue={templateItem?.Quantity ? templateItem?.Quantity : 1}
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
                </div>
            ) : (
                <AddProduct handleShow={setIsAddProducts} />
            )}
        </div>
    );
}

export default Products;