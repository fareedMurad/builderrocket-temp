import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const appVersion =
    typeof process !== "undefined" && process.env
      ? "v" + process.env.REACT_APP_VERSION
      : "dev-version";

  return (
    <Navbar className="footer justify-content-center">
      <Nav>
        <Link className="footer-item" to="/">
          Copyright 2024: Builder Rocket LLC All Rights
        </Link>
        <Link className="footer-item" to="/">
          Social Media
        </Link>
        <Link className="footer-item" to="/">
          Contact Us
        </Link>
      </Nav>
      <span className="ml-auto text-white">{appVersion}</span>
    </Navbar>
  );
};

export default Footer;
