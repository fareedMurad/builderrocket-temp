import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  Image,
  OverlayTrigger,
  Popover,
  Container,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/authActions";
import { setSelectedProjectTab } from "../../actions/projectActions";
import "./Header.scss";

// components
import NavSubheader from "../NavSubheader";
import "react-bootstrap-accordion/dist/index.css";
import { Accordion } from "react-bootstrap-accordion";
import Logo from "../../assets/images/builder-rocket-logo.png";
import Megaphone from "../Megaphone";
const Header = ({ expanded, setExpanded }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const project = useSelector((state) => state.project.project);
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const customerPortal = useSelector((state) => state.customer.customerPortal);
  const selectedProjectTab = useSelector(
    (state) => state.project.selectedProjectTab,
  );
  const [showTabLinks, setShowTabLinks] = useState(false);
  const isCustomerSignedIn = useSelector((state) => state.customer?.isSignedIn);

  const [isopen, setIsOpen] = useState(false);
  const isVendorSignedIn = useSelector((state) => state.vendor?.isSignedIn);

  useEffect(() => {
    if (history?.location?.pathname?.includes?.("/project/")) {
      setShowTabLinks(true);
    } else {
      setShowTabLinks(false);
    }
  }, [location]);

  const handleSelectedTab = (tab) => {
    history.push(`/project/${project.ProjectNumber}/${tab}`);
  };

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      history.push("/login");
    });
  };

  const title = user?.FirstName
    ? `${user?.FirstName} ${user?.LastName}`
    : user?.Company;
  const popoverLeft = (
    <Popover title={title ? title : "sdf"} id="popover-trigger-focus">
      <Nav className="">
        {/* <Nav.Link className='item'>
                    {user?.AvatarURL ? (
                        <Image src={user?.AvatarURL} roundedCircle />
                    ) : (
                        <i className='far fa-user-circle'></i>
                    )}
                </Nav.Link> */}
        <Navbar.Text className="item user-name">{title}</Navbar.Text>
        <Nav.Link className="item">
          <i className="far fa-cog"></i>
          <span>Settings</span>
        </Nav.Link>
        <Nav.Link className="item" onClick={handleLogout}>
          <i className="far fa-sign-out-alt"></i>
          <span>Logout</span>
        </Nav.Link>
      </Nav>
    </Popover>
  );

  const handleRouteChange = (link) => {
    setExpanded(!expanded);
    history.push(link);
  };

  const tabs = [
    {
      url: "projectInformation",
      title: "Project Information",
      icon: "long-arrow-alt-right",
    },
    { url: "documents", title: "Documents", icon: "long-arrow-alt-right" },
    { url: "utilities", title: "Utilities", icon: "long-arrow-alt-right" },
    { url: "contractors", title: "Contractors", icon: "long-arrow-alt-right" },
    { url: "drawings", title: "Drawings", icon: "long-arrow-alt-right" },
    {
      url: "roomAreaLayout",
      title: "Room/Area Layout",
      icon: "long-arrow-alt-right",
    },
    { url: "products", title: "Products", icon: "long-arrow-alt-right" },
  ];

  return (
    <>
      <Navbar expand="lg" bg="dark" className="header" expanded={expanded}>
        {/* <Navbar collapseOnSelect expand='md'  */}
        <Navbar.Toggle
          aria-controls="nav-bar"
          onClick={() => setExpanded(!expanded)}
        />
        <Container className="nav-bar-subheader d-block d-lg-none">
          <Navbar.Collapse aria-controls="nav-bar">
            {isSignedIn && (
              <Nav className="mr-auto">
                <div
                  className="header-item"
                  onClick={() => handleRouteChange("/")}
                >
                  <i className="far fa-images fa-sm tab-icon"></i>
                  Projects
                </div>
                <div
                  className="header-item"
                  onClick={() => history.push("/rooms-management/room-types")}
                >
                  <i className="far fa-border-none fa-sm tab-icon"></i>
                  Rooms Management
                </div>
                <div
                  className="header-item"
                  onClick={() => history.push("/utility-management")}
                >
                  <i className="far fa-lightbulb fa-sm tab-icon"></i>
                  Utility Management
                </div>
                <div className="header-item">
                  <i className="far fa-bookmark fa-sm tab-icon"></i>
                  Vendor Management
                </div>
                <div
                  className="header-item"
                  onClick={() => history.push("/contractor-management")}
                >
                  <i className="far fa-user-hard-hat fa-sm tab-icon"></i>
                  Contractor Management
                </div>
                <div
                  className="header-item"
                  onClick={() => history.push("/subdivision-management")}
                >
                  <i className="far fa-house-day fa-sm tab-icon"></i>
                  Subdivision Management
                </div>
                <div
                  className="header-item"
                  onClick={() => history.push("/my-products-management")}
                >
                  <i className="fa fa-product-hunt fa-sm tab-icon"></i>
                  My Products
                </div>

                {showTabLinks && (
                  <div className="header-item tabs">
                    <Accordion
                      title={project?.ProjectName}
                      children={tabs.map((tab) => (
                        <div
                          key={`tab-${tab.url}`}
                          className={`header-item ${
                            tab.url === selectedProjectTab ? "active-link" : ""
                          }`}
                          onClick={() => handleSelectedTab(tab.url)}
                        >
                          <i
                            className={`far fa-${tab.icon} fa-sm tab-icon`}
                          ></i>
                          {tab.title}
                        </div>
                      ))}
                    />
                  </div>
                )}
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>

        {/* </Navbar> */}
        <Navbar.Brand href="/" className="brand">
          <img src={Logo} alt="builder rocket" height="45" width="100" />
        </Navbar.Brand>

        {isSignedIn && (
          <div className="profile-dropdown">
            <OverlayTrigger
              aria-controls="nav-bar"
              trigger="click"
              placement="bottom"
              overlay={popoverLeft}
            >
              {user?.AvatarURL ? (
                <Image
                  src={user?.AvatarURL}
                  roundedCircle
                  width={50}
                  height={50}
                />
              ) : (
                <i className="far fa-user-circle"></i>
              )}
            </OverlayTrigger>
          </div>
        )}
        <Navbar.Collapse className="justify-content-end nav-collapse d-none d-lg-block">
          <Nav>
            {isSignedIn && (
              <>
                <Nav.Link className="item">
                  {user?.AvatarURL ? (
                    <Image src={user?.AvatarURL} roundedCircle />
                  ) : (
                    <i className="far fa-user-circle"></i>
                  )}
                </Nav.Link>
                <Nav.Link className="item">
                  <i className="far fa-cog"></i>
                </Nav.Link>
                <Nav.Link className="item">
                  <i
                    className="far fa-bullhorn"
                    onClick={() => setIsOpen(true)}
                  ></i>
                </Nav.Link>
                {user?.FirstName ? (
                  <Navbar.Text className="item">
                    {user?.FirstName} {user?.LastName}
                  </Navbar.Text>
                ) : (
                  <Navbar.Text className="item">{user?.Company}</Navbar.Text>
                )}

                <Nav.Link className="item" onClick={handleLogout}>
                  <i className="far fa-sign-out-alt"></i>
                </Nav.Link>
              </>
            )}
            {!isSignedIn && (isCustomerSignedIn || isVendorSignedIn) && (
              <Nav.Link className="item" onClick={handleLogout}>
                <i className="far fa-sign-out-alt"></i>
              </Nav.Link>
            )}
            {!isSignedIn &&
              !isCustomerSignedIn &&
              !customerPortal &&
              !isVendorSignedIn && (
                <div className="d-flex gap-2">
                  <Button onClick={() => history.push("/signup")}>
                    Sign Up
                  </Button>
                  <Button onClick={() => history.push("/login")}>Login</Button>
                </div>
              )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {isSignedIn && !isCustomerSignedIn && <NavSubheader />}
      {isopen && (
        <Megaphone show={isopen} handleClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Header;
