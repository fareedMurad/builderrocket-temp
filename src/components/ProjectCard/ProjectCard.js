import React from "react";
import { useDispatch } from "react-redux";
import { getProjectByProjectID } from "../../actions/projectActions";
import Utils from "../../utils";
import "./ProjectCard.scss";
import toast from "react-hot-toast";
import Toaster from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const ProjectCard = (props) => {
  const { project, history, isCustomer, handlePinChanged, pinLoader } = props;

  const dispatch = useDispatch();

  const goToProject = () => {
    dispatch(getProjectByProjectID(project?.ID))
      .then((response) => {
        if (isCustomer)
          history.push(`/customer/project/${response?.ID}/projectInformation`);
        else
          history.push(`/project/${project?.ProjectNumber}/projectInformation`);
      })
      .catch((response) => {
        alert("Error! Can't load the project");
      });
  };

  return (
    <div
      className="project-card"
      onClick={goToProject}
      style={{
        backgroundImage: `url(${project?.ThumbnailURL})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="card-container">
        <div className="top-section">
          <div className="pr-2 float-right">
            {pinLoader.includes(project.ID) ? (
              <Spinner size="sm" animation="border" variant="primary" />
            ) : (
              <i
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await handlePinChanged();
                }}
                className={`fa fa-thumb-tack text-2xl  ${
                  project?.IsPinned ? "text-danger" : ""
                }`}
                style={{ paddingTop: "12px" }}
                aria-hidden="true"
              ></i>
            )}
          </div>
          {(project?.ProjectNumber || project?.Status) && (
            <div className="lot-number">
              {project?.ProjectNumber}
              {project?.Status && (
                <span className={"float-right mr-3 bottom-title"}>
                  {project?.Status}
                </span>
              )}
            </div>
          )}
          <div className="project-name">{project?.ProjectName}</div>
        </div>

        {(project?.StreetAddress1 ||
          project?.City ||
          project?.State ||
          project?.Zip) && (
          <div className="address-section">
            <div>
              {project?.StreetAddress1} {project?.City}
            </div>
            <div>
              {project?.State} {project?.Zip}
            </div>
          </div>
        )}

        <div className="d-flex justify-content-center align-items-end bottom-section">
          {project?.PermitDate && (
            <div className="date-col">
              <div className="bottom-title">Permit Date</div>
              <div className="bottom-text">
                {Utils.formatDateDashes(project?.PermitDate)}
              </div>
            </div>
          )}
          {project?.OccupencyCreated && (
            <div className="date-col">
              <div className="bottom-title">C.O. Date</div>
              <div className="bottom-text">
                {Utils.formatDateDashes(project?.OccupencyCreated)}
              </div>
            </div>
          )}
          {project?.CloseCreated && (
            <div className="date-col">
              <div className="bottom-title">Closed On</div>
              <div className="bottom-text">
                {Utils.formatDateDashes(project?.CloseCreated)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
