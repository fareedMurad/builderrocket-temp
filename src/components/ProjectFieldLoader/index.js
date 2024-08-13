import React from "react";
import { Spinner } from "react-bootstrap";

const FieldLoader = ({ loading }) =>
  loading ? (
    <span
      style={{
        display: "inline-flex",
        gap: "4px",
        alignItems: "center",
        paddingLeft: "4px",
      }}
    >
      <Spinner
        size="sm"
        variant="success"
        animation="border"
        style={{ width: "10px", height: "10px" }}
      />
      <small className="text-success" style={{ fontSize: "12px" }}>
        Saving
      </small>
    </span>
  ) : null;

export default FieldLoader;
