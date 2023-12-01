import React, { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Products.scss";
import Multiselect from "multiselect-react-dropdown";
import { PRODUCT_SELECTED_ROOM } from "../../actions/types";

const SelectRooms = ({ setProductFilter, productFilter }) => {
  const dispatch = useDispatch();
  const roomCategoryRef = useRef(null);

  const project = useSelector((state) => state.project.project);
  const [roomsOptions, setRoomsOptions] = useState([]);

  const [roomsDropdownLoading, setRoomsDropdownLoading] = useState(true);
  const [showSelectedRooms, setShowSelectedRooms] = useState(false);
  const [searchableField, setSearchableField] = useState("");
  const handleSelectedRoom = useCallback(
    (selectedRooms) => {
      const rooms = [...selectedRooms.map((b) => b.ID)];

      setProductFilter({ ...productFilter, rooms: rooms, pageNumber: 1 });
      dispatch({ type: PRODUCT_SELECTED_ROOM, payload: rooms });
    },
    [dispatch, productFilter]
  );

  useEffect(() => {
    setRoomsDropdownLoading(true);
    let options = [
      {
        name: "Select All",
        value: "select_all",
        selected: true,
      },
      ...project.BuilderProjectRooms?.map((b) => {
        return {
          ...b,
          name: b.RoomName,
          value: b.ID,
        };
      }),
    ];
    handleSelectedRoom(options.filter((p) => p.value !== "select_all"));
    setRoomsOptions(options);

    setRoomsDropdownLoading(false);
  }, [project]);

  useEffect(() => {
    if (roomCategoryRef?.current) {
      roomCategoryRef?.current?.searchBox?.current?.addEventListener(
        "blur",
        () => {
          setSearchableField({ ...searchableField, room: "" });
        }
      );
    }
  }, [roomCategoryRef?.current]);

  return (
    <div className="d-flex products" style={{flex: 1}}>
      <div className="products-container">
        <div className="ml-3">
          {roomsDropdownLoading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <div className="input-label mt-2 ml-3 mb-2 d-flex justify-content-between align-items-center">
                Selected Rooms
                <div
                  className="pointer text-primary"
                  onClick={() => setShowSelectedRooms(!showSelectedRooms)}
                >
                  {showSelectedRooms
                    ? "Hide Selected Rooms"
                    : "Visible Selected Rooms"}
                </div>
              </div>
              <div className="mx-2 position-relative">
                <span>
                  {roomsOptions?.find((r) => r.value === "select_all")
                    ?.selected || !showSelectedRooms
                    ? DrawDropdownSelection({
                        items: project.BuilderProjectRooms,
                        selectedIds: productFilter?.rooms,
                        nameProp: "Name",
                        styles: {
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                        },
                        searchableField,
                      })
                    : null}
                </span>
                <Multiselect
                  ref={roomCategoryRef}
                  onSearch={(value) =>
                    setSearchableField({
                      ...searchableField,
                      room: Boolean(value),
                    })
                  }
                  tags
                  showArrow
                  className="tags-dropdown readonly_ms"
                  // disable={true}
                  placeholder=""
                  showCheckbox={true}
                  keepSearchTerm={true}
                  hidePlaceholder={true}
                  hideSelectedList={
                    roomsOptions?.find((r) => r.value === "select_all")
                      ?.selected && !showSelectedRooms
                  }
                  options={roomsOptions} // Options to display in the dropdown
                  selectedValues={
                    !productFilter?.rooms
                      ? []
                      : project.BuilderProjectRooms?.length ===
                        productFilter?.rooms?.length
                      ? roomsOptions
                      : roomsOptions.filter(
                          (b) => productFilter?.rooms.indexOf(b.ID) > -1
                        )
                  }
                  displayValue="name" // Property name to display in the dropdown options
                  onSelect={(arr, current) => {
                    if (current.value === "select_all") {
                      handleSelectedRoom(
                        roomsOptions.filter((p) => p.value !== "select_all")
                      );
                      setRoomsOptions(
                        roomsOptions.map((r) =>
                          r.value === "select_all"
                            ? { ...r, selected: !r.selected }
                            : r
                        )
                      );
                    } else {
                      handleSelectedRoom(
                        arr.sort((a, b) =>
                          a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                        )
                      );
                    }
                  }}
                  onRemove={(arr, target) => {
                    let rooms = arr
                      .filter((p) => p.value !== "select_all")
                      .sort((a, b) =>
                        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                      );
                    if (target.value === "select_all") {
                      rooms = [];
                      setRoomsOptions(
                        roomsOptions.map((r) =>
                          r.value === "select_all"
                            ? { ...r, selected: false }
                            : r
                        )
                      );
                    }
                    handleSelectedRoom(rooms);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRooms;

export const DrawDropdownSelection = ({
  items,
  selectedIds,
  nameProp,
  styles = {},
  searchableField,
}) => {
  if (searchableField.room) {
    return "";
  }
  const selectedLength = selectedIds?.length;
  let name = `No Rooms selected`;
  if (selectedLength === 1) {
    let item = items?.filter((p) => selectedIds.indexOf(p.ID) > -1)[0];
    name = item ? item[nameProp] : null;
  } else if (selectedLength > 1 && selectedLength < items.length) {
    name = `Multiple Rooms`;
  } else if (items?.length === selectedLength) {
    name = `All Rooms`;
  }

  return (
    <span className="custom-placeholder" style={styles}>
      {name?.replaceAll("&nbsp;", "")?.trim()}
    </span>
  );
};
