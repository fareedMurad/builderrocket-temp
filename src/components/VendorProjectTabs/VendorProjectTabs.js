import React, { useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getDocuments,
} from "../../actions/customerActions";
import "./VendorProjectTabs.scss";

// components
import VendorAddProducts from "../VendorAddProducts";
import CustomerDocuments from "../CustomerDocuments/CustomerDocuments";
import { setSelectedProjectTab } from "../../actions/vendorActions";

const VendorProjectTabs = (props) => {
  const dispatch = useDispatch();

  const selectedProjectTab = useSelector(
    (state) => state.vendor?.selectedProjectTab
  );

  const handleSelectedTab = (tab) => {
    dispatch(setSelectedProjectTab(tab));
  };

  return (
    <div className="project-tabs">
      <Tabs
        activeKey={selectedProjectTab}
        onSelect={(tab) => handleSelectedTab(tab)}
        transition={false}
      >
        {/* <Tab eventKey="projectInformation" title="Project Information">
          {selectedProjectTab === "projectInformation" && (
            <CustomerProjectInformation />
          )}
        </Tab> */}
        {/* <Tab eventKey="products" title="Products">
          {selectedProjectTab === "products" && <CustomerDocuments />}
        </Tab> */}
        <Tab eventKey="products" title="Products">
          {selectedProjectTab === "products" && <VendorAddProducts />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default VendorProjectTabs;
