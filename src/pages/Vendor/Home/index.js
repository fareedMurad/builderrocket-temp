import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Form, FormControl, Spinner } from "react-bootstrap";
import { getProjects } from "../../../actions/projectActions.js";
// import { getUserProfile } from '../../../actions/userActions.js';
import { Link } from "react-router-dom";
import "./Home.scss";

// components
import ProjectCard from "../../../components/ProjectCard";
import MarketingBlock from "../../../components/MarketingBlock";
// import Multiselect from "multiselect-react-dropdown";
// import {ProjectStatus} from "../../../utils/contants";

const Home = (props) => {
  const { history } = props;

  const dispatch = useDispatch();

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const projects = useSelector((state) => state.project.projects);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState(ProjectStatus.filter((item) => item.id === 1));
  const [projectsStatus, setProjectsStatus] = useState("Active");
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    if (isSignedIn) {
      setIsLoading(true);

      dispatch(getProjects())
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));

      // dispatch(getUserProfile());
    }
  }, [dispatch, isSignedIn]);

  useEffect(() => {
    /* Filter projects
        Filter delayed by 1 second */
    const timer = setTimeout(() => {
      const filter = projects?.filter(
        (project) =>
          project?.ProjectName?.toLowerCase().includes(
            searchTerm?.toLowerCase(),
          ) ||
          project?.UserFileName?.toLowerCase().includes(
            searchTerm?.toLowerCase(),
          ) ||
          project?.DocumentTypeName?.toLowerCase().includes(
            searchTerm?.toLowerCase(),
          ) ||
          project?.FileName?.toLowerCase().includes(
            searchTerm?.toLowerCase(),
          ) ||
          project?.MimeType?.toLowerCase().includes(searchTerm?.toLowerCase()),
      );

      setFilteredProjects(filter);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm, projects]);

  // const goToAddProject = () => {
  //     dispatch(resetProject());
  // }

  const filterProjects = () => {
    return filteredProjects;
    // const selected = selectedStatus.map((item) => item.id);
    // return filteredProjects.filter(project => selected.indexOf(parseInt(project?.StatusID)) > -1);
  };

  // function onSelectStatus(selectedList, selectedItem) {
  //     setSelectedStatus(selectedList);
  // }

  return (
    <div className="home">
      <Container>
        <div className="d-flex title-container">
          <div id="home-title">Projects</div>
          {/* <Link 
                        onClick={goToAddProject} 
                        to='/project' 
                        className='link-btn'
                    >
                        + Add Project
                    </Link> */}
        </div>
        <div className="d-flex project-tabs flex-wrap">
          {/* <div className='d-flex'>
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
                    </div> */}
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
                  isCustomer
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
    </div>
  );
};

export default Home;
