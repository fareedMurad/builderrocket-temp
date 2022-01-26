import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Table, Modal, Spinner, Tooltip, OverlayTrigger, } from 'react-bootstrap';

import { setProduct, getCategories, setSelectedProductTab, getProductDetails } from '../../actions/productActions';
import { editProduct, handleProductForProject, updateRequiresApproval, setSelectedProject, updateQuantity } from '../../actions/projectActions';
import { setSelectedRoom } from '../../actions/roomActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isUndefined } from 'lodash';
import './Products.scss';
import { useHistory } from 'react-router'


const Products = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tempProduct, setTempProduct] = useState({});
    const [templateItems, setTemplateItems] = useState({});
    const [isRequiresApprovalLoading, setIsRequiresApprovalLoading] = useState({ loading: false });
    const [isQuantityLoading, setIsQuantityLoading] = useState({ loading: false });

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
                ID: templateItem?.ID,
                Quantity: 1,
                TemplateItemID: templateItem.ID,
                CategoryID: templateItem.CategoryID,
                RoughInTrimOutEnum: 'RoughIn',
                IsApproved: false,
            }

            dispatch(setProduct(product))
                .then(dispatch(getCategories(product?.CategoryID)))
                .then(() => {
                    dispatch(getProductDetails(templateItem.ID))
                        .then(() => {
                            if (templateItem?.IsTemplate) {
                                history.push(`/project/${project.ProjectNumber}/product/addProduct`)
                            } else {
                                history.push(`/project/${project.ProjectNumber}/product/replaceProduct`)
                            }
                        })
                })
                .catch(() => { });
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

    const handleRequiresApproval = (templateItem, RequiresApproval) => {
        if (!isRequiresApprovalLoading?.loading) {
            setIsRequiresApprovalLoading({ loading: true, ID: templateItem?.ID })
            dispatch(updateRequiresApproval(project?.ID, templateItem?.ID, RequiresApproval))
                .then((project) => {
                    dispatch(setSelectedProject(project))
                    setIsRequiresApprovalLoading({ loading: false })
                });
        }
    }

    const handleQuantity = (templateItem, quantity) => {
        if (!isQuantityLoading?.loading) {
            setIsQuantityLoading({ loading: true, ID: templateItem?.ID })
            dispatch(updateQuantity(project?.ID, templateItem?.ID, quantity))
                .then((project) => {
                    dispatch(setSelectedProject(project))
                    setIsQuantityLoading({ loading: false })
                });
        }
    }

    const handleItems = (incomingItem, key, value) => {
        if (!incomingItem?.ID) return;

        let newValue = value;

        if (key === 'RequiresApproval')
            newValue = !value;

        if (!templateItems?.[incomingItem?.ID]) {

            setTemplateItems({
                ...templateItems,
                [incomingItem?.ID]: {
                    ...incomingItem,
                    TemplateItemID: incomingItem?.ID,
                    CategoryID: incomingItem?.CategoryID,
                    requiresApproval: false,
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
    const itemLoading = (templateItem, loadingObj) => {
        return loadingObj?.loading && loadingObj?.ID === templateItem?.ID
    }

    const renderApproval = (templateItem) => {
        let status = {}

        if (!templateItem?.RequiresApproval)
            return;

        switch (templateItem?.ApprovalStatusID) {
            case 0 | null: {
                status = {
                    label: "",
                    className: ""
                }
            }
                break;
            case -1: {
                status = {
                    label: "Rejected",
                    className: "bg-danger"
                }
            }
                break;

            case 0: {
                status = {
                    label: "Approved",
                    className: "bg-success"
                }
            }
                break;

            default: {
                status = {}
            }
        }

        return (
            templateItem?.DateApproved ? <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip id='button-tooltip'>
                        {templateItem?.DateApproved}
                    </Tooltip>
                }
                delay={{ show: 250, hide: 400 }}
            >
                <small className={`${status?.className} font-weight-bold rounded text-white p-1`}>{status?.label}</small>
            </OverlayTrigger> : <small className={`${status?.className} font-weight-bold rounded text-white p-1`}>{status?.label}</small>

        )
    }

    const showProducts = () => {
        dispatch(getCategories(''))
            .then(dispatch(setProduct({})))
            .then(() => {
                history.push(`/project/${project.ProjectNumber}/product/addProduct`)
            })
            .catch(() => { });
    }

    return (
        <div className='d-flex products'>
            <div className='products-container'>
                <div className='d-flex justify-content-between flex-wrap'>
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
                    <div className='d-flex flex-wrap'>
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
                    <Table responsive>
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

                                let requiresApproval = !!(templateItem?.RequiresApproval);
                                let isRoughIn = templateItem?.RoughInTrimOutEnum === 'RoughIn';
                                let isTrimOut = templateItem?.RoughInTrimOutEnum === 'TrimOut';
                                let quantity = templateItem?.Quantity ? templateItem?.Quantity : 1;

                                if (!isEmpty(tempTemplateItem)) {
                                    quantity = tempTemplateItem.Quantity;
                                    requiresApproval = tempTemplateItem.RequiresApproval;
                                    isRoughIn = tempTemplateItem.RoughInTrimOutEnum === 'RoughIn';
                                    isTrimOut = tempTemplateItem.RoughInTrimOutEnum === 'TrimOut';
                                }
                                return (
                                    <tr key={index}>
                                        <td className='approval-checkbox'>
                                            <div className='d-flex justify-content-center'>
                                                <Form>
                                                    {itemLoading(templateItem, isRequiresApprovalLoading) ? <Spinner
                                                        animation='border'
                                                        variant='primary'
                                                    /> : <Form.Check
                                                        type='checkbox'
                                                        checked={templateItem?.RequiresApproval}
                                                        disabled={isUndefined(templateItem?.RequiresApproval) ? true : false}
                                                        onChange={
                                                            () => handleRequiresApproval(templateItem, !templateItem?.RequiresApproval)
                                                        }
                                                    />}


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
                                                    disabled={isUndefined(templateItem?.IsTemplate)}
                                                    onChange={
                                                        () => handleItems(templateItem, 'RoughInTrimOutEnum', 'RoughIn')
                                                    }
                                                />
                                                <Form.Check
                                                    type='radio'
                                                    checked={isTrimOut}
                                                    disabled={isUndefined(templateItem?.IsTemplate)}
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
                                                {itemLoading(templateItem, isQuantityLoading) ? <Spinner
                                                    animation='border'
                                                    variant='primary'
                                                /> :
                                                    <Form.Control
                                                        min='0'
                                                        type='number'
                                                        id={`quantity-${templateItem?.ID}`}
                                                        disabled={!templateItem?.Quantity}
                                                        defaultValue={quantity}
                                                        onBlur={(e) => handleQuantity(templateItem, e.target.value)}
                                                    >
                                                    </Form.Control>
                                                }
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            {renderApproval(templateItem)}
                                        </td>
                                        <td>
                                            {!templateItem?.IsTemplate && <div className='d-flex justify-content-between'>
                                                <i className='fas fa-retweet'></i>
                                                <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                                <i
                                                    className='far fa-trash-alt'
                                                    onClick={() => handleOpenModal(templateItem)}
                                                ></i>
                                            </div>}
                                        </td>
                                    </tr>
                                )
                            }
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