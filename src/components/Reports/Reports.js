import React, { useCallback, useEffect, useState } from 'react';
import { setProduct, getCategories, setSelectedProductTab } from '../../actions/productActions';
import { getReportByProjectID, getCategorizedReportByProjectID, getRoomReportByProjectID, editProduct, handleProductForProject, getVendorReportByProjectID } from '../../actions/projectActions';
import { Button, Form, Table, Modal, Spinner } from 'react-bootstrap';
import { setSelectedRoom } from '../../actions/roomActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isUndefined } from 'lodash';
import ReportsHeader from './ReportHeader';
import Select from 'react-select';
import ReportsTable from './ReportsTable'
import Pdf from "react-to-pdf";

import './Reports.scss';

const LayoutOptions = [
    { value: "list", label: "List" },
    { value: "category", label: "Category" },
    { value: "room", label: "Room" },
    { value: "vendor", label: "Vendor" },
]

const Reports = (props) => {
    const dispatch = useDispatch();
    const ref = React.createRef();

    const report = useSelector(state => state.project.report);
    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tempReport, setTempReport] = useState({});
    const [reportItems, setReportItems] = useState({});
    const [layout, setLayout] = useState(LayoutOptions[0]);

    const [hideTotals, setHideTotals] = useState(false)
    useEffect(() => {
        if (isEmpty(selectedRoom))
            dispatch(setSelectedRoom(report?.ProjectRooms?.[0]));
    }, [dispatch, report, selectedRoom]);

    useEffect(() => {
        setIsLoading(true);
        if (layout?.value === "list") {
            dispatch(getReportByProjectID(project?.ID))
                .then(() => {
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
        }
        else if (layout?.value === "category") {
            dispatch(getCategorizedReportByProjectID(project?.ID))
                .then(() => {
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
        }
        else if (layout?.value === "room") {
            dispatch(getRoomReportByProjectID(project?.ID))
                .then(() => {
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
        }
        else if (layout?.value === "vendor") {
            dispatch(getVendorReportByProjectID(project?.ID))
                .then(() => {
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
        }
    }, [dispatch, layout]);

    const handleSelectedRoom = useCallback((roomID) => {
        const selectedRoomObj = report?.ProjectRooms?.find((room) => room.ID === parseInt(roomID));

        dispatch(setSelectedRoom(selectedRoomObj));
    }, [dispatch, report]);

    useEffect(() => {
        if (!isEmpty(selectedRoom))
            handleSelectedRoom(selectedRoom?.ID);
    }, [report, selectedRoom, handleSelectedRoom]);

    // const handleSelectedCategoryID = (templateItem) => {
    //     if (!templateItem) return;

    //     if (templateItem) {
    //         const product = {
    //             Quantity: 1,
    //             TemplateItemID: templateItem.ID,
    //             CategoryID: templateItem.CategoryID,
    //             RoughInTrimOutEnum: 'RoughIn',
    //             IsApproved: false,
    //         }

    //         dispatch(setProduct(product))
    //             .then(dispatch(getCategories(product?.CategoryID)))
    //             .then(dispatch(setSelectedProductTab('addProduct')))
    //             .catch(() => { });
    //     }

    // }

    const handleDeleteProduct = (product) => {
        // if (!product || !selectedRoom?.ID) return;

        // const productDeleteObj = {
        //     ID: product.ID,
        //     Quantity: 0,
        //     ProductID: product.ProductID,
        //     ProjectRoomID: selectedRoom.ID,
        //     IsApproved: product.IsApproved,
        //     IsFavorite: product.IsFavorite,
        //     TemplateItemID: product.TemplateID,
        //     RequiredApproval: product.RequiredApproval,
        //     RoughInTrimOutEnum: product.RoughInTrimOutEnum
        // }

        // dispatch(handleProductForProject([productDeleteObj]))
        //     .then(setShowModal(false));
    }

    const handleOpenModal = (item) => {
        if (item.IsTemplate) return;

        setTempReport(item);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setTempReport({});
        setShowModal(false);
    }

    const handleItems = (incomingItem, key, value) => {
        // if (!incomingItem?.ID) return;

        // let newValue = value;

        // if (key === 'RequiresApproval')
        //     newValue = !value;

        // if (!reportItems?.[incomingItem?.ID]) {

        //     setReportItems({
        //         ...reportItems,
        //         [incomingItem?.ID]: {
        //             ...incomingItem,
        //             TemplateItemID: incomingItem?.ID,
        //             CategoryID: incomingItem?.CategoryID,
        //             requiresApproval: false,
        //             Quantity: 1,
        //             [key]: newValue
        //         }
        //     });

        // } else {
        //     setReportItems({
        //         ...reportItems,
        //         [incomingItem?.ID]: {
        //             ...reportItems?.[incomingItem?.ID],
        //             [key]: newValue
        //         }
        //     })
        // }

    }

    const saveProducts = () => {
        if (isEmpty(reportItems)) return;

        setIsLoading(true);

        // const updatedItems = Object.keys(reportItems)?.map((itemKey) => {
        //     return {
        //         ID: parseInt(itemKey),
        //         ProjectRoomID: selectedRoom.ID,
        //         ...reportItems[itemKey]
        //     };
        // });

        // dispatch(editProduct(updatedItems))
        //     .then(() => {
        //         setIsLoading(false);
        //     });
    }


    // const showProducts = () => {
    //     dispatch(getCategories(''))
    //         .then(dispatch(setProduct({})))
    //         .then(dispatch(setSelectedProductTab('addProduct')))
    //         .catch(() => { });
    // }

    const onChangeHideTotals = e => {
        if (hideTotals) {
            setHideTotals(false)
        } else {
            setHideTotals(true)
        }
    }

    return (
        <div className='d-flex products'>
            <div className='reports-container'>
                <ReportsHeader hideTotals={hideTotals} />
                <div className='d-flex justify-content-between flex-wrap'>
                    <div className="mx-5 my-3">
                        <Form>
                            <Form.Check
                                value={hideTotals}
                                onChange={onChangeHideTotals}
                                type="switch"
                                id="custom-switch"
                                label="Builder/Customer"
                            />
                        </Form>
                    </div>
                    <div className="layout-select">
                        {/* <div className='page-title'>Reports - {selectedRoom?.RoomName ? selectedRoom?.RoomName : ''}</div> */}
                        <Select
                            options={LayoutOptions}
                            value={layout}
                            onChange={setLayout}
                        />
                    </div>
                    <div>
                        <Pdf targetRef={ref} scale={0.635} filename="code-example.pdf">
                            {({ toPdf }) =>
                                <Button variant='link' className='link-btn' onClick={toPdf}>
                                    <i className='fas fa-download'></i>
                                    Download Report
                                </Button>}
                        </Pdf>
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

                {/* <div className='middle-section'>
                    <div className='d-flex'>
                        <div>
                            <Form.Control
                                as='select'
                                value={selectedRoom?.ID}
                                onChange={(e) => handleSelectedRoom(e.target.value)}
                            >
                                {report?.ProjectRooms?.map((projectRoom, index) => (
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
                                + Add Reports
                            </Button>
                        </div>
                    </div>
                    <div className='total'>
                        Total: $0.00
                    </div>
                </div> */}

                <ReportsTable layout={layout} hideTotals={hideTotals} ref={ref} />

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

export default Reports;