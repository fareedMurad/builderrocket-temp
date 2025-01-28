import React, { useEffect, useState, useRef } from "react";
import {
  setProduct,
  getCategories,
  setCategories,
  setProductDetail,
  setProducts,
} from "../../actions/productActions";
import { setSelectedProject } from "../../actions/projectActions";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./AddProduct.scss";
import { useHistory } from "react-router";

import AddProductConfirmationModal from "../AddProductConfirmationModal/AddProductConfirmationModal";
import { handleAddMyProductToProject } from "../../actions/myProductActions";
import AddProductsByCategory from "../AddProductsByCategory";
import {
  setSelectedBuilderCategory,
  setSelectedRoom,
} from "../../actions/roomActions";
import Select from "react-select";

const AddProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const product = useSelector((state) => state.product.product);
  const project = useSelector((state) => state.project.project);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);

  const [addActionLoading, setAddActionLoading] = useState();
  const [addProductModal, setAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [roomsOptions, setRoomsOptions] = useState([]);

  useEffect(() => {
    let options = [
      ...project?.BuilderProjectRooms?.map((b) => {
        return {
          ...b,
          label: b.RoomName,
          value: b.ID,
        };
      }),
    ];
    setRoomsOptions(options.sort((a, b) => a.name?.localeCompare(b.name)));
  }, [project]);

  const productRef = useRef();
  useEffect(() => {
    productRef.current = product;
  }, [product]);

  useEffect(() => {
    dispatch(setSelectedBuilderCategory({}));
    window.scrollTo(0, 0);

    return () => {
      dispatch(setCategories([]));
      dispatch(setProducts([]));
    };
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCategories()).then(() => {
      setIsLoading(false);
    });
  }, []);

  const addProduct = (values) => {
    const product = selectedProduct;
    if (!product.ID || !values.roomIDs?.length) return;

    setAddActionLoading(product);
    let newProduct = {
      ProjectID: project.ID,
      ProjectRoomID: [...values?.roomIDs],
      ProductID: product.ID,
      Quantity: 0,
      VendorID: 0,
      IsApproved: false,
      RequiresApproval: values?.RequiresApproval,
      DefaultRoomProductID: 0,
      RoughInTrimOut: values.RoughInTrimOutEnum === "RoughIn" ? 1 : 2,
      Notes: "",
    };
    dispatch(
      // ßProductForProject(newProduct)
      handleAddMyProductToProject(newProduct)
    ).then((project) => {
      dispatch(setSelectedProject(project));
      setAddProductModal(false);
      setAddActionLoading(null);
    });
  };

  const handleGoToProducts = () => {
    history.push(`/project/${project.ProjectNumber}/products`);
  };

  const handleRoomChange = (option) => {
    dispatch(setSelectedRoom(option));
  };

  const getExistingProducts = () => {
    const room = project.BuilderProjectRooms?.find(
      (r) => r.ID === selectedRoom.ID
    );
    return room.Items;
  };

  return (
    <div className="add-product-container pl-2 pr-2">
      <div className="d-flex pr-3">
        <div className="d-flex" style={{ flex: 1 }}>
          <div className="d-flex align">
            <Button
              variant="link"
              className="bg-transparent pr-0 mt-0 pt-0 outline-none"
              onClick={handleGoToProducts}
              style={{ outline: "none" }}
            >
              Products /
            </Button>
            <div className="page-title mr-2 font-black ">Add Products</div>
          </div>
        </div>
        <div className="d-flex align-items-center" style={{ flex: 1 }}>
          <span className="pr-2">Select Room: </span>
          <div style={{ width: "300px" }}>
            <Select
              value={{
                label: selectedRoom?.RoomName,
                value: selectedRoom.ID,
                ...selectedRoom,
              }}
              onChange={handleRoomChange}
              options={roomsOptions}
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="add-products-spinner d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <AddProductsByCategory
          existingProducts={getExistingProducts()}
          handleAdd={(product) => {
            setAddProductModal(true);
            setSelectedProduct(product);
          }}
        />
      )}
      <AddProductConfirmationModal
        show={addProductModal}
        handleClose={() => setAddProductModal(false)}
        isShowRooms
        handleAdd={(values) => addProduct(values)}
        loader={addActionLoading}
      />

      {/*<ColorProductModal
                show={showColorModal}
                handleClose={handleColorClose}
                handleCloseModal={() => setShowColorModal(false)}
            />*/}
    </div>
  );
};

export default AddProduct;
