import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../assets/images/img-placeholder.png";
import "./VendorProducts.scss";

import CustomLightbox from "../Lightbox";
import {
  deleteVendorProduct,
  getVendorProducts,
  setSelectedProjectTab,
} from "../../actions/vendorActions";

const VendorProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.vendor?.products);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setActionLoading] = useState(false);

  useEffect(() => {
    fetchVendorProducts();
  }, []);

  const fetchVendorProducts = () => {
    setIsLoading(true);
    dispatch(getVendorProducts()).then((res) => {
      setIsLoading(false);
    });
  };

  const hanldeDeleteVendorProduct = (ID) => {
    if (ID) {
      setActionLoading(true);
      setSelectedProductID(ID);
      dispatch(deleteVendorProduct(ID))
        .then((res) => {
          if (res) {
            fetchVendorProducts();
          }
          setActionLoading(false);
        })
        .catch(() => {
          alert("Something went wrong, please try again!");
          setActionLoading(false);
        });
    }
  };

  const handleGoToProducts = () => {
    dispatch(setSelectedProjectTab("addProducts"));
  };

  return (
    <div className="add-product-container">
      <div className="d-flex justify-content-between pr-3">
        <div className="d-flex">
          <div>
            <h6>Vendor Products</h6>
          </div>
        </div>
      </div>
      <div className="add-products-body d-flex">
        <div className="add-product-table w-100 px-3">
          {isLoading ? (
            <div className="add-products-spinner d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th></th>
                    <th>Product Name</th>
                    <th>Model Number</th>
                    <th>Color/Finish</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <CustomLightbox
                          images={[
                            product?.ThumbnailName
                              ? product?.ThumbnailURL
                              : Avatar,
                          ]}
                        />
                      </td>
                      <td>
                        <div className="add-btn-product-details">
                          <b className="d-block">{product?.ProductName}</b>

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
                      <td>${product?.MSRP}</td>
                      <td>
                        {loadingActions && product.ID === selectedProductID ? (
                          <Spinner
                            size="sm"
                            animation="border"
                            variant="primary"
                          />
                        ) : (
                          <div className="d-flex">
                            <Button
                              className="action-button btn-danger"
                              onClick={() =>
                                hanldeDeleteVendorProduct(product?.ID)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {products?.length < 1 && (
                <div className="mt-4 text-center d-flex flex-column align-items-center justify-content-center">
                  <b>No products added yet</b>
                  <Button
                    variant="link"
                    className="link-btn"
                    onClick={handleGoToProducts}
                  >
                    Go to Manage products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProducts;
