import React, {useEffect, useState} from 'react';
import {Table} from 'react-bootstrap';
import {setSelectedRoom} from '../../actions/roomActions';
import {useDispatch, useSelector} from 'react-redux';
import {isEmpty} from 'lodash';
import ProjectPlaceholder from '../../assets/images/project_placeholder-image.png';
import Utils from '../../utils'

import './Reports.scss';


const ReportsTable = React.forwardRef(({layout, hideTotals}, ref) => {
    const dispatch = useDispatch();
    const report = useSelector(state => state.project.report);
    const reportByRoom = useSelector(state => state.project.reportByRoom);
    const reportByCategory = useSelector(state => state.project.reportByCategory);
    const reportsByVendor = useSelector(state => state.project.reportsByVendor);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const reportFilter = useSelector(state => state.reportFilter.reportFilters);
    const roomFilter = useSelector(state => state.reportFilter.roomFilters);

    useEffect(() => {
        if (isEmpty(selectedRoom))
            dispatch(setSelectedRoom(report?.ProjectRooms?.[0]));
    }, [dispatch, report, selectedRoom]);


    const renderHeader = (printOnly = false, subHeader = null) => {
        return (
            <thead className={printOnly ? "to-print-only" : ""}>
            {subHeader ? subHeader : null}
            <tr>
                <th width="100">Image</th>
                <th>
                    Brand
                </th>
                <th>Model</th>
                <th>ProductName</th>
                <th>Color/Finish</th>
                <th className={'desc-col'}>Description</th>
                <th>Vendor</th>
                <th>UOM</th>
                <th style={{width: '80px'}}>Total Qty</th>
                <th>Price</th>
                <th style={{width: '80px'}}>Line Total</th>
            </tr>
            </thead>
        )
    }

    const renderTableBody = (item, index, expend) => {
        return (
            <tr key={index} className={(!expend ? "" : "hide") + " to-expand"}>
                <td style={{paddingRight: '40px'}}>
                    <img
                        width='50'
                        height='50'
                        alt='template item'
                        src={item?.ProductThumbnailURl || ProjectPlaceholder}
                    />
                </td>
                <td>{item?.BrandName}</td>
                <td>{item?.ModelNumber}</td>
                <td>{item?.ProductName}</td>
                <td>{item?.ColorFinish}</td>
                <td>{Utils.textEllipsis(item?.ShortDescription, 150)}</td>
                <td>{item?.VendorName}</td>
                <td>{item?.UnitOfMeasure}</td>
                <td>{item?.Quantity}</td>
                <td>{item?.Price}</td>
                <td>{item?.LineTotal}</td>
            </tr>
        )
    }

    const renderGroup = (data, item) => {
        return (
            <>
                {renderHeader()}
                <tbody>
                {data?.Groups?.length && data?.Groups?.map((item, index) => {
                    return (
                        item ? <TableRow {...{renderTableBody, item, roomFilter, allRooms: null}} /> : null
                    )
                })}
                </tbody>
            </>
        )
    }

    const renderTableByLayout = () => {
        let table = null

        switch (layout?.value) {
            case 'list' || 'vendor':
                table = (
                    <>
                        {renderHeader()}
                        <tbody>
                        {report?.Items?.map((item, index) => renderTableBody(item, index))}
                        </tbody>
                    </>
                )

                break;
            case 'category':
                table = (
                    <>
                        {reportFilter?.filter((item) => {
                            let rooms = roomFilter?.filter(r => r.value !== 'select_all');
                            if(rooms.length === reportByCategory.Rooms.length){
                                return true;
                            }
                            return item.Items?.find(i => i.Rooms?.find(r => rooms.find(pr => pr.ID === r)));
                        }).map?.(item =>
                            <Table>
                                <TableRow {...{renderTableBody, item, renderHeader, roomFilter, allRooms: reportByCategory?.Rooms}} />
                            </Table>
                        )}
                    </>
                )

                return table;
            case 'room':
                table = renderGroup(reportByRoom)

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
            {renderTableByLayout()}
        </div>
    );
})

export default ReportsTable;

export const TableRow = ({item, renderTableBody, renderHeader, roomFilter, allRooms}) => {


    const [expend, setExpend] = useState(false);
    const groupRow = (
        <>
            <tr onClick={() => setExpend(!expend)} className="contractor-type-name">
                <th colSpan={10} className="contractor-type-name bg-dark">{item.Name}</th>
                <th className="contractor-type-name justify-content-end h-full bg-dark">
                    <i className={`far ${expend ? 'fa-chevron-double-up' : 'fa-chevron-double-down'}`}></i>
                </th>
            </tr>
        </>
    )

    return (
        <>
            {renderHeader ? renderHeader(false, groupRow) : groupRow}
            {item?.Items?.length ? item?.Items?.filter((item) => {
                    let rooms = roomFilter?.filter(r => r.value !== 'select_all');
                    if(!rooms || !allRooms || rooms.length === allRooms.length){
                        return true;
                    }
                    return item.Rooms?.find(r => rooms.find(pr => pr.ID === r));
                }).map((item, index) => renderTableBody(item, index, expend))
                : null
            }
        </>
    )
}
