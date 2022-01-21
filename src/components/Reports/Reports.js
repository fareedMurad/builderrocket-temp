import React, { useCallback, useEffect, useState } from 'react';
import { getReportByProjectID, getCategorizedReportByProjectID, getRoomReportByProjectID, getVendorReportByProjectID } from '../../actions/projectActions';
import { Button, Form, Spinner } from 'react-bootstrap';
import { setSelectedRoom } from '../../actions/roomActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import ReportsHeader from './ReportHeader';
import Select from 'react-select';
import ReportsTable from './ReportsTable'
import {CustomPrinter} from '../../components/PDF'

import './Reports.scss';

const LayoutOptions = [
    { value: "list", label: "List" },
    { value: "category", label: "Category" },
    { value: "room", label: "Room" },
    { value: "vendor", label: "Vendor" },
]

const Reports = (props) => {
    const dispatch = useDispatch();
    const componentRef = React.useRef(null);

    const report = useSelector(state => state.project.report);
    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);

    const [isLoading, setIsLoading] = useState(false);
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
                        <Select
                            options={LayoutOptions}
                            value={layout}
                            onChange={setLayout}
                        />
                    </div>
                    <div>
                        <CustomPrinter 
                            ref={componentRef} 
                            icon="fas fa-download" 
                            title="Download Report" 
                        />
                        <CustomPrinter 
                            ref={componentRef} 
                            icon="fas fa-share-alt" 
                            title="Share to Distributor" 
                        />
                        <CustomPrinter 
                            ref={componentRef} 
                            icon="fa-share-square" 
                            title="Share to Customer"
                        />
                        <Button variant='link' className='link-btn'>
                            <i className='fas fa-th'></i>
                            Category Layout
                        </Button>
                    </div>
                </div>

                <ReportsTable layout={layout} hideTotals={hideTotals} ref={componentRef} />
                <div className='d-flex justify-content-center pt-5'>
                    {isLoading ? (
                        <Spinner
                            animation='border'
                            variant='primary'
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Reports;