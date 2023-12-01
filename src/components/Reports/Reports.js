import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getReportByProjectID,
  getCategorizedReportByProjectID,
  getRoomReportByProjectID,
  getVendorReportByProjectID,
} from "../../actions/projectActions";
import { Button, Form, Spinner } from "react-bootstrap";
import { setSelectedRoom } from "../../actions/roomActions";
import {
  setRoomFilter,
  setReportFilter,
  setCustomerFilter,
  setShowEmptyDataFilter,
  setRoughInTrimOutFilter,
  saveReportsFilter,
  getReportsFilters,
  updateReportsFilter,
  deleteReportsFilter,
} from "../../actions/reportActions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import ReportsHeader from "./ReportHeader";
import Select, { components } from "react-select";
import Multiselect from "multiselect-react-dropdown";
import ReportsTable from "./ReportsTable";
import { CustomPrinter } from "../../components/PDF";

import "./Reports.scss";
import SaveReportsFilterModal from "../SaveReportsFilterModal/SaveReportsFilterModal";
import { getCategories } from "../../actions/productActions";

const LayoutOptions = [
  { value: "list", label: "List" },
  { value: "category", label: "Category" },
  { value: "room", label: "Room" },
  { value: "vendor", label: "Vendor" },
];

const RoughInTrimOutOptions = [
  { value: null, label: "All Products" },
  { value: "RoughIn", label: "Rough In" },
  { value: "TrimOut", label: "Trim Out" },
];

