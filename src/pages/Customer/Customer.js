import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import {
  getProjectByProjectID,
  setSelectedProjectTab,
} from "../../actions/customerActions";
import "./Customer.scss";
import CustomerProjectHeader from "../../components/CustomerProjectHeader";
import CustomerProjectTabs from "../../components/CustomerProjectTabs";

const Customer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedProjectTab("documents"));
  }, []);

  return (
    <>
      {/* <CustomerProjectHeader /> */}
      <CustomerProjectTabs />
    </>
  );
};

export default Customer;
