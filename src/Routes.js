import React, { Suspense, lazy, useEffect } from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { SET_CUSTOMER_PROJECT } from "./actions/types";
import ScrollToTop from "./components/ScrollToTop";
import RoomsManagement from "./pages/RoomsManagemant";
import Subdivisions from "./pages/Subdivisions/Subdivisions";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Project = lazy(() => import("./pages/Project"));
const UtilityManagement = lazy(() => import("./pages/UtilityManagement"));
const MyProductsManagement = lazy(() => import("./pages/MyProducts"));
const ContractorManagement = lazy(() => import("./pages/ContractorManagement"));
const Customer = lazy(() => import("./pages/Customer"));
const Vendor = lazy(() => import("./pages/Vendor"));
const CustomerSignup = lazy(() => import("./pages/Customer/Signup"));
const CustomerLogin = lazy(() => import("./pages/Customer/Login"));
const VendorSignup = lazy(() => import("./pages/Vendor/Signup"));
const VendorLogin = lazy(() => import("./pages/Vendor/Login"));

const CustomerHome = lazy(() => import("./pages/Customer/Home"));

const Routes = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const getpath = history.location.pathname;
  const token = useSelector((state) => state.auth.token);
  const isCustomerSignedIn = useSelector((state) => state.customer?.isSignedIn);
  const isSignedIn = useSelector((state) => state.auth?.isSignedIn);
  const isVendorSignedIn = useSelector((state) => state.vendor?.isSignedIn);
  console.log(getpath);
  const path_array = getpath.split("/");
  console.log(path_array[1]);
  useEffect(() => {
    if (path_array[1] !== "customer" && path_array[1] !== "vendor") {
      if (!token) history.push("/login");
    } else {
      dispatch({ type: SET_CUSTOMER_PROJECT, payload: path_array[2] });
    }
  });

  const Loading = () => {
    return (
      <div
        style={{ marginTop: "15rem" }}
        className="d-flex justify-content-center"
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  };

  return (
    <Suspense fallback={<Loading />}>
      <ScrollToTop>
        <Switch>
          {isCustomerSignedIn && (
            <>
              {/* <Route path="/" exact component={CustomerHome} /> */}
              <Route path="/customer/project/:tab" component={Customer} />
              <Redirect to="/customer/project/documents" />
            </>
          )}
          {isVendorSignedIn && (
            <>
              {/* <Route path="/" exact component={CustomerHome} /> */}
              <Route path="/vendor/project/:tab" component={Vendor} />
              <Redirect to="/vendor/project/products" />
            </>
          )}
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/customer/login" component={CustomerLogin} />
          <Route path="/customer/signup/:id" component={CustomerSignup} />
          <Route path="/vendor/login" component={VendorLogin} />
          <Route path="/vendor/signup" component={VendorSignup} />
          {isSignedIn && !isCustomerSignedIn && (
            <>
              <Route exact path="/project" component={Project} />
              <Route path="/project/:project/:tab" component={Project} />
              <Route path="/rooms-management/:tab" component={RoomsManagement} />
              <Route path="/utility-management" component={UtilityManagement} />
              <Route path="/my-products-management" component={MyProductsManagement} />
              <Route path="/subdivision-management" component={Subdivisions} />
              <Route
                path="/contractor-management"
                component={ContractorManagement}
              />
              {/* <Redirect to="/" /> */}
            </>
          )}
        </Switch>
      </ScrollToTop>
    </Suspense>
  );
};

export default Routes;
