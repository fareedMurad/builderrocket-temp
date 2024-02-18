import React, { useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getDocuments,
  setSelectedProjectTab,
} from "../../actions/customerActions";
import "./CustomerProjectTabs.scss";

// components
import CustomerProducts from "../CustomerProducts";
import CustomerDocuments from "../CustomerDocuments/CustomerDocuments";
// import AddProduct from "../AddProduct";
// import ProductDetail from "../ProductDetail";
// import CustomerProjectInformation from "../CustomerProjectInformation";

const CustomerProjectTabs = (props) => {
  const dispatch = useDispatch();

  const selectedProjectTab = useSelector(
    (state) => state.customer?.selectedProjectTab,
  );
  //   const selectedProductTab = useSelector(
  //     (state) => state.product.selectedProductTab
  //   );

  useEffect(() => {
    dispatch(getDocuments());
  }, []);

  const handleSelectedTab = (tab) => {
    dispatch(setSelectedProjectTab(tab));
  };

  //   const handleProductsTabs = () => {
  //     switch (selectedProductTab) {
  //       case "products":
  //         return <CustomerProducts />;
  //       case "productDetail":
  //         return <ProductDetail />;
  //       default:
  //         return <CustomerProducts />;
  //     }
  //   };

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
        <Tab eventKey="documents" title="Documents">
          {selectedProjectTab === "documents" && <CustomerDocuments />}
        </Tab>
        <Tab eventKey="products" title="Products">
          {selectedProjectTab === "products" && <CustomerProducts />}
        </Tab>
      </Tabs>
    </div>
  );
};

export default CustomerProjectTabs;
