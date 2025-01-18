import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectByProjectID,
  setSelectedProjectTab,
} from "../../actions/projectActions";
import "./Project.scss";

// components
import ProjectHeader from "../../components/ProjectHeader";
import ProjectTabs from "../../components/ProjectTabs";
import { Spinner } from "react-bootstrap";

import { useHistory } from "react-router";
const Project = () => {
  const dispatch = useDispatch();

  const history = useHistory();
  const project = useSelector((state) => state.project.project);

  useEffect(() => {
    // reset selected tab when leaving page
    return () => {
      dispatch(setSelectedProjectTab("projectInformation"));
    };
  }, []);

  useEffect(() => {
    if (project?.ID) dispatch(getProjectByProjectID(project.ID));
    else {
      history.push("/");
    }
  }, []);

  if (!project?.ID) return null;

  return (
    <>
      <ProjectHeader />
      <ProjectTabs />
    </>
  );
};

export default Project;
