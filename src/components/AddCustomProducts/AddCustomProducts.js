import React, { useEffect, useState, useRef } from "react";
import { setProductDetail } from "../../actions/productActions";
import { handleAddMyProductToProject } from "../../actions/myProductActions";
import { Button, Form, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../assets/images/img-placeholder.png";
import "./AddCustomProducts.scss";
import { useHistory } from "react-router";

import CustomLightbox from "../Lightbox";

import { getMyProducts } from "../../actions/myProductActions";
import ProjectPlaceholder from "../../assets/images/img-placeholder.png";
import AddProductConfirmationModal from "../AddProductConfirmationModal/AddProductConfirmationModal";

const AddCustomProducts = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const products = useSelector((state) => state.myProduct.myProducts);
  const project = useSelector((state) => state.project.project);
  const [addActionLoading, setAddActionLoading] = useState();
  const [addProductModal, setAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const ProductSelectedRoom = useSelector(
    (state) => state.room.ProductSelectedRoom
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getMyProducts()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

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
      IsApproved: product?.StatusID === 1,
      RequiresApproval: values.RequiresApproval,
      DefaultRoomProductID: 0,
      RoughInTrimOut: values.RoughInTrimOutEnum === "RoughIn" ? 1 : 2,
      Notes: "",
    };

    dispatch(handleAddMyProductToProject(newProduct)).then(() => {
      setAddProductModal(false);
      setAddActionLoading(null);
      //   history.push(`/project/${project.ProjectNumber}/products`)
    });
  };

  const handleSelectedProductDetails = (productDetail) => {
    // dispatch(setProductDetail(productDetail)).then(() => {
    //   //setShowColorModal(true);
    //   history.push(`/project/${project.ProjectNumber}/product/productDetail`);
    // });
  };

  const handleGoToProducts = () => {
    history.push(`/project/${project.ProjectNumber}/products`);
  };

  return (
    <div className="add-product-container">
      <div className="pr-3">
        <div className="d-flex">
          <div>
            <Button
              variant="link"
              className="link-btn"
              onClick={handleGoToProducts}
            >
              Go Back
            </Button>
          </div>
          <div className="page-title pl-2">/ Add My Products</div>
        </div>
      </div>

      <div className="add-products-body d-flex">
        <div className="add-product-table">
          {isLoading ? (
            <div className="add-products-spinner d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th></th>
                  <th>Product Name</th>
                  <th>Model Number</th>
                  <th>Color/Finish</th>
                  <th>Distributor</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products?.Products?.slice(0, 25)?.map((product, index) => (
                  <tr key={index}>
                    <td>
                      {!product?.ThumbnailURL ? (
                        <img
                          width="50"
                          alt="my product"
                          className="mr-2"
                          src={ProjectPlaceholder}
                        />
                      ) : (
                        <CustomLightbox
                          images={
                            product?.ImageURL
                              ? [product?.ImageURL, product?.ThumbnailURL]
                              : [product?.ThumbnailURL]
                          }
                        />
                      )}
                    </td>
                    <td>
                      <div className="add-btn-product-details">
                        <Button
                          variant="link"
                          className="link-btn item-button"
                          onClick={() => handleSelectedProductDetails(product)}
                        >
                          {product?.ProductName}
                        </Button>

                        <div className="d-flex mt-2">
                          <div className="model-number">
                            Model: {product?.ModelNumber}
                          </div>
                          <div>Part:</div>
                        </div>
                      </div>
                    </td>
                    <td>{product?.ModelNumber}</td>
                    <td>{product?.ColorFinish}</td>
                    <td>
                      <div className="distributor-select">
                        <Form.Control as="select"></Form.Control>
                        <div>Available from x vendors</div>
                      </div>
                    </td>
                    <td>${product?.MSRP}</td>
                    <td>
                      {addActionLoading?.ID === product.ID ? (
                        <Spinner
                          size="sm"
                          animation="border"
                          variant="primary"
                        />
                      ) : (
                        <Button
                          className="add-product-btn"
                          onClick={() => {
                            setSelectedProduct(product);
                            setAddProductModal(true);
                          }}
                        >
                          Add
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      <AddProductConfirmationModal
        show={addProductModal}
        handleClose={() => setAddProductModal(false)}
        isShowRooms
        handleAdd={(values) => addProduct(values)}
      />
    </div>
  );
};

export default AddCustomProducts;
