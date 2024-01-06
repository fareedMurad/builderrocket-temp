import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { getSubdivisions } from "../../actions/subdivisionActions";
import { saveProject } from "../../actions/projectActions";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomerProjectInformation.scss";
import { Link } from "react-router-dom";

// components

import MarketingBlock from "../MarketingBlock";

const projectStatusMap = {
  1: "Open",
  2: "Completed",
  3: "Closed",
};

const CustomerProjectInformation = () => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);
  const [projectInformation, setProjectInformation] = useState(project);
  useEffect(() => {
    dispatch(getSubdivisions());
  }, [dispatch]);

  useEffect(() => {
    setProjectInformation(project);
  }, [project]);

  // useEffect(() => {
  //     return () => {
  //           // save any changes when navigating away
  //         dispatch(saveProject(valueRef.current));
  //     }
  // }, [dispatch]);

  const customerFullName = () => {
    let customerName = "";
    if (
      projectInformation?.Customers?.[0]?.FirstName &&
      !projectInformation?.Customers?.[0]?.LastName
    ) {
      customerName = projectInformation?.Customers?.[0]?.FirstName;
    }
    if (
      projectInformation?.Customers?.[0]?.FirstName &&
      projectInformation?.Customers?.[0]?.LastName
    ) {
      customerName =
        projectInformation?.Customers?.[0]?.FirstName +
        " " +
        projectInformation?.Customers?.[0]?.LastName;
    }
    return customerName;
  };
  return (
    <div className="d-flex project-information">
      <div className="information-form-container">
        <div className="page-title">Project Information</div>

        <Form>
          <div className="d-flex flex-wrap information-form">
            <div className="form-col pb-4">
              <Form.Label className="input-label">Project Name</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.ProjectName}</strong>
              </Form.Label>
            </div>

            <div className="form-col pb-4">
              <Form.Label className="input-label">Customer Name</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{customerFullName()}</strong>
              </Form.Label>
            </div>
            <div className="form-col pb-4">
              <Form.Label className="input-label">Customer Email</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.Customers?.[0]?.Email}</strong>
              </Form.Label>
            </div>
            <div className="form-col pb-4">
              <Form.Label className="input-label">Plan Name</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.PlanName}</strong>
              </Form.Label>
            </div>
            <div className="form-col pb-4">
              <Form.Label className="input-label">Project Status</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>
                  {projectStatusMap[projectInformation?.StatusID]}
                </strong>
              </Form.Label>
            </div>
            <div className="form-col pb-4">
              <Form.Label className="input-label">Subdivision</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.Subdivision}</strong>
              </Form.Label>
            </div>

            <div className="form-col pb-4">
              <Form.Label className="input-label">Street Address 1</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.StreetAddress1}</strong>
              </Form.Label>
            </div>
            <div className="form-col pb-4">
              <Form.Label className="input-label">Street Address2</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.StreetAddress2}</strong>
              </Form.Label>
            </div>
            <div className="form-col pb-4">
              <Form.Label className="input-label">City</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.City}</strong>
              </Form.Label>
            </div>
            <div className="form-col pb-4">
              <Form.Label className="input-label">State</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.State}</strong>
              </Form.Label>
            </div>
            <div className="form-col pb-4">
              <Form.Label className="input-label">Zip Code</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.Zip}</strong>
              </Form.Label>
            </div>

            <div className="form-col pb-4">
              <Form.Label className="input-label">Closing Date</Form.Label>
              <br />
              <Form.Label className="input-label">
                <strong>{projectInformation?.CloseDate}</strong>
              </Form.Label>
            </div>
            {projectInformation?.ProjectLink && (
              <div className="form-col pb-4">
                <Form.Label className="input-label">Project Link</Form.Label>
                <br />
                <a
                  target="_new"
                  href={projectInformation?.ProjectLink}
                  className="text-dark"
                >
                  <Form.Label className="input-label project-link">
                    <strong>{projectInformation?.ProjectLink}</strong>
                  </Form.Label>
                </a>
              </div>
            )}
            <div className="form-col pb-4"></div>
          </div>
        </Form>
      </div>

      <MarketingBlock />
    </div>
  );
};

export default CustomerProjectInformation;
