import React, { useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "./RoomsTabs.scss";

// components
import RoomsTypes from "../RoomsTypes";
import { useState } from "react";
import RoomGroups from "../RoomGroups";
import { getCategories } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import RoomGroupDetails from "../RoomGroupDetails";
import { setBuilderRoomGroupDetails } from "../../actions/roomActions";

const RoomsTabs = (props) => {
  const [selectedTab, setSelectedTab] = useState("");
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    let tabs = location.pathname.split("/");
    let tab = tabs[tabs.length - 1];
    setSelectedTab(tab);
  }, [location]);

  useEffect(() => {
    dispatch(getCategories());

    return () => {
      dispatch(setBuilderRoomGroupDetails());
    };
  }, []);

  useEffect(() => {
    if (selectedTab) {
      history.push(`/rooms-management/${selectedTab}`);
    }
  }, [selectedTab]);

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="project-tabs">
      <Tabs
        activeKey={selectedTab}
        onSelect={(tab) => handleSelectedTab(tab)}
        transition={false}
      >
        <Tab eventKey="room-types" title="Room Types">
          {selectedTab === "room-types" && <RoomsTypes />}
        </Tab>
        <Tab eventKey="templates" title="Templates">
          {selectedTab === "templates" && <RoomGroups />}
        </Tab>
        {/* <Tab eventKey="template-details" title="Template Details">
          {selectedTab === "template-details" && <RoomGroupDetails />}
        </Tab> */}
      </Tabs>
    </div>
  );
};

export default RoomsTabs;
