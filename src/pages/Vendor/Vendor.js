import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import {
  setSelectedProjectTab,
} from "../../actions/vendorActions";
import "./Vendor.scss";
import VendorProjectTabs from "../../components/VendorProjectTabs";

const Vendor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedProjectTab('products'));
  }, []);

  return (
    <>
      <VendorProjectTabs />
    </>
  );
};

export default Vendor;
