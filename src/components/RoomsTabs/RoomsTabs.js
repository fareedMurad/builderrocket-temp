import React, { useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './RoomsTabs.scss';

// components 
import RoomsTypes from '../RoomsTypes';
import { useState } from 'react';
import RoomGroups from '../RoomGroups';
import { getCategories } from '../../actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import RoomGroupDetails from '../RoomGroupDetails';

const RoomsTabs = (props) => {

  const [selectedTab, setSelectedTab] = useState("");
  const history = useHistory();
  const location = useLocation();
  const builderSelectedRoomGroup = useSelector((state) => state.builderRooms.builderSelectedRoomGroup);

  const dispatch = useDispatch();

  useEffect(() => {
    let tabs = location.pathname.split('/');
    let tab = tabs[tabs.length - 1]
    setSelectedTab(tab);
}, [location])

  useEffect(() => {
    dispatch(getCategories());
  }, [])

  useEffect(() => {
    if(selectedTab) {
      history.push(`/rooms-management/${selectedTab}`)
    }
  }, [selectedTab])

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
        <Tab eventKey="groupDetails" title="Manage Products" disabled={!builderSelectedRoomGroup}>
          {selectedTab === "groupDetails" && <RoomGroupDetails />}
        </Tab>
      </Tabs>
    </div>
  );
}

export default RoomsTabs;
