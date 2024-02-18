import React from "react";
import { Form } from "react-bootstrap";
import "./Select.scss";

const Select = (props) => {
  const { label, options } = props;

  return (
    <div className="select">
      <Form.Label className="input-label">{label}</Form.Label>
      <Form.Control as="select">
        {options?.map((option) => (
          <option>{option}</option>
        ))}
      </Form.Control>
    </div>
  );
};

export default Select;
