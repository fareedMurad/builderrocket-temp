import React, { useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./VendorProjectTabs.scss";

// components
import VendorAddProducts from "../VendorAddProducts";
import VendorProducts from "../VendorProducts";
import { setSelectedProjectTab } from "../../actions/vendorActions";
import { useHistory } from "react-router-dom";

const VendorProjectTabs = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const selectedProjectTab = useSelector(
    (state) => state.vendor?.selectedProjectTab,
  );

  useEffect(() => {
    if (selectedProjectTab) {
      history.push(`/vendor/${selectedProjectTab}`);
    }
  }, [selectedProjectTab]);

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
        <Tab eventKey="products" title="Products">
          {selectedProjectTab === "products" && <VendorProducts />}
        </Tab>
        <Tab eventKey="addProducts" title="Manage Products">
          {selectedProjectTab === "addProducts" && <VendorAddProducts />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default VendorProjectTabs;
