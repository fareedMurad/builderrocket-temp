import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Form, FormControl, Spinner } from "react-bootstrap";
import {
  getProjects,
  resetProject,
  saveProject,
  setProjects,
  updateProjectIsPinned,
} from "../../actions/projectActions.js";
import { getUserProfile } from "../../actions/userActions.js";
import { Link } from "react-router-dom";
import "./Home.scss";

// components
import ProjectCard from "../../components/ProjectCard";
import MarketingBlock from "../../components/MarketingBlock";
import Multiselect from "multiselect-react-dropdown";
import { ProjectStatus } from "../../utils/contants";

const Home = (props) => {
  const { history } = props;

  const dispatch = useDispatch();

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const projects = useSelector((state) => state.project.projects);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [goToProjectLoader, setGoToProjectLoader] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    ProjectStatus.filter((item) => item.id === 1)
  );
  const [projectsStatus, setProjectsStatus] = useState("Active");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [showPinnedProjects, setShowPinnedProjects] = useState(false);
  const [pinLoader, setPinLoader] = useState([]);

  useEffect(() => {
    if (isSignedIn) {
      setIsLoading(true);

      dispatch(getProjects())
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));

      dispatch(getUserProfile());
    }
  }, [dispatch, isSignedIn]);

  useEffect(() => {
    /* Filter projects on project name, project #, lot #, street address, or customer first name.
        Filter delayed by 1 second */
    const timer = setTimeout(() => {
      const filter = projects?.filter(
        (project) =>
          project?.ProjectName?.toLowerCase().includes(
            searchTerm?.toLowerCase()
          ) ||
          project?.ProjectNumber?.toLowerCase().includes(
            searchTerm?.toLowerCase()
          ) ||
          project?.Subdivision?.toLowerCase().includes(
            searchTerm?.toLowerCase()
          ) ||
          project?.LotNumber?.toLowerCase().includes(
            searchTerm?.toLowerCase()
          ) ||
          project?.StreetAddress1?.toLowerCase().includes(
            searchTerm?.toLowerCase()
          ) ||
          project?.StreetAddress2?.toLowerCase().includes(
            searchTerm?.toLowerCase()
          ) ||
          project?.State?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          project?.City?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          project?.Zip?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          project?.PlanName?.toLowerCase().includes(
            searchTerm?.toLowerCase()
          ) ||
          project?.Customers?.find((customer) =>
            customer?.Email?.toLocaleLowerCase().includes(
              searchTerm?.toLowerCase()
            )
          ) ||
          project?.Customers?.find((customer) =>
            customer?.Phone?.toLocaleLowerCase().includes(
              searchTerm?.toLowerCase()
            )
          ) ||
          project?.Customers?.find((customer) =>
            customer?.CustomerName?.toLowerCase().includes(
              searchTerm?.toLowerCase()
            )
          )
      );

      setFilteredProjects(filter);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm, projects]);

  const handlePinChanged = (project) => {
    setPinLoader([...pinLoader, project.ID]);
    dispatch(updateProjectIsPinned(project.ID, !project.IsPinned)).then(
      async () => {
        await dispatch(
          setProjects(
            projects.map((p) => {
              if (p.ID === project.ID) return { ...p, IsPinned: !p.IsPinned };
              else return p;
            })
          )
        );
        setPinLoader((prev) => prev.filter((p) => p !== project.ID));
      }
    );
  };

  const goToAddProject = () => {
    dispatch(resetProject());
  };

  const filterProjects = () => {
    const selected = selectedStatus.map((item) => item.id);
    return filteredProjects
      .filter((project) => selected.indexOf(parseInt(project?.StatusID)) > -1)
      .sort((objA, objB) => new Date(objB.CreatedAt) - new Date(objA.CreatedAt))
      .sort((a, b) => Number(b.IsPinned) - Number(a.IsPinned));
  };

  function onSelectStatus(selectedList, selectedItem) {
    setSelectedStatus(selectedList);
  }

  return (
    <div className="home">
      <Container>
        <div className="d-flex title-container">
          <div id="home-title">Projects</div>
          <Link onClick={goToAddProject} to="/project" className="link-btn">
            + Add Project
          </Link>
        </div>
        <div className="d-flex project-tabs flex-wrap">
          <div className="d-flex align-items-center">
            <Multiselect
              showCheckbox={true}
              placeholder="Select Status"
              hidePlaceholder={true}
              options={ProjectStatus.filter((item) => item.id !== -1)} // Options to display in the dropdown
              selectedValues={selectedStatus} // Preselected value to persist in dropdown
              onSelect={onSelectStatus} // Function will trigger on select event
              onRemove={onSelectStatus} // Function will trigger on remove event
              displayValue="text" // Property name to display in the dropdown options
            />
            {/* <div className="ml-4 pointer d-flex align-items-center">
              <div className="d-flex mr-2 align-items-center">
                {" "}
                Show pinned{" "}
                <i
                  class={`fa fa-thumb-tack text-2xl mx-2 ${
                    showPinnedProjects ? "text-danger" : ""
                  }`}
                  aria-hidden="true"
                ></i>{" "}
                projects
              </div>{" "}
              <Form.Check
                type="checkbox"
                checked={showPinnedProjects}
                onChange={() => {
                  setShowPinnedProjects(!showPinnedProjects);
                }}
              />
            </div> */}
          </div>
          <div className="d-flex search-bar">
            {/* <Form inline > */}
            <FormControl
              className="search-container"
              placeholder="Search"
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* </Form> */}
          </div>
        </div>

        {!isLoading && (
          <div className="d-flex justify-content-between cards-container">
            <div className="d-flex flex-wrap cards">
              {filterProjects()?.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  history={history}
                  handlePinChanged={() => handlePinChanged(project)}
                  pinLoader={pinLoader}
                  setGoToProjectLoader={setGoToProjectLoader}
                />
              ))}
            </div>
            <MarketingBlock />
          </div>
        )}
      </Container>

      {isLoading && (
        <div className="spinner d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {goToProjectLoader && (
        <div
          style={{
            zIndex: 9999999,
            position: "fixed",
            background: "rgba(0,0,0,0.6)",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div
            className="h-100 w-100 spinner d-flex justify-content-center "
            style={{
              zIndex: 9999999,
              position: "fixed",
              top: "25%",
            }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
