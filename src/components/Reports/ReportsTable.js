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
    const localFilters = useSelector(state => state.reportFilter);

    useEffect(() => {
        if (isEmpty(selectedRoom))
            dispatch(setSelectedRoom(report?.ProjectRooms?.[0]));
    }, [dispatch, report, selectedRoom]);


    const renderHeader = (printOnly = false, subHeader = null, isEmpty = false) => {
        return (
            <thead className={printOnly ? "to-print-only" : ""}>
            {subHeader ? subHeader : null}
            { isEmpty ? null : <tr>
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
            </tr>}
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
                        item ? <TableRow {...{renderTableBody, item, allRooms: null, localFilters}} /> : null
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
                const items = FilterItems({localFilters, items: report?.Items});
                table = (
                    <>
                        {renderHeader()}
                        <tbody>
                        {items?.map((item, index) => renderTableBody(item, index))}
                        </tbody>
                    </>
                )

                break;
            case 'category':
                table = (
                    <>
                        {reportFilter?.filter((item) => {
                            let rooms = localFilters.roomFilters?.filter(r => r.value !== 'select_all');
                            if (rooms.length === reportByCategory.Rooms.length) {
                                return true;
                            }
                            const items = FilterItems({localFilters, items: item?.Items});
                            return items?.length > 0 && items?.find(i => i.Rooms?.find(r => rooms.find(pr => pr.ID === r)));
                        }).map?.(item => {
                            const items = FilterItems({localFilters, items: item?.Items});
                            if((!items || items.length === 0) && !localFilters.showEmptyData) return null;
                             return   <Table>
                                    <TableRow {...{
                                        renderTableBody,
                                        item,
                                        renderHeader,
                                        allRooms: reportByCategory?.Rooms,
                                        localFilters
                                    }} />
                                </Table>
                            }
                        )}
                    </>
                )

                return table;
            case 'room':
                table = renderGroup(reportByRoom)
                break;

            default: {
                const items = FilterItems({localFilters, items: report?.Items});
                return (
                    <>
                        {renderHeader()}
                        <tbody>
                        {items?.map((item, index) => renderTableBody(item, index))}
                        </tbody>
                    </>
                )
            }
        }

        if(!table) {
            return null;
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

export const TableRow = ({item, renderTableBody, renderHeader, allRooms, localFilters}) => {
    const [expend, setExpend] = useState(false);
    const items = FilterItems({localFilters, items: item?.Items});
    if((!items || items.length === 0) && !localFilters.showEmptyData){
        return null;
    }
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
            {items?.length > 0 ? items?.filter((item) => {
                    let rooms = localFilters.roomFilters?.filter(r => r.value !== 'select_all');
                    if (!rooms || !allRooms || rooms.length === allRooms.length) {
                        return true;
                    }
                    return item.Rooms?.find(r => rooms.find(pr => pr.ID === r));
                }).map((item, index) => renderTableBody(item, index, expend))
                : null
            }
        </>
    )
}

    export const FilterItems = ({localFilters, items}) => {
        return items?.filter(value => {
            return (localFilters.isCustomer ? value.RequiresApproval : true) &&
                (localFilters.roughInTrimOut !== null ? value.RoughInTrimOutEnum === localFilters.roughInTrimOut : true)
        })
    }
