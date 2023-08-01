import React, { useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './RoomsTabs.scss';

// components 
import RoomsTypes from '../RoomsTypes';
import { useState } from 'react';
import RoomGroups from '../RoomGroups';

const RoomsTabs = (props) => {

  const [selectedTab, setSelectedTab] = useState("")

  
  useEffect(() => {
    setSelectedTab("roomTypes")
}, [])

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab)
  }

  return (
    <div className="project-tabs">
      <Tabs
        activeKey={selectedTab}
        onSelect={(tab) => handleSelectedTab(tab)}
        transition={false}
      >
        <Tab eventKey="roomTypes" title="Room Types">
          {selectedTab === "roomTypes" && (
            <RoomsTypes />
          )}
        </Tab>
        <Tab eventKey="groups" title="Groups">
          {selectedTab === "groups" && <RoomGroups />}
        </Tab>
      </Tabs>
    </div>
  );
}

export default RoomsTabs;