const Reports = (props) => {
  const dispatch = useDispatch();
  const componentRef = React.useRef(null);

  const report = useSelector((state) => state.project.report);
  const project = useSelector((state) => state.project.project);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);
  const reportByCategory = useSelector(
    (state) => state.project.reportByCategory
  );

  const [isLoading, setIsLoading] = useState(false);
  const [layout, setLayout] = useState(LayoutOptions[0]);
  //   const [newgroupcategory, setGroupCategory] = useState(true);
  const roughInTrimOut = useSelector(
    (state) => state.reportFilter.roughInTrimOut
  );
  const reportFilter = useSelector((state) => state.reportFilter.reportFilters);
  const roomFilter = useSelector((state) => state.reportFilter.roomFilters);
  const localFilters = useSelector((state) => state.reportFilter);
  const IsBuilderCustomer = useSelector(
    (state) => state.reportFilter.isCustomer
  );
  const showEmptyData = useSelector(
    (state) => state.reportFilter.showEmptyData
  );

  const [hideTotals, setHideTotals] = useState(false);
  const [firstCategoryLoad, setFirstCategoryLoad] = useState(true);
  const [hideReportsHeader, setHideReportsHeader] = useState(true);
  const [selectedSavedFilter, setSelectedSavedFilter] = useState(null);
  const [listSavedReports, setListSavedReports] = useState([]);
  const [showSaveFilterNameModal, setShowSaveFilterNameModal] = useState(false);
  const [editReportID, setEditReportID] = useState(null);
  useEffect(() => {
    if (isEmpty(selectedRoom))
      dispatch(setSelectedRoom(report?.ProjectRooms?.[0]));
    // if (groupLayout?.length > 0) {
    //     dispatch(setReportFilter(groupLayout))
    // } else if (layout) {
    //     dispatch(setReportFilter(layout))
    // }
  }, [dispatch, report, selectedRoom]);

  //   useEffect(() => {
  //     if (isEmpty(reportByCategory)) {
  //       dispatch(getCategorizedReportByProjectID(project?.ID));
  //     }
  //   }, [dispatch, report, reportByCategory]);

  useEffect(() => {
    setIsLoading(true);
    if (layout?.value === "list") {
      dispatch(getReportByProjectID(project?.ID))
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else if (layout?.value === "category" || layout?.value === "room") {
      dispatch(getCategorizedReportByProjectID(project?.ID))
        .then((response) => {
          handleSetChildFilters(response);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
      dispatch(getRoomReportByProjectID(project?.ID))
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else if (layout?.value === "vendor") {
      dispatch(getVendorReportByProjectID(project?.ID))
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [dispatch, layout]);


  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleSetChildFilters = (array) => {
    dispatch(
      setReportFilter(
        array?.Groups?.map((a) => {
          return {
            ...a,
            name: a.Name,
            value: a.ID,
          };
        })?.filter((a) =>
          selectedSavedFilter
            ? selectedSavedFilter.CategoryIDs?.find((b) => b === a.value)
            : a.value
        )
      ) || []
    );
    dispatch(
      setRoomFilter(
        array?.Rooms?.map((a) => {
          return {
            ...a,
            name: a.Name,
            value: a.ID,
          };
        })?.filter((a) =>
          selectedSavedFilter
            ? selectedSavedFilter.RoomIDs?.find((b) => b === a.value)
            : a.value
        )
      ) || []
    );
  };

  const handleSelectedRoom = useCallback(
    (roomID) => {
      const selectedRoomObj = report?.ProjectRooms?.find(
        (room) => room.ID === parseInt(roomID)
      );

      dispatch(setSelectedRoom(selectedRoomObj));
    },
    [dispatch, report]
  );

  useEffect(() => {
    if (!isEmpty(selectedRoom)) handleSelectedRoom(selectedRoom?.ID);
  }, [report, selectedRoom, handleSelectedRoom]);

  useEffect(() => {
    handleFetchSavedReports();
  }, []);

  const onChangeHideTotals = (e) => {
    if (hideTotals) {
      setHideTotals(false);
    } else {
      setHideTotals(true);
    }
  };

  const onChangeIsCustomer = (e) => {
    dispatch(setCustomerFilter(!localFilters.isCustomer));
  };
  const onChangeShowEmptyData = (e) => {
    dispatch(setShowEmptyDataFilter(!localFilters.showEmptyData));
  };
  const handleUpdateRoughInTrimOut = (e) => {
    dispatch(setRoughInTrimOutFilter(e.value));
  };

  const downloadReportURL = btoa(
    JSON.stringify({
      projectID: project.ID,
      groupIDs: reportFilter?.map?.((r) => r.ID),
      roomIDs: roomFilter?.map?.((r) => r.ID),
      filter: layout.value,
    })
  );
  const hanldeChangeSelectedFilter = (option) => {
    setSelectedSavedFilter(option);
  };

  const handleSaveReportModal = () => {
    setShowSaveFilterNameModal(true);
  };

  const handleFetchSavedReports = () => {
    dispatch(getReportsFilters()).then((res) => {
      setListSavedReports(
        res?.map((a) => ({ ...a, value: a.ID, label: a.Name }))
      );
    });
  };

  const handleSaveReport = (filtersForm) => {
    if (editReportID) {
      handleEditSavedReport(editReportID, filtersForm?.Name);
    } else {
      const payload = {
        Name: filtersForm?.Name,
        GroupBy: layout.value,
        CategoryIDs: reportFilter?.map((r) => r.ID),
        RoomIDs: roomFilter?.map((r) => r.ID),
        RoughInTrimOut: roughInTrimOut,
        IsBuilderCustomer: localFilters.isCustomer,
        IsShowEmptyCategoriesRooms: showEmptyData,
      };
      dispatch(saveReportsFilter(payload)).then((res) => {
        handleFetchSavedReports();
      });
    }
    setEditReportID(null);
    setShowSaveFilterNameModal(false);
  };

  const handleEditSavedReport = (ID, Name) => {
    const findFilter = listSavedReports?.find((f) => f.ID === Number(ID));
    const payload = {
      ID,
      Name,
      GroupBy: findFilter?.GroupBy,
      CategoryIDs: findFilter?.CategoryIDs,
      RoomIDs: findFilter?.RoomIDs,
      RoughInTrimOut: findFilter?.RoughInTrimOut,
      IsBuilderCustomer: findFilter?.IsBuilderCustomer,
      IsShowEmptyCategoriesRooms: findFilter?.IsShowEmptyCategoriesRooms,
    };
    dispatch(updateReportsFilter(payload)).then((res) => {
      handleFetchSavedReports();
    });
  };

  const handleDeleteSavedReport = (ID) => {
    dispatch(deleteReportsFilter(ID)).then((res) => {
      handleFetchSavedReports();
    });
  };

  function Option({ children, ...props }) {
    return (
      <div>
        <components.Option {...props}>
          <div className="d-flex justify-content-between">
            {children}
            <div className="d-flex">
              <i
                className="far fa-pen fa-sm tab-icon p-2 pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSaveFilterNameModal(true);
                  setEditReportID(props.value);
                }}
              ></i>
              <i
                className="far fa-trash fa-sm tab-icon p-2 pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSavedReport(props.value);
                }}
              ></i>
            </div>
          </div>
        </components.Option>
      </div>
    );
  }

  useEffect(() => {
    if (selectedSavedFilter) {
      if (layout?.value === selectedSavedFilter.GroupBy) {
        handleSetChildFilters(reportByCategory);
      }
      setLayout(
        LayoutOptions.find((lo) => selectedSavedFilter.GroupBy === lo.value)
      );

      dispatch(setCustomerFilter(selectedSavedFilter.IsBuilderCustomer));
      dispatch(setRoughInTrimOutFilter(selectedSavedFilter.RoughInTrimOut));
      dispatch(
        setShowEmptyDataFilter(selectedSavedFilter.IsShowEmptyCategoriesRooms)
      );
    }
  }, [selectedSavedFilter]);

  return (
    <div className="d-flex products">
      <div className="reports-container" ref={componentRef}>
        {!hideReportsHeader && <ReportsHeader hideTotals={hideTotals} />}
        {hideReportsHeader && (
          <>
            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
              <div className=" d-flex align-items-center mx-3  mt-3">
                <Form>
                  <Form.Check
                    value={true}
                    checked={localFilters.isCustomer}
                    onChange={onChangeIsCustomer}
                    type="switch"
                    id="custom-switch"
                    label="Builder/Customer"
                  />
                </Form>
                <div className="ml-3">
                  {["category", "room"].indexOf(layout?.value) > -1 ? (
                    <div className={"d-inline-block"}>
                      <Form.Check
                        value={false}
                        checked={localFilters.showEmptyData}
                        onChange={onChangeShowEmptyData}
                        type="switch"
                        id="empty-data-switch"
                        label="Show Empty Categories/Rooms"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center mx-2">
                <div className={layout?.value === "category" ? " mx-3" : ""}>
                  <Button
                    onClick={handleSaveReportModal}
                    variant="link"
                    className="link-btn"
                  >
                    <i className="fas fa-filter"></i>
                    Save Reports
                  </Button>

                  <CustomPrinter
                    ref={componentRef}
                    icon="fas fa-download"
                    title="Download Report"
                    handleAfterPrint={() => {
                      setHideReportsHeader(true);
                    }}
                    handleBeforePrint={() => {
                      setHideReportsHeader(false);
                    }}
                  />
                  <CustomPrinter
                    ref={componentRef}
                    icon="fas fa-share-alt"
                    title="Share to Distributor"
                    handleAfterPrint={() => {
                      setHideReportsHeader(true);
                    }}
                    handleBeforePrint={() => {
                      setHideReportsHeader(false);
                    }}
                  />
                  <CustomPrinter
                    handleAfterPrint={() => {
                      setHideTotals(false);
                      setHideReportsHeader(true);
                    }}
                    handleBeforePrint={() => {
                      setHideTotals(true);
                      setHideReportsHeader(false);
                    }}
                    ref={componentRef}
                    icon="fas fa-share-square"
                    title="Share to Customer"
                  />
                  <Button variant="link" className="link-btn">
                    <i className="fas fa-th"></i>
                    Category Layout
                  </Button>
                </div>
              </div>
            </div>
            <div className="d-flex flex-wrap align-items-center">
              <div
                className="d-flex flex-wrap align-items-center mx-2"
                style={{ zIndex: 9 }}
              >
                <div className="layout-select" style={{ zIndex: 9999 }}>
                  <span>My Saved Reports:</span>
                  <Select
                    options={listSavedReports}
                    value={selectedSavedFilter}
                    onChange={hanldeChangeSelectedFilter}
                    placeholder="Select saved reports..."
                    components={{ Option }}
                  />
                </div>

                <div className="layout-select" style={{ zIndex: 9999 }}>
                  <span>Group By:</span>
                  <Select
                    options={LayoutOptions}
                    value={layout}
                    onChange={setLayout}
                    placeholder="Room Filter"
                  />
                </div>
                {(layout?.value === "category" || layout?.value === "room") && (
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="room_option">Category Filter:</span>
                      <div className="layout-select">
                        <span>
                          {reportFilter?.length ? (
                            <span className="custom-placeholder">
                              {
                                reportFilter?.filter(
                                  (p) => p.value !== "select_all"
                                )?.length
                              }{" "}
                              of {reportByCategory?.Groups?.length} selected
                            </span>
                          ) : null}
                        </span>
                        <Multiselect
                          options={
                            reportByCategory?.Groups?.length > 0
                              ? [
                                  {
                                    name: "Select All",
                                    value: "select_all",
                                  },
                                  ...(reportByCategory?.Groups?.map((a) => {
                                    return {
                                      ...a,
                                      name: a.Name,
                                      value: a.ID,
                                    };
                                  }).sort((a, b) => a.name.localeCompare(b.name))),
                                ]
                              : []
                          }
                          selectedValues={
                            !reportFilter
                              ? []
                              : reportFilter?.length ===
                                reportByCategory?.Groups?.length
                              ? [
                                  {
                                    name: "Select All",
                                    value: "select_all",
                                  },
                                  ...reportFilter,
                                ]
                              : reportFilter
                          }
                          onSelect={(arr, current) => {
                            if (current.value === "select_all") {
                              dispatch(
                                setReportFilter(
                                  reportByCategory?.Groups?.length > 0
                                    ? [
                                        {
                                          name: "Select All",
                                          value: "select_all",
                                        },
                                        ...reportByCategory?.Groups?.map(
                                          (a) => {
                                            return {
                                              ...a,
                                              name: a.Name,
                                              value: a.ID,
                                            };
                                          }
                                        ),
                                      ].sort((a, b) =>
                                        a.name < b.name
                                          ? -1
                                          : a.name > b.name
                                          ? 1
                                          : 0
                                      )
                                    : []
                                )
                              );
                            } else
                              dispatch(
                                setReportFilter(
                                  arr.sort((a, b) =>
                                    a.name < b.name
                                      ? -1
                                      : a.name > b.name
                                      ? 1
                                      : 0
                                  )
                                )
                              );
                          }}
                          onRemove={(arr, target) => {
                            let categories = arr
                              .filter((p) => p.value !== "select_all")
                              .sort((a, b) =>
                                a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                              );
                            if (target.value === "select_all") {
                              categories = [];
                            }
                            dispatch(setReportFilter(categories));
                          }}
                          displayValue="name"
                          placeholder="Category Filter"
                          showCheckbox={true}
                          keepSearchTerm={false}
                          hidePlaceholder={true}
                        />
                      </div>
                    </div>
                    <div className="">
                      <span className="room_option">Room Filter:</span>
                      <div className="layout-select">
                        <span>
                          {roomFilter?.length ? (
                            <span className="custom-placeholder">
                              {
                                roomFilter?.filter(
                                  (p) => p.value !== "select_all"
                                )?.length
                              }{" "}
                              of {reportByCategory?.Rooms?.length} selected
                            </span>
                          ) : null}
                        </span>
                        <Multiselect
                          options={
                            reportByCategory?.Rooms?.length > 0
                              ? [
                                  {
                                    name: "Select All",
                                    value: "select_all",
                                  },
                                  ...(reportByCategory?.Rooms?.map((a) => {
                                    return {
                                      ...a,
                                      name: a.Name,
                                      value: a.ID,
                                    };
                                  }).sort((a, b) => a.name.localeCompare(b.name))),
                                ]
                              : []
                          }
                          selectedValues={
                            !roomFilter
                              ? []
                              : roomFilter?.length ===
                                reportByCategory?.Rooms?.length
                              ? [
                                  {
                                    name: "Select All",
                                    value: "select_all",
                                  },
                                  ...roomFilter,
                                ]
                              : roomFilter
                          }
                          onSelect={(arr, current) => {
                            if (current.value === "select_all") {
                              dispatch(
                                setRoomFilter(
                                  reportByCategory?.Rooms?.length > 0
                                    ? [
                                        {
                                          name: "Select All",
                                          value: "select_all",
                                        },
                                        ...reportByCategory?.Rooms?.map((a) => {
                                          return {
                                            ...a,
                                            name: a.Name,
                                            value: a.ID,
                                          };
                                        }),
                                      ].sort((a, b) =>
                                        a.name < b.name
                                          ? -1
                                          : a.name > b.name
                                          ? 1
                                          : 0
                                      )
                                    : []
                                )
                              );
                            } else
                              dispatch(
                                setRoomFilter(
                                  arr.sort((a, b) =>
                                    a.name < b.name
                                      ? -1
                                      : a.name > b.name
                                      ? 1
                                      : 0
                                  )
                                )
                              );
                          }}
                          onRemove={(arr, target) => {
                            let rooms = arr
                              .filter((p) => p.value !== "select_all")
                              .sort((a, b) =>
                                a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                              );
                            if (target.value === "select_all") {
                              rooms = [];
                            }
                            dispatch(setRoomFilter(rooms));
                          }}
                          displayValue="name"
                          placeholder="Room Filter"
                          showCheckbox={true}
                          keepSearchTerm={false}
                          hidePlaceholder={true}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex align-items-center mb-[0.1rem]">
                  <div className="rough-in-select">
                    <span>Rough In/Trim Out:</span>
                    <Select
                      options={RoughInTrimOutOptions}
                      value={RoughInTrimOutOptions.find(
                        (v) => v.value === localFilters?.roughInTrimOut
                      )}
                      onChange={handleUpdateRoughInTrimOut}
                      placeholder="Rough In/Trim Out Filter"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <ReportsTable layout={layout} hideTotals={hideTotals} />
        <div className="d-flex justify-content-center pt-5">
          {isLoading ? <Spinner animation="border" variant="primary" /> : null}
        </div>
      </div>

      <SaveReportsFilterModal
        show={showSaveFilterNameModal}
        handleClose={() => {
          setEditReportID(null);
          setShowSaveFilterNameModal(false);
        }}
        isAdd={editReportID}
        handleSave={handleSaveReport}
        defaultValues={{
          Name: listSavedReports?.find((f) => f.ID === editReportID)?.Name,
        }}
      />
    </div>
  );
};

export default Reports;
