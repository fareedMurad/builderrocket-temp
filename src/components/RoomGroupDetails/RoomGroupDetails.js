import React, { useEffect, useState, useRef } from "react";
import {
  getProductsByCategoryID,
  searchProducts,
} from "../../actions/productActions";
import { Button, Form, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../assets/images/img-placeholder.png";
import "./RoomGroupDetails.scss";
import { useHistory } from "react-router";

import CustomLightbox from "../Lightbox";
import { createRoomGroupCategoryProduct } from "../../actions/roomActions";

const RoomGroupDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const products = useSelector((state) => state.product.products);
  const builderSelectedRoomGroup = useSelector((state) => state.builderRooms.builderSelectedRoomGroup);
  const builderSelectedRoomCategory = useSelector((state) => state.builderRooms.builderSelectedRoomCategory);
  const productCategories = useSelector(
    (state) => state.product.productCategories
  );

  const [selectedCategoryID, setSelectedCategoryID] = useState(null);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(25);
  const [error, setError] = useState(false);

  const [loadingActions, setActionLoading] = useState(false)

  useEffect(() => {
    if (builderSelectedRoomCategory) {
      setSelectedCategoryID({ value: builderSelectedRoomCategory?.ID, label: builderSelectedRoomCategory?.Name });
    }
  }, [builderSelectedRoomCategory])


  useEffect(() => {
    if (selectedCategoryID) {
      setIsLoading(true)

      dispatch(getProductsByCategoryID(selectedCategoryID?.value))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [selectedCategoryID]);

  const onProductCategoryChange = (productCategoryID) => {
    if (!productCategoryID) return;

    setError(false);
    const getCategory = productCategories?.find(c => c.ID === parseInt(productCategoryID));
    setSelectedCategoryID({
      value: getCategory.ID,
      label: getCategory?.Name
    });
  };

  const addProduct = (productID) => {
    if (!selectedCategoryID?.value) {
      setError(true)
    } else {
      setSelectedProductID(productID);
      setActionLoading(true);
      dispatch(createRoomGroupCategoryProduct(builderSelectedRoomGroup, selectedCategoryID?.value, productID)).then(() => {
        setActionLoading(false);
      })
    }
  };

  const Category = ({ category, type }) => {
    return (
      <option
        value={category?.ID}
        dangerouslySetInnerHTML={{ __html: category?.Name }}
      ></option>
    );
  };

  const handleGoToProducts = () => {
    history.push(`/rooms-management/groups`);
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
              Groups /
            </Button>
          </div>
          <div className="page-title">
            {selectedCategoryID?.label}
          </div>
        </div>
        <div className="filter-section">
          <div className="d-flex flex-wrap">
            <div className="mr-3">
              <Form.Control
                as="select"
                disabled
                value={selectedCategoryID?.value}
                onChange={(event) => onProductCategoryChange(event.target.value)}
              >
                <option value="">Select Category</option>

                {productCategories?.map((category) => (
                  <Category key={category.ID} category={category} />
                ))}
              </Form.Control>
              {error ? <small className="text-danger">Please select a category</small> : null}
            </div>
            <div className="d-flex qty-items-select justify-content-end">
              <Form.Control as="select"
                value={pageCount}
                onChange={e => setPageCount(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}>
                <option value="all">All</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={300}>300</option>
              </Form.Control>
              <div className="select-text">Items Per Page</div>
            </div>
          </div>
        </div>
      </div>



      {selectedCategoryID ? (
        <div className="add-products-body d-flex">

          <div className="add-product-table w-100 px-3">
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
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(pageCount === 'all' ? products : products?.slice(0, pageCount))?.map((product, index) => (
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
                          <b className="d-block"
                          >
                            {product?.ProductName}
                          </b>

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
                        {(loadingActions && product.ID === selectedProductID) ? <Spinner size="sm" animation="border" variant="primary" /> :
                          <div className="d-flex">
                          <Button
                            className="action-button add-product-btn mr-2"
                            onClick={() => addProduct(product?.ID)}
                          >
                            Add
                          </Button>
                          <Button
                            className="action-button btn-danger"
                            onClick={() => addProduct(product?.ID)}
                          >
                            Remove
                          </Button>
                          </div>
                          }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      ) : (
        <div className="text-secondary" style={{ minHeight: "200px" }}>
          <p>Please select the category</p>
        </div>
      )}
    </div>
  );
};

export default RoomGroupDetails;
