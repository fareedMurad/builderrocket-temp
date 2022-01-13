import React, { useCallback, useEffect, useState } from 'react';
import { getReportByProjectID, handleProductForProject } from '../../actions/projectActions';
import { Button, Form, Table, Modal, Spinner, Select } from 'react-bootstrap';
import { setSelectedRoom } from '../../actions/roomActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import ProjectPlaceholder from '../../assets/images/project_placeholder-image.png';
import Utils from '../../utils'

import './Reports.scss';


const ReportsTable = React.forwardRef(({ layout, hideTotals}, ref) => {
    const dispatch = useDispatch();

    const report = useSelector(state => state.project.report);
    const reportByRoom = useSelector(state => state.project.reportByRoom);
    const reportByCategory = useSelector(state => state.project.reportByCategory);
    const reportsByVendor = useSelector(state => state.project.reportsByVendor);
    const selectedRoom = useSelector(state => state.room.selectedRoom);

    const [showModal, setShowModal] = useState(false);
    const [tempReport, setTempReport] = useState({});

    useEffect(() => {
        if (isEmpty(selectedRoom))
            dispatch(setSelectedRoom(report?.ProjectRooms?.[0]));
    }, [dispatch, report, selectedRoom]);

    const handleDeleteProduct = (product) => {
        if (!product || !selectedRoom?.ID) return;

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

    const deleteModal = () => {
        return (
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
            >
                <div className='p-3'>
                    <b>Delete Report</b>
                </div>
                <Modal.Body>
                    Are you sure you want to delete this report?

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
                            onClick={() => handleDeleteProduct(tempReport)}>Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    const renderTableBody = (item, index) => {
        return (
            <tr key={index}>
                <td>
                    <img
                        width='50'
                        height='50'
                        alt='template item'
                        src={report?.ProductThumbnailURl || ProjectPlaceholder}
                    />
                </td>
                <td>{item?.BrandName}</td>
                <td>{item?.ModelNumber}</td>
                <td>{item?.ProductName}</td>
                <td>{Utils.textEllipsis(item?.ShortDescription, 150)}</td>
                <td>{item?.VendorName}</td>
                <td>{item?.UnitOfMeasure}</td>
                {!hideTotals &&<td>{item?.Quantity}</td>}
                {!hideTotals &&<td>{item?.Price}</td>}
                {!hideTotals && <td>{item?.LineTotal}</td>}
                <td>
                    <div className='d-flex justify-content-between'>
                        <i className='fas fa-retweet'></i>
                        <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                        <i
                            className='far fa-trash-alt'
                            onClick={() => handleOpenModal(item)}
                        ></i>
                    </div>
                </td>
            </tr>
        )
    }

    const renderHeader = () => {
        return (
            <thead>
                <tr>
                    <th>Image</th>
                    <th>
                        Brand
                    </th>
                    <th>Model</th>
                    <th>ProductName</th>
                    <th>Description</th>
                    <th>Vendor</th>
                    <th>UOM</th>
                    {!hideTotals &&<th>Total Qty </th>}
                    {!hideTotals &&<th>Price</th>}
                    {!hideTotals &&<th>LineTotal</th>}
                    <th></th>
                </tr>
            </thead>
        )
    }

    const renderGroup = (data, item) => {
        return (
            <>
                {renderHeader()}
                <tbody>
                    {data?.Groups?.map((item, index) => {
                        return (
                            <>
                                <tr>
                                    <td colSpan={11} className="contractor-type-name">{item.Name}</td>
                                </tr>
                                {item?.Items?.map((item, index) => renderTableBody(item, index))}
                            </>
                        )
                    })}
                </tbody>
            </>
        )
    }

    const renderTableByLayout = () => {
        let table = null
        switch (layout.value) {
            case 'list' || 'vendor': {
                table = (
                    <>
                        {renderHeader()}
                        <tbody>
                            {report?.Items?.map((item, index) => renderTableBody(item, index))}
                        </tbody>
                    </>
                )
            }
                break;
            case 'category': {
                table = renderGroup(reportByCategory)
            }
                break;
            case 'room': {
                table = renderGroup(reportByRoom)
            }
                break;

            default: {
                return (
                    <>
                        {renderHeader()}
                        <tbody>
                            {report?.Items?.map((item, index) => renderTableBody(item, index))}
                        </tbody>
                    </>
                )
            }
        }

        return (
            <Table responsive>
                {table}
            </Table>
        )
    }

    return (

        <div className='reports-table' ref={ref}>
            {deleteModal()}
            {/* <div className='table-title'>Title</div> */}
            {renderTableByLayout()}
        </div>
    );
})

export default ReportsTable;