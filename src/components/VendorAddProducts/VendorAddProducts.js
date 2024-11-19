import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../assets/images/img-placeholder.png";
import "./VendorAddProducts.scss";

import CustomLightbox from "../Lightbox";
import {
  addVendorProduct,
  getProductsByCategoryAndBrandID,
  getVendorBrands,
  getVendorCategories,
  setSelectedProjectTab,
  setVendorProducts,
} from "../../actions/vendorActions";

const VendorAddProducts = () => {
  const dispatch = useDispatch();

  const vendorAddedProducts = useSelector((state) => state.vendor?.products);

  const [selectedCategoryID, setSelectedCategoryID] = useState(null);
  const [selectedBrandID, setSelectedBrandID] = useState(null);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(25);
  const [error, setError] = useState(false);
  const [isOnlyAdded, setIsOnlyAdded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingActions, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(getVendorBrands()).then((res) => {
      setBrands(res);
    });
    dispatch(getVendorCategories()).then((res) => {
      setCategories(res);
    });
  }, []);

  useEffect(() => {
    if (selectedCategoryID && selectedBrandID) {
      setIsLoading(true);

      dispatch(
        getProductsByCategoryAndBrandID(
          selectedBrandID?.value,
          // 7,
          selectedCategoryID?.value
          // 931
        )
      )
        .then((res) => {
          setProducts(res);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [selectedCategoryID, selectedBrandID]);

  const isProductAdded = (ID) => {
    return vendorAddedProducts?.find((p) => p?.ProductID === ID);
  };

  const onProductCategoryChange = (productCategoryID) => {
    if (!productCategoryID) return;

    setError(false);
    const getCategory = categories?.find(
      (c) => c.ID === parseInt(productCategoryID)
    );
    setSelectedCategoryID({
      value: getCategory.ID,
      label: getCategory?.Name,
    });
  };

  const onProductBrandChange = (ID) => {
    if (!ID) return;

    setError(false);
    const getBrand = brands?.find((c) => c.ID === parseInt(ID));
    setSelectedBrandID({
      value: getBrand.ID,
      label: getBrand?.Name,
    });
  };

  const addProduct = (ProductID, product) => {
    if (!selectedCategoryID?.value) {
      setError(true);
    } else {
      setSelectedProductID(ProductID);
      setActionLoading(true);
      dispatch(
        addVendorProduct(
          selectedBrandID?.value,
          selectedCategoryID?.value,
          ProductID
        )
      ).then((pID) => {
        dispatch(
          setVendorProducts([
            ...vendorAddedProducts,
            {
              ...product,
              ProductID,
              ID: pID,
            },
          ])
        );
        setActionLoading(false);
      });
    }
  };

  const Option = ({ option, type }) => {
    return (
      <option
        value={option?.ID}
        dangerouslySetInnerHTML={{ __html: option?.Name }}
      ></option>
    );
  };

  const handleGoToProducts = () => {
    dispatch(setSelectedProjectTab("products"));
  };

  const handleChangeSwitchFilter = () => {
    setIsOnlyAdded(!isOnlyAdded);
  };

  const getFilterProducts = (products) => {
    const pagedProducts =
      pageCount === "all" ? products : products?.slice(0, pageCount);
    if (isOnlyAdded) {
      return pagedProducts?.filter((p) =>
        isProductAdded(p.ID) ? true : false
      );
    }
    return pagedProducts;
  };

  return (
    <div className="add-product-container">
      <div className="d-flex justify-content-between pr-3">
        <div className="d-flex">
          <div>
            <Button
              variant="link"
              className="link-btn"
              onClick={handleGoToProducts}
            >
              Go to Added products
            </Button>
          </div>
        </div>
        <div className="filter-section">
          <div className="d-flex flex-wrap align-items-center">
            <div className="mx-5">
              <Form>
                <Form.Check
                  checked={isOnlyAdded}
                  onChange={handleChangeSwitchFilter}
                  type="switch"
                  id="custom-switch"
                  label={<small>Only Added Products</small>}
                />
              </Form>
            </div>
            <div className="mr-3">
              <Form.Control
                as="select"
                value={selectedBrandID?.value}
                onChange={(event) => onProductBrandChange(event.target.value)}
              >
                <option value="">Select Brand</option>

                {brands?.map((brand) => (
                  <Option key={brand.ID} option={brand} />
                ))}
              </Form.Control>
              {error ? (
                <small className="text-danger">Please select a brand</small>
              ) : null}
            </div>
            <div className="mr-3">
              <Form.Control
                as="select"
                value={selectedCategoryID?.value}
                onChange={(event) =>
                  onProductCategoryChange(event.target.value)
                }
              >
                <option value="">Select Category</option>

                {categories?.map((category) => (
                  <Option key={category.ID} option={category} />
                ))}
              </Form.Control>
              {error ? (
                <small className="text-danger">Please select a category</small>
              ) : null}
            </div>
            {/* <div className="d-flex qty-items-select justify-content-end">
              <Form.Control
                as="select"
                value={pageCount}
                onChange={(e) =>
                  setPageCount(
                    e.target.value === "all" ? "all" : parseInt(e.target.value),
                  )
                }
              >
                <option value="all">All</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={300}>300</option>
              </Form.Control>
              <div className="select-text">Items Per Page</div>
            </div> */}
          </div>
        </div>
      </div>

      {selectedCategoryID && selectedBrandID ? (
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
                    {getFilterProducts(products)?.map((product, index) => (
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
                          {loadingActions &&
                          product.ID === selectedProductID ? (
                            <Spinner
                              size="sm"
                              animation="border"
                              variant="primary"
                            />
                          ) : (
                            <div className="d-flex">
                              <Button
                                className={`action-button add-product-btn mr-2 ${
                                  isProductAdded(product.ID)
                                    ? "btn-success"
                                    : ""
                                }`}
                                onClick={() => addProduct(product?.ID, product)}
                                disabled={isProductAdded(product.ID)}
                              >
                                {isProductAdded(product.ID) ? "Added" : "Add"}
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {getFilterProducts(products)?.length < 1 && (
                  <div className="mt-4 text-center d-flex flex-column align-items-center justify-content-center">
                    <b>
                      No products found for {selectedCategoryID?.label} and{" "}
                      {selectedBrandID?.label}
                    </b>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-secondary" style={{ minHeight: "200px" }}>
          <p>Please select the category and brand</p>
        </div>
      )}
    </div>
  );
};

export default VendorAddProducts;
