import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { getReportByProjectID, getCategorizedReportByProjectID, getRoomReportByProjectID, getVendorReportByProjectID } from '../../actions/projectActions';
import { Button, Form, Spinner } from 'react-bootstrap';
import { setSelectedRoom } from '../../actions/roomActions';
import { setReportFilter } from '../../actions/reportActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import ReportsHeader from './ReportHeader';
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import CheckedSelect from 'react-select-checked';
import ReportsTable from './ReportsTable'
import { CustomPrinter } from '../../components/PDF'

import './Reports.scss';

const LayoutOptions = [
    { value: "list", label: "List" },
    { value: "category", label: "Category" },
    { value: "room", label: "Room" },
    { value: "vendor", label: "Vendor" },
]

const options = [{ name: 'Option 1️⃣', id: 1 }, { name: 'Option 2️⃣', id: 2 }]


const Reports = (props) => {
    const dispatch = useDispatch();
    const componentRef = React.useRef(null);

    const report = useSelector(state => state.project.report);
    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const reportByCategory = useSelector(state => state.project.reportByCategory);

    const [isLoading, setIsLoading] = useState(false);
    const [layout, setLayout] = useState(LayoutOptions[0]);
    // const [groupLayout, setGroupLayout] = useState(null)
    const reportFilter = useSelector(state => state.reportFilter.reportFilters);

    const [hideTotals, setHideTotals] = useState(false)
    const [firstCategoryLoad, setFirstCategoryLoad] = useState(true);
    const [hideReportsHeader, setHideReportsHeader] = useState(true);
    useEffect(() => {
        if (isEmpty(selectedRoom))
            dispatch(setSelectedRoom(report?.ProjectRooms?.[0]));
        // if (groupLayout?.length > 0) {
        //     dispatch(setReportFilter(groupLayout))
        // } else if (layout) {
        //     dispatch(setReportFilter(layout))
        // }
    }, [dispatch, report, selectedRoom]);

    useEffect(() => {
        if (isEmpty(reportByCategory))
        {
            dispatch(getCategorizedReportByProjectID(project?.ID));
            console.log();
        }
    }, [dispatch, report, reportByCategory]);

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
            dispatch(setReportFilter(reportByCategory?.Groups?.map(a => {
                return {
                    ...a,
                    name: a.Name,
                    value: a.ID
                }
            })) || []);
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

    const downloadReportURL = btoa(JSON.stringify({
        projectID: project.ID,
        groupIDs: reportFilter?.map?.(r => r.ID),
        filter: layout.value
    }));

    console.log(downloadReportURL, atob(downloadReportURL))
    

    return (
        <div className='d-flex products'>
            <div className='reports-container' ref={componentRef}>
                {!hideReportsHeader && <ReportsHeader hideTotals={hideTotals} />}
                {hideReportsHeader && <div className='d-flex justify-content-between flex-wrap'>
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
                    <div className="d-flex align-items-center">
                        <span>Group By:</span>
                        <div className="layout-select">
                            <Select
                                options={LayoutOptions}
                                value={layout}
                                onChange={setLayout}
                                placeholder="Room Filter"
                            />
                        </div>
                        {
                            layout?.value === "category" &&
                            <div className="d-flex align-items-center">
                                <div className="layout-select">
                                    <span>
                                    {reportFilter?.length ? <span className="custom-placeholder">
                                        {reportFilter?.filter(p => p.value !== 'select_all')?.length} of {reportByCategory?.Groups?.length} selected
                                    </span> : null}
                                    </span>
                                    <Multiselect
                                        options={
                                            reportByCategory?.Groups?.length > 0 ? [
                                            {
                                                name: "Select All",
                                                value: "select_all"
                                            },
                                            ...reportByCategory?.Groups?.map(a => {
                                                return {
                                                    ...a,
                                                    name: a.Name,
                                                    value: a.ID,
                                                }
                                            })] : []}
                                        selectedValues={!reportFilter ? []: (
                                            reportFilter?.length === reportByCategory?.Groups?.length ? [{
                                                name: "Select All",
                                                value: "select_all"
                                            }, ...reportFilter] : reportFilter
                                        )}
                                        onSelect={(arr, current) => {
                                            if (current.value === 'select_all') {

                                                dispatch(setReportFilter(
                                                    reportByCategory?.Groups?.length > 0 ? [
                                                        {
                                                            name: "Select All",
                                                            value: "select_all"
                                                        },
                                                        ...reportByCategory?.Groups?.map(a => {
                                                            return {
                                                                ...a,
                                                                name: a.Name,
                                                                value: a.ID,
                                                            }
                                                        })].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) : []
                                                ))
                                            } else
                                                dispatch(setReportFilter(arr.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)))
                                        }}
                                        onRemove={(arr, target) => {
                                            let categories = arr.filter(p => p.value !== 'select_all').sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
                                            if(target.value === 'select_all'){
                                                categories = [];
                                            }
                                            dispatch(setReportFilter(categories))
                                        }}
                                        displayValue="name"
                                        placeholder="Group Filter"
                                        showCheckbox={true}
                                        keepSearchTerm={false}
                                        hidePlaceholder={true}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    <div>
                        <CustomPrinter
                            ref={componentRef}
                            icon="fas fa-download"
                            title="Download Report"
                            handleAfterPrint={() => {
                                setHideReportsHeader(true)
                            }}
                            handleBeforePrint={() => {
                                setHideReportsHeader(false)
                            }}
                        />
                        <CustomPrinter
                            ref={componentRef}
                            icon="fas fa-share-alt"
                            title="Share to Distributor"
                            handleAfterPrint={() => {
                                setHideReportsHeader(true)
                            }}
                            handleBeforePrint={() => {
                                setHideReportsHeader(false)
                            }}
                        />
                        <CustomPrinter
                            handleAfterPrint={() => {
                                setHideTotals(false)
                                setHideReportsHeader(true)
                            }}
                            handleBeforePrint={() => {
                                setHideTotals(true)
                                setHideReportsHeader(false)
                            }}
                            ref={componentRef}
                            icon="fas fa-share-square"
                            title="Share to Customer"
                        />
                        <Button variant='link' className='link-btn'>
                            <i className='fas fa-th'></i>
                            Category Layout
                        </Button>
                    </div>
                </div>}

                <ReportsTable layout={layout} hideTotals={hideTotals} />
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
