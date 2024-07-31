import React, { useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import {
  getProjectByProjectID,
  setSelectedProjectTab,
} from "../../actions/projectActions";
import { setSelectedProductTab } from "../../actions/productActions";
import "./ProjectTabs.scss";

// components
import Drawings from "../Drawings";
import Products from "../Products";
import Documents from "../Documents";
import Utilities from "../Utilities";
import AddProduct from "../AddProduct";
import ReplaceProduct from "../ReplaceProduct";
import Contractors from "../Contractors";
import ProductDetail from "../ProductDetail";
import RoomAreaLayout from "../RoomAreaLayout";
import ProjectInformation from "../ProjectInformation";
import Reports from "../Reports";
import Photos from "../Photos";
import AddCustomProducts from "../AddCustomProducts/AddCustomProducts";

const ProjectTabs = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const selectedProjectTab = useSelector(
    (state) => state.project.selectedProjectTab
  );
  const selectedProductTab = useSelector(
    (state) => state.product.selectedProductTab
  );
  const project = useSelector((state) => state.project.project);

  useEffect(() => {
    let tabs = location.pathname.split("/");
    let tab = tabs[tabs.length - 1];
    if (tabs.length > 4) {
      dispatch(setSelectedProductTab(tab));
      dispatch(setSelectedProjectTab("products"));
    } else {
      dispatch(setSelectedProjectTab(tab));
      if (tab.includes("products")) {
        dispatch(setSelectedProductTab("products"));
      }
    }
  }, [location]);
  useEffect(() => {
    if (selectedProjectTab && project.ProjectNumber)
      handleSelectedTab(selectedProjectTab);
  }, [selectedProjectTab]);

  const handleSelectedTab = (tab) => {
    history.push(`/project/${project.ProjectNumber}/${tab}`);
  };

  const handleProductsTabs = () => {
    switch (selectedProductTab) {
      case "products":
        return <Products />;
      case "addProduct":
        return <AddProduct />;
      case "addCustomProducts":
        return <AddCustomProducts />;
      case "replaceProduct":
        return <ReplaceProduct />;
      case "productDetail":
        return <ProductDetail />;
      default:
        return <Products />;
    }
  };

  return (
    <div className="project-tabs">
      {project?.ID ? (
        <Tabs
          activeKey={selectedProjectTab}
          onSelect={(tab) => handleSelectedTab(tab)}
          transition={false}
        >
          <Tab eventKey="projectInformation" title="Project Information">
            {selectedProjectTab === "projectInformation" && (
              <ProjectInformation />
            )}
          </Tab>
          <Tab eventKey="documents" title="Documents" disabled={!project?.ID}>
            {selectedProjectTab === "documents" && <Documents />}
          </Tab>
          <Tab eventKey="utilities" title="Utilities" disabled={!project?.ID}>
            {selectedProjectTab === "utilities" && <Utilities />}
          </Tab>
          <Tab
            eventKey="contractors"
            title="Contractors"
            disabled={!project?.ID}
          >
            {selectedProjectTab === "contractors" && <Contractors />}
          </Tab>
          <Tab eventKey="drawings" title="Drawings" disabled={!project?.ID}>
            {selectedProjectTab === "drawings" && <Drawings />}
          </Tab>
          <Tab
            eventKey="roomAreaLayout"
            title="Room/Area Layout"
            disabled={!project?.ID}
          >
            {selectedProjectTab === "roomAreaLayout" && <RoomAreaLayout />}
          </Tab>
          <Tab eventKey="products" title="Products" disabled={!project?.ID}>
            {selectedProjectTab === "products" && handleProductsTabs()}
          </Tab>
          <Tab eventKey="reports" title="Reports">
            {selectedProjectTab === "reports" && <Reports />}
          </Tab>
          <Tab eventKey="photo" title="Photo">
            {selectedProjectTab === "photo" && <Photos />}
          </Tab>
        </Tabs>
      ) : (
        <ProjectInformation />
      )}
    </div>
  );
};

export default ProjectTabs;
