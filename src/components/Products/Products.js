import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Table, Modal, Spinner, Tooltip, OverlayTrigger, } from 'react-bootstrap';

import { setProduct, getCategories, setSelectedProductTab, getProductDetails, RoughInTrimOutEnum, setIsFavorite } from '../../actions/productActions';
import { editProduct, handleProductForProject, updateRequiresApproval, setSelectedProject, updateQuantity, updateProjectProdcutNotes, saveProject } from '../../actions/projectActions';
import { setSelectedRoom } from '../../actions/roomActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isUndefined } from 'lodash';
import './Products.scss';
import { useHistory } from 'react-router'
import CustomLightbox from '../Lightbox';


const Products = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const isFavorite = useSelector(state => state.product.isFavorite)
    const roughtInTrimOut = useSelector(state => state.product.roughtInTrimOut)

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tempProduct, setTempProduct] = useState({});
    const [templateItems, setTemplateItems] = useState({});
    const [isRequiresApprovalLoading, setIsRequiresApprovalLoading] = useState({ loading: false });
    const [isQuantityLoading, setIsQuantityLoading] = useState({ loading: false });

    const [isNotesLoading, setIsNotesLoading] = useState(false);
    const [notes, setNotes] = useState(' ');
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [selectedProductItem, setSelectedProductItem] = useState({});

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

        dispatch(RoughInTrimOutEnum(project?.ID, incomingItem?.ID, value )).then(() => {
            dispatch(saveProject(roughtInTrimOut))
        })
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

    const handleIsFavorite = (item) => {
        dispatch(setIsFavorite(project?.ID, item?.ID, !item?.IsFavorite)).then(() => {
            dispatch(saveProject(isFavorite))
        })
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
                    className: "text-danger"
                }
            }
                break;

            case 1: {
                status = {
                    label: "Approved",
                    className: "text-success"
                }
            }
                break;

            default: {
                status = {}
            }
        }

        if(!status?.label){
            return null
        }

        return (
            templateItem?.DateApproved ?
                <div className="d-flex flex-column align-items-left">
                    <small className={`${status?.className} font-weight-bold`}>{status?.label}</small>
                    <small className={`${status?.className} font-weight-bold`}>
                        {
                            new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(templateItem?.DateApproved))
                        }
                    </small></div>
                :
                <small className={`${status?.className} font-weight-bold p-1`}>{status?.label}</small>

        )
    }



    const cancelNotesModal = () => {
        setShowNotesModal(false);
        setNotes(selectedProductItem?.Notes)
    }

    const handleOpenNotesModal = (item) => {
        setSelectedProductItem(item)
        setNotes(item?.Notes)
        setShowNotesModal(true);
    }

    const saveAsNewNotes = () => {
        if (!selectedProductItem?.ProductID)
            return;
        setIsNotesLoading(true)

        dispatch(updateProjectProdcutNotes(project?.ID, selectedProductItem?.ID, notes))
            .then((project) => {
                setIsNotesLoading(false)
                cancelNotesModal();
            })
            .catch(() => {
                alert('Something went wrong creating copy of project try again');
            })
    }



    const saveNotesModal = () => {
        return (
            <Modal
                size='md'
                centered
                show={showNotesModal}
                className='notes-modal'
                onHide={() => setShowNotesModal(false)}
            >
                <Modal.Body className='modal-container'>
                    <Form>
                        <Form.Label className='input-label'>
                            Product Notes
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            className='input-gray'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Form>
                    <div className='d-flex justify-content-center mt-3'>
                        {isNotesLoading ? (
                            <Spinner
                                animation='border'
                                variant='primary'
                            />
                        ) : (
                            <>
                                <Button
                                    variant='link'
                                    className='cancel'
                                    onClick={cancelNotesModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className='primary-gray-btn next-btn ml-3'
                                    onClick={saveAsNewNotes}
                                >
                                    Save
                                </Button>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
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

                {saveNotesModal()}

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
                                <th>Notes</th>
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
                                let isFav = templateItem?.IsFavorite

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
                                                    <CustomLightbox images={[templateItem?.ProductThumbnailURl]} />
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
                                            {!templateItem?.IsTemplate &&<Form className='d-flex justify-content-center'>
                                                <Form.Check
                                                    type='radio'
                                                    checked={isRoughIn}
                                                    disabled={templateItem?.IsTemplate}
                                                    onChange={
                                                        () => handleItems(templateItem, 'RoughInTrimOutEnum', 'RoughIn')
                                                    }
                                                />
                                                <Form.Check
                                                    type='radio'
                                                    checked={isTrimOut}
                                                    disabled={templateItem?.IsTemplate}
                                                    onChange={
                                                        () => handleItems(templateItem, 'RoughInTrimOutEnum', 'TrimOut')
                                                    }
                                                />
                                            </Form>}
                                        </td>
                                        <td>
                                            {!templateItem?.IsTemplate && <div className='distributor-select'>
                                                <Form.Control as='select'>
                                                </Form.Control>
                                            </div>}
                                        </td>
                                        <td>
                                            {!templateItem?.IsTemplate && <div className='qty-input'>
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
                                            </div>}
                                        </td>
                                        <td></td>
                                        <td>
                                            {renderApproval(templateItem)}
                                        </td>
                                        {!templateItem?.IsTemplate ? <td className={`${templateItem?.Notes && 'sticky-note-red'}`} onClick={() => handleOpenNotesModal(templateItem)}>
                                            {templateItem?.Notes ?
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id='button-tooltip'>
                                                            {templateItem?.Notes}
                                                        </Tooltip>

                                                    }
                                                    delay={{ show: 250, hide: 400 }}
                                                >
                                                    <i className='far fa-sticky-note d-flex justify-content-center'></i>
                                                </OverlayTrigger> : <i className='far fa-sticky-note d-flex justify-content-center'></i>}
                                        </td> : <td />}
                                        <td>
                                            {!templateItem?.IsTemplate && <div className='d-flex justify-content-between'>
                                                <i className='fas fa-retweet'></i>
                                                <i className={`far ${isFav ? 'text-danger fas fa-heart' : 'fa-heart'}`} onClick={() => handleIsFavorite(templateItem)}></i>
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