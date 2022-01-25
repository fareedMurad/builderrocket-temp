import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { setSelectedRoom } from '../../actions/roomActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import ProjectPlaceholder from '../../assets/images/project_placeholder-image.png';
import Utils from '../../utils'

import './Reports.scss';


const ReportsTable = React.forwardRef(({ layout, hideTotals }, ref) => {
    const dispatch = useDispatch();

    const report = useSelector(state => state.project.report);
    const reportByRoom = useSelector(state => state.project.reportByRoom);
    const reportByCategory = useSelector(state => state.project.reportByCategory);
    const reportsByVendor = useSelector(state => state.project.reportsByVendor);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    useEffect(() => {
        if (isEmpty(selectedRoom))
            dispatch(setSelectedRoom(report?.ProjectRooms?.[0]));
    }, [dispatch, report, selectedRoom]);


    const renderHeader = () => {
        return (
            <thead>
                <tr>
                    <th width="100">Image</th>
                    <th>
                        Brand
                    </th>
                    <th>Model</th>
                    <th>ProductName</th>
                    <th>Color/Finish </th>
                    <th>Description</th>
                    {!hideTotals && <th>Vendor</th>}
                    <th>UOM</th>
                    <th>Total Qty </th>
                    {!hideTotals && <th>Price</th>}
                    {!hideTotals && <th>LineTotal</th>}
                </tr>
            </thead>
        )
    }

    const renderTableBody = (item, index, expend) => {
        return (
            <tr key={index} className={!expend ? "":"hide"}>
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
                {!hideTotals && <td>{item?.VendorName}</td>}
                <td>{item?.UnitOfMeasure}</td>
                <td>{item?.Quantity}</td>
                {!hideTotals && <td>{item?.Price}</td>}
                {!hideTotals && <td>{item?.LineTotal}</td>}
            </tr>
        )
    }

    const renderGroup = (data, item) => {
        return (
            <>
                {renderHeader()}
                <tbody>
                    {data?.Groups?.map((item, index) => {
                        return (
                            item.Items?.length ? <TableRow {...{ renderTableBody, item}}/>: null
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
            {/* <div className='table-title'>Title</div> */}
            {renderTableByLayout()}
        </div>
    );
})

export default ReportsTable;

export const TableRow = ({item, renderTableBody}) => {


    const [expend, setExpend] = useState(false);


    return (
        <>
            <tr onClick={() => setExpend(!expend)} className="contractor-type-name">
                <td colSpan={10} className="contractor-type-name">{item.Name}</td>
                <td className="contractor-type-name d-flex justify-content-end h-full">
                    <i className={`far ${expend ? 'fa-chevron-double-up' : 'fa-chevron-double-down'}`}></i>
                </td>
            </tr>
            {item?.Items?.length ? item?.Items?.map((item, index) => renderTableBody(item, index, expend))
                : <tr className={!expend ? "":"hide"}>
                    <td colSpan={11} className="no-items">There are no items found! for <b><i>{item.Name}</i></b></td>
                </tr>
            }
        </>
    )
}