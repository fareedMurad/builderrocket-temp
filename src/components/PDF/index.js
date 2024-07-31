import * as React from "react";
import ReactToPrint from "react-to-print";
import { Button } from "react-bootstrap";

export const CustomPrinter = React.forwardRef((props, ref) => {
  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = React.useCallback(() => {
    props.handleAfterPrint?.();
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    props.handleBeforePrint?.();
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        resolve();
      }, 500);
    });
  }, []);

  React.useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current]);

  const reactToPrintContent = React.useCallback(() => {
    props.handleBeforePrint?.();
    return ref.current;
  }, [ref.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <Button variant="link" className="link-btn">
        <i className={props.icon}></i>
        {props.title}
      </Button>
    );
  }, []);

  return (
    <ReactToPrint
      copyStyles={true}
      content={reactToPrintContent}
      documentTitle="AwesomeFileName"
      onAfterPrint={handleAfterPrint}
      onBeforeGetContent={handleOnBeforeGetContent}
      onBeforePrint={handleBeforePrint}
      removeAfterPrint
      trigger={reactToPrintTrigger}
    />
  );
});
