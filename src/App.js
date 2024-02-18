import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { Container } from "react-bootstrap";
import "./App.scss";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

// components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toaster from "react-hot-toast";

function App() {
  const [expandedNav, setExpandedNav] = useState(false);

  useEffect(() => {
    const resizeEvent = window.addEventListener("resize", () => {
      if (window.innerWidth >= 860) {
        setExpandedNav(false);
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
    </div>
  );
}

export default App;
