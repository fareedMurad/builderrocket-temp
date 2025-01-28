import React from "react";
import FieldLoader from "../ProjectFieldLoader";
import { Form } from "react-bootstrap";

export default function InputField({
  label,
  value,
  onChange,
  onBlur,
  loading,
  as,
  ...props
}) {
  return (
    <>
      <Form.Label className="input-label">
        <span>{label}</span> <FieldLoader loading={loading} />
      </Form.Label>
      <Form.Control
        as={as ? as : "input"}
        className="input-gray"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
    </>
  );
}
