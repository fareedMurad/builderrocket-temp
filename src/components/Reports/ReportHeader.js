import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import Utils from "../../utils";
import "./Reports.scss";
import ProjectPlaceholder from "../../assets/images/project_placeholder-image.png";

const ReportHeader = ({ hideTotals }) => {
  const dispatch = useDispatch();

  const report = useSelector((state) => state.project?.report);
  const refreshThumbnail = useSelector(
    (state) => state.project.refreshThumbnail
  );

  const projectStatusMap = {
    1: "Open",
    2: "Completed",
    3: "Closed",
  };
  return (
    <div className="report-header p-2">
      <div className="d-flex justify-content-between flex-wrap">
        <div className="d-flex pt-2 flex-wrap">
          <div className="report-image justify-content-center d-flex">
            {refreshThumbnail ? (
              <div className="spinner">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <img
                alt="project"
                height="119"
                width="167"
                src={report?.ThumbnailURL || ProjectPlaceholder}
              />
            )}
          </div>
          <div className="ml-2">
            <div className="text">{report?.ProjectNumber}</div>

            <div className="pt-2 d-flex">
              <div className="report-name">{report?.ProjectName}</div>
            </div>

            <div className="d-flex">{report?.StreetAddress1}</div>
            <div className="d-flex">
              {report?.City}
              {report?.City ? "," : ""} {report?.State} {report?.Zip}
            </div>
          </div>
        </div>

        <div className="middle-section">
          <div className="bold-text">
            {report?.Customers?.[0]?.FirstName}{" "}
            {report?.Customers?.[0]?.LastName}
          </div>
          <div className="d-flex">
            <div className="pr-3 text phone">
              <i className="fas fa-phone mr-2"></i>
              <a href={`tel:+1${report?.Customers?.[0]?.Phone}`}>
                {report?.Customers?.[0]?.Phone}
              </a>
            </div>

            <div className="text email">
              <i className="fas fa-envelope mr-2"></i>
              <a href={`mailto:${report?.Customers?.[0]?.Email}`}>
                {report?.Customers?.[0]?.Email}
              </a>
            </div>
          </div>
          <div className="d-flex pt-3">
            <div className="bold-text pr-3">
              Closed On
              {Utils.formatDateDashes(report?.CloseDate)}
            </div>

            {report?.StatusID !== 2 && report?.BuildTime === null && (
              <div className="bold-text pl-3">Build Time</div>
            )}
          </div>
        </div>

        <div className="end-section">
          <div className="d-flex pt-2 justify-content-md-end">
            <div className="pt-1 pr-3 text">
              Status:{" "}
              <span className="bold-text pl-1">
                {projectStatusMap[report?.StatusID]}
              </span>
            </div>
          </div>

          <div className="d-flex total justify-content-end text">
            {!hideTotals && " Project Total: $0.00 Margin: $0.00"}
          </div>
          <div className="d-flex total justify-content-end text">
            Line Totals: $
            {report?.Items?.map((a) => a.LineTotal).reduce((a, b) => a + b, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
