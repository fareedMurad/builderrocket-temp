import React, { useEffect, useRef, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  setSelectedProductTab,
} from "../../actions/productActions";
import {
  handleAddProductForProject,
  handleProductForProject,
  setSelectedProject,
} from "../../actions/projectActions";
import "./ProductDetail.scss";
import { useHistory } from "react-router";
import AddProductConfirmationModal from "../AddProductConfirmationModal/AddProductConfirmationModal";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const product = useSelector((state) => state.product.product);
  const project = useSelector((state) => state.project.project);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);
  const productDetail = useSelector((state) => state.product.productDetail);
  const ProductSelectedRoom = useSelector(
    (state) => state.room.ProductSelectedRoom
  );
  const [isLoading, setIsLoading] = useState(true);
  const [addProductModal, setAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addActionLoading, setAddActionLoading] = useState(false);

  const productDetailRef = useRef();

  useEffect(() => {
    productDetailRef.current = productDetail;
  }, [productDetail]);

  useEffect(() => {
    dispatch(getProductDetails(productDetailRef.current?.ID))
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [dispatch]);

  const handleNavigation = (selectedTab) => {
    history.push(`/project/${project.ProjectNumber}/product/${selectedTab}`);
  };

  const addProduct = (values) => {
    if (!product.ID || !ProductSelectedRoom.length) return;

    setAddActionLoading(true);
    let newProduct = {
      ProjectID: project.ID,
      ProjectRoomID: [...values?.roomIDs],
      ProductID: productDetail.ID,
      Quantity: 0,
      VendorID: 0,
      IsApproved: false,
      RequiresApproval: values?.RequiresApproval,
      DefaultRoomProductID: 0,
      RoughInTrimOut: values.RoughInTrimOutEnum === "RoughIn" ? 1 : 2,
      Notes: "",
    };
    dispatch(handleAddProductForProject(newProduct)).then((project) => {
      dispatch(setSelectedProject(project));
      setAddProductModal(false);
      setAddActionLoading(false);
    });
  };

  return (
    <div className="product-detail">
      {/* <div className="d-flex title">
        <div>
          <Button
            variant="link"
            className="link-btn"
            onClick={() => handleNavigation("products")}
          >
            Products /
          </Button>
        </div>
        <div>
          <Button
            variant="link"
            className="link-btn"
            onClick={() => handleNavigation("addProduct")}
          >
            Add Product /
          </Button>
        </div>
        <div>
          <Button
            variant="link"
            className="link-btn bg-transparent"
            // onClick={() => handleShow(false)}
            disabled
          >
            Product Details
          </Button>
        </div>
      </div> */}

      {isLoading ? (
        <div className="spinner d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="d-flex justify-content-between details-container">
          <div className="details-image">
            <img alt="product details" src={productDetail?.ThumbnailURL} />
          </div>
          <div className="details">
            <div className="d-flex justify-content-between">
              <div>
                <div className="details-title">
                  {productDetail?.ProductName}
                </div>
                <div className="description">
                  {productDetail?.ShortDescription}
                </div>
              </div>
              {addActionLoading ? (
                <Spinner size="sm" animation="border" variant="primary" />
              ) : (
                <button
                  className="add-button"
                  onClick={() => {
                    setSelectedProduct(product);
                    setAddProductModal(true);
                  }}
                >
                  Add to Project
                </button>
              )}
            </div>
            <div className="mt-5 d-flex justify-content-between">
              <div className="sub-details">
                <div>Item #</div>
                <div>Model #{productDetail?.ModelNumber}</div>
              </div>
              <div>
                ${productDetail?.MSRP} {productDetail?.UnitOfSale}
              </div>
            </div>
          </div>
        </div>
      )}

      <AddProductConfirmationModal
        show={addProductModal}
        handleClose={() => setAddProductModal(false)}
        isShowRooms
        handleAdd={(values) => addProduct(values)}
      />
    </div>
  );
};

export default ProductDetail;
