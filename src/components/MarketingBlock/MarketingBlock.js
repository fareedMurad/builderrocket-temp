import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogos } from "../../actions/projectActions.js";
import "./MarketingBlock.scss";

const MarketingBlock = () => {
  const dispatch = useDispatch();
  const logos = useSelector((state) => state.project.logos);
  const [fadeProp, setFadeProp] = useState({ fade: "fade-in " });
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fadeProp.fade === "fade-in") {
        setFadeProp({
          fade: "fade-out",
        });
      }
      dispatch(getLogos());
    }, 60000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fadeProp.fade === "fade-out") {
        setFadeProp({
          fade: "fade-in",
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [fadeProp]);

  return (
    <div className="marketing-block">
      {logos?.map((logo, index) => (
        <div
          className={`marketing-block-body justify-content-center ${fadeProp.fade}`}
        >
          <img src={logo} className="img-fluid img-thumbnail fitcontent" />
        </div>
      ))}
    </div>
  );
};

export default MarketingBlock;
