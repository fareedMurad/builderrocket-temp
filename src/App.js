import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { Container } from "react-bootstrap";
import "./App.scss";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

// components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toaster from "react-hot-toast";
import ScrollToTop from "react-scroll-to-top";
import { getUserProfile } from "./actions/userActions";
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router";
import { logout } from "./actions/authActions";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [expandedNav, setExpandedNav] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const resizeEvent = window.addEventListener("resize", () => {
      if (window.innerWidth >= 860) {
        setExpandedNav(false);
      }
    });

    if (token)
      dispatch(getUserProfile()).then((response) => {
        if (!response) {
          dispatch(logout()).then(() => {
            history.push("/login");
          });
        }
      });

    return () => {
      window.removeEventListener("resize", resizeEvent);
    };
  }, []);

  return (
    <div className="h-screen d-flex flex-column justify-content-between">
      <Header expanded={expandedNav} setExpanded={setExpandedNav} />
      <Container className={`routes-container ${expandedNav ? "blur" : ""}`}>
        <Routes />
      </Container>
      <Footer />

      <ScrollToTop smooth color="#282c34" />
    </div>
  );
}

export default App;
