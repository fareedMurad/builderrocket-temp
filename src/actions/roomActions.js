import api from "../api";
import {
  GET_ROOMS,
  GET_ROOM_TYPES,
  SET_SELECTED_ROOM,
  LOGOUT,
  CREATE_ROOM_TYPES,
  CREATE_ROOM,
  GET_BUILDER_ROOM_GROUPS,
  GET_BUILDER_ROOM_GROUP_DETAILS,
  GET_BUILDER_ROOM_TYPES,
  GET_BUILDER_SELECTED_ROOM_TYPE,
  GET_BUILDER_SELECTED_ROOM_GROUP,
  GET_BUILDER_SELECTED_ROOM_CATEGORY,
  GET_BUILDER_SELECTED_ROOM_CATEGORY_PRODUCTS,
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
    });
};

export const getRoomTypes = () => (dispatch) => {
  const URL = "/builder/getstandardroomtypes";

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
        dispatch({ type: GET_BUILDER_ROOM_TYPES, payload: response.data });
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const getBuilderRoomGroups = () => (dispatch) => {
  const URL = "/builder/adddefaultroomgroupcount";

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch({ type: GET_BUILDER_ROOM_GROUPS, payload: response.data });
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const getBuilderRoomGroupDetails = (ID) => (dispatch) => {
  const URL = `/builder/adddefaultroomgroupdetail/${ID}`;

  return api({
    method: "GET",
    url: URL,
  })
    .then((response) => {
      if (response?.status === 200) {
        dispatch(setBuilderRoomGroupDetails(ID, response.data?.Result));
        return response.data;
      }
    })
    .catch((error) => {
      if (error?.response?.status === 401) dispatch({ type: LOGOUT });
    });
};

export const setBuilderRoomGroupDetails = (ID, data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = ID
        ? {
            selectedGroupCategories: data,
            groupId: ID,
          }
        : null;
      dispatch({
        type: GET_BUILDER_ROOM_GROUP_DETAILS,
        payload,
      });

      resolve(payload);
    } catch (error) {
      reject(error);
    }
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

export const renameRoomType = (params) => (dispatch) => {
  const URL = `/builder/renameroomtype`;
  return api({
    method: "POST",
    url: URL,
    data: params,
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

export const renameRoom = (params) => (dispatch) => {
  const URL = `/builder/renameroom`;
  return api({
    method: "POST",
    url: URL,
    data: params,
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

export const renameRoomGroup = (ID, SourceName) => (dispatch) => {
  const URL = `/builder/adddefaultroomgroup?ID=${ID}&SourceName=${SourceName}`;
  return api({
    method: "PUT",
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

export const assignGroupToRoom = (RoomID, DefaultRoomGroupID) => (dispatch) => {
  const URL = `/builder/assigndefaultgrouptoroom/${RoomID}/${DefaultRoomGroupID}`;
  return api({
    method: "PUT",
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

export const deleteRoomType = (id) => (dispatch) => {
  const URL = `/builder/removeroomtype/${id}`;
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

export const deleteRoom = (id) => (dispatch) => {
  const URL = `/builder/removeroom/${id}`;
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

export const deleteRoomGroupCategory =
  (GroupID, TemplateID, ProductID) => (dispatch) => {
    const URL = `/builder/adddefaultroomproduct/${GroupID}/${TemplateID}/${ProductID}`;
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

export const createRoomGroupCategory =
  (TemplateID, DefaultGroupId) => (dispatch) => {
    const URL = `/builder/adddefaultroomproductbydefaultgroupId/${TemplateID}/${DefaultGroupId}`;
    return api({
      method: "POST",
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

export const createRoomGroupCategoryProduct =
  (GroupID, TemplateID, ProductID) => (dispatch) => {
    const URL = `/builder/adddefaultroomproductbyproductid/${GroupID}/${TemplateID}/${ProductID}`;
    return api({
      method: "POST",
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

export const getRoomGroupCategoryProduct =
  (GroupID, CategoryID) => (dispatch) => {
    const URL = `/builder/defaultroomproduct/${GroupID}/${CategoryID}`;
    return api({
      method: "GET",
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

export const setSelectedBuilderCategory = (category) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: GET_BUILDER_SELECTED_ROOM_CATEGORY, payload: category });

      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};

export const setSelectedGroupCategoryProducts = (category) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({
        type: GET_BUILDER_SELECTED_ROOM_CATEGORY_PRODUCTS,
        payload: category,
      });

      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};

export const setSelectedBuilderRoomType = (roomType) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: GET_BUILDER_SELECTED_ROOM_TYPE, payload: roomType });

      resolve(roomType);
    } catch (error) {
      reject(error);
    }
  });
};

export const setSelectedBuilderRoomGroup = (roomGroup) => (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      dispatch({ type: GET_BUILDER_SELECTED_ROOM_GROUP, payload: roomGroup });

      resolve(roomGroup);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateDefaultRoomProduct =
  (groupId, categoryId, productID, value, field) => (dispatch) => {
    const URL = `/builder/updatedefaultroomproduct/${groupId}/${categoryId}/${productID}`;

    const data = [
      {
        op: "replace",
        path: `/${field}`,
        value: value,
      },
    ];

    return api({
      method: "PATCH",
      url: URL,
      data: data,
    })
      .then((response) => {
        if (response?.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) dispatch({ type: LOGOUT });
      });
  };
