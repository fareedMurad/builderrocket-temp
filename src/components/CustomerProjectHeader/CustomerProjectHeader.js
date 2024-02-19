import React from "react";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import Utils from "../../utils";
import "./CustomerProjectHeader.scss";

const CustomerProjectHeader = () => {
  const project = useSelector((state) => state.customer.project);
  const refreshThumbnail = useSelector(
    (state) => state.customer?.project?.refreshThumbnail,
  );

  const projectStatusMap = {
    1: "Open",
    2: "Completed",
    3: "Closed",
  };

  return (
    <div className="project-header">
      <div className="d-flex flex-wrap justify-content-between">
        <div className="d-flex pt-2">
          <div className="project-image justify-content-center d-flex">
            {refreshThumbnail ? (
              <div className="spinner">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <img
                alt="project"
                height="119"
                width="167"
                src={project?.ThumbnailURL}
              />
            )}
          </div>
          <div>
            <div className="text">
              <div className="bold-text">Project Approval</div>
            </div>

            <div className="pt-1">
              <div className="bold-text">Customer</div>
              <div>
                {project?.Customers?.[0]?.FirstName}{" "}
                {project?.Customers?.[0]?.LastName}
                <br />
              </div>
              <div>
                <div className="pr-3 text phone">
                  <i className="fas fa-phone mr-2"></i>
                  <a href={`tel:+1${project?.Customers?.[0]?.Phone}`}>
                    {project?.Customers?.[0]?.Phone}
                  </a>
                </div>

                <div className="text email">
                  <i className="fas fa-envelope mr-2"></i>
                  <a href={`mailto:${project?.Customers?.[0]?.Email}`}>
                    {project?.Customers?.[0]?.Email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="middle-section">
          <div className="bold-text">Project</div>
          {project?.ProjectName}
          <br />
          {project?.StreetAddress1}
          <div className="d-flex pt-1">
            <div className="bold-text pr-3">
              Status:
              {"    "}
              <span className="bold-text pl-1">
                {projectStatusMap[project?.StatusID]}
              </span>
            </div>

            {project?.StatusID !== 2 && project?.BuildTime === null && (
              <div className="bold-text pl-3">Build Time</div>
            )}
          </div>
          <div className="d-flex pt-1">
            <div className="bold-text pr-3">
              Closing Date:
              {"    "}
              {Utils.formatDateDashes(project?.CloseDate)}
            </div>
          </div>
        </div>

        <div className="end-section"></div>
      </div>
    </div>
  );
};

export default CustomerProjectHeader;
