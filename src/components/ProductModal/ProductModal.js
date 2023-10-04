import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getRoomTypes } from "../../actions/roomActions";
import {
  handleProductForProject,
  setSelectedProject,
} from "../../actions/projectActions";
import {
  getProductDetails,
  replaceProductService,
} from "../../actions/productActions";
import { isEmpty } from "lodash";
import "./ProductModal.scss";
import Utils from "../../utils";
import CustomLightbox from "../Lightbox";

const ProductModal = (props) => {
  const { show, handleClose, handleCloseModal } = props;

  const dispatch = useDispatch();

  const product = useSelector((state) => state.product.replaceOldProduct);
  const project = useSelector((state) => state.project.project);
  const replaceProduct = useSelector((state) => state.product.replaceProduct);
  const replaceProductRooms = useSelector(
    (state) => state.product.replaceProductRooms
  );
  const roomTypes = useSelector((state) => state.room.roomTypes);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);
  const productDetails = useSelector(
    (state) => state.product.replaceOldProductDetails
  );

  const [roomList, setRoomList] = useState([selectedRoom?.ID]);
  const [isAllRoomsSelected, setIsAllRoomsSelected] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEmpty(roomTypes)) dispatch(getRoomTypes());
  }, [dispatch, roomTypes]);

  const handleCheckBox = async (roomID, selectAll) => {
    if (selectAll === "SELECT_ALL") {
      const arr = [];
      await getFilteredRooms()?.map((item) => {
        item.Items?.map((room) => {
          arr.push(room.ID);
        });
      });
      setIsAllRoomsSelected(true);
      return setRoomList(arr);
    } else if (selectAll === "DESELECT_ALL") {
      setIsAllRoomsSelected(false);
      return setRoomList([selectedRoom?.ID]);
    }

    if (!roomID) return;

    if (roomList?.includes(roomID)) {
      setRoomList((prevs) => prevs.filter((ID) => ID !== roomID));
    } else {
      setRoomList([...roomList, roomID]);
    }
  };

  const addToRooms = () => {
    if (roomList.length === 0) return;
    setLoading(true);
    dispatch(
      replaceProductService(project?.ID, {
        OldProductID: productDetails?.ID,
        NewProductID: replaceProduct?.ID,
        ProjectRoomIDs: roomList,
      })
    )
      .then((project) => {
        if (project) dispatch(setSelectedProject(project));
        handleCloseModal();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getFilteredRooms = () => {
    return (
      mergeDuplicatesAsArray(
        project?.ProjectRooms,
        "RoomTypeID",
        replaceProductRooms,
        selectedRoom?.ID
      ) || []
    );
  };

  return (
    <Modal size="lg" show={show} className="product-modal">
      <div className="header-container">
        <div className="product-modal-header">
          You are currently in the {selectedRoom?.RoomName}
        </div>

        <div className="product-details">
          <div className="product-details-header">
            Are you sure you want to replace:
          </div>

          <div className="d-flex">
            {Utils.getProductImages(productDetails)?.length ? (
              <CustomLightbox images={Utils.getProductImages(productDetails)} />
            ) : null}

            <div className="product-details-text">
              <div className="mb-2">{productDetails?.ShortDescription}</div>
              Model: {productDetails?.ModelNumber}
              <span className="ml-md-5">
                Part: {productDetails?.ProductNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-modal-body">
        <div className="replce-product-header-container">
          <div className="product-details">
            <div className="product-details-header">With this:</div>

            <div className="d-flex">
              {Utils.getProductImages(replaceProduct)?.length ? (
                <CustomLightbox
                  images={Utils.getProductImages(replaceProduct)}
                />
              ) : null}

              <div className="product-details-text">
                <div className="mb-2">{replaceProduct?.ShortDescription}</div>
                Model: {replaceProduct?.ModelNumber}
                <span className="ml-md-5">
                  Part: {replaceProduct?.ProductNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
        {getFilteredRooms()?.length ? (
          <>
            <div className="body-header">
              This item is currently assigned to the following rooms. Would you
              like to replace to these rooms as well?{" "}
              <Button
                variant="link"
                size="sm"
                className="d-inline py-0"
                style={{fontSize: '12px'}}
                onClick={() =>
                  handleCheckBox(
                    null,
                    isAllRoomsSelected ? "DESELECT_ALL" : "SELECT_ALL"
                  )
                }
              >
                {isAllRoomsSelected ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <div className="rooms d-flex flex-wrap justify-content-around">
              {getFilteredRooms()?.map((roomType, index) => (
                <div key={index} className="room-type-container">
                  <div className="room-type">{roomType?.Name}</div>

                  {roomType?.Items?.map((room, index) => (
                    <div key={index} className="room-name">
                      <Form.Check
                        type="checkbox"
                        checked={roomList?.includes(room.ID)}
                        onChange={() => handleCheckBox(room?.ID)}
                        label={`${room?.Name}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : null}

        <div className="d-flex justify-content-center mt-3">
          {loading ? (
            <Spinner animation="border" variant="primary" size="sm" />
          ) : (
            <>
              <Button
                variant="link"
                className="cancel"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                className="primary-gray-btn next-btn ml-3"
                onClick={addToRooms}
              >
                Replace to Room{roomList?.length > 1 ? "s" : ""}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;

function mergeDuplicatesAsArray(array, key, roomIDs, mainRoomID) {
  const mergedArray = [];
  const map = new Map();

  for (const obj of array) {
    const keyValue = obj[key];

    if (map.has(keyValue)) {
      const existingObj = map.get(keyValue);
      existingObj.Items.push({
        ID: obj.ID,
        Name: obj.RoomName,
      }); // Add object to the existing array
    } else {
      map.set(keyValue, {
        ID: keyValue,
        Name: obj.RoomTypeName,
        Items: [
          {
            ID: obj.ID,
            Name: obj.RoomName,
          },
        ],
      });
    }
  }

  return Array.from(map.values())
    .map((rr) => {
      return {
        ...rr,
        Items: rr?.Items?.map((rrr) => {
          if (roomIDs.includes(rrr.ID)) {
            return rrr;
          }
        }).filter((rr) => rr && rr.ID !== mainRoomID),
      };
    })
    .filter((rr) => rr && rr.Items.length);
}
