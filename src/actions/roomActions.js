import api from "../api";
import {
  GET_ROOMS,
  GET_ROOM_TYPES,
  SET_SELECTED_ROOM,
  LOGOUT,
  CREATE_ROOM_TYPES,
  CREATE_ROOM,
} from "./types";

export const getRooms = () => (dispatch) => {
  const URL = "/Room";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_ROOMS, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting Rooms", error);
    });
};

export const getRoomTypes = () => (dispatch) => {
  const URL = "/RoomType";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_ROOM_TYPES, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting Rooms", error);
    });
};
export const getBuilderRoomTypes = () => (dispatch) => {
  const URL = "/builder/getroomtypes";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting Rooms", error);
    });
};

export const getBuilderRoomGroups = () => (dispatch) => {
  const URL = "/builder/adddefaultroomgroup";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });

      console.log("Getting Rooms", error);
    });
};
export const createRoomTypes = (roomtypes) => (dispatch) => {
  const URL = "/builder/createroomtype";
  return api({
    method: "POST",
    url: URL,
    data: roomtypes,
  })
    .then((response) => {
      if (response?.status === 200) {
        // dispatch({ type: CREATE_ROOM_TYPES, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const createRoomGroup = (name) => (dispatch) => {
  const URL = `/builder/adddefaultroomgroup?SourceName=${name}`;
  return api({
    method: "POST",
    url: URL
  })
    .then((response) => {
      if (response?.status === 200) {
        // dispatch({ type: CREATE_ROOM_TYPES, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const deleteRoomGroup = (id) => (dispatch) => {
  const URL = `/builder/adddefaultroomgroup/${id}`;
  return api({
    method: "DELETE",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        // dispatch({ type: CREATE_ROOM_TYPES, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const createRoom = (params) => (dispatch) => {
  const URL = "/builder/createroom";
  return api({
    method: "POST",
    url: URL,
    data: params,
  })
    .then((response) => {
      if (response?.status === 200) {
        // dispatch({ type: CREATE_ROOM, payload: response.data });

        return response.data;
      }
    })
    .catch((error) => {
      if (error.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const setSelectedRoom = (room) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: SET_SELECTED_ROOM, payload: room });

      resolve(room);
    } catch (error) {
      reject(error);
    }
  });
};
