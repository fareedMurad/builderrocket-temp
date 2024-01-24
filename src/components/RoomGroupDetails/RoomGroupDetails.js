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
import Select from "react-select";

import CustomLightbox from "../Lightbox";
import {
  createRoomGroupCategoryProduct,
  deleteRoomGroupCategory,
  setSelectedGroupCategoryProducts,
  setSelectedBuilderRoomGroup,
  setSelectedBuilderCategory,
  getBuilderRoomGroups,
  getBuilderRoomGroupDetails,
  getRoomGroupCategoryProduct,
} from "../../actions/roomActions";

const RoomGroupDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const searchRef = useRef("");

  const products = useSelector((state) => state.product.products);
  const builderSelectedRoomGroup = useSelector(
    (state) => state.builderRooms.builderSelectedRoomGroup
  );
  const builderSelectedRoomCategory = useSelector(
    (state) => state.builderRooms.builderSelectedRoomCategory
  );
  // const productCategories = useSelector(
  //   (state) => state.product.productCategories
  // );

  const builderSelectedRoomCategoryProducts = useSelector(
    (state) => state.builderRooms.builderSelectedRoomCategoryProducts
  );
  const roomGroups = useSelector(
    (state) => state.builderRooms.builderRoomGroups?.Result
  );

  const roomTypes = useSelector(
    (state) => state.builderRooms.builderRoomTypes?.RoomTypes
  );

  const [selectedCategoryID, setSelectedCategoryID] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(25);
  const [error, setError] = useState(false);
  const [isOnlyAdded, setIsOnlyAdded] = useState(false);
  const [selectedGroupCategories, setSelectedGroupCategories] = useState([]);
  const [isGroupCategoriesLoading, setIsGroupCategoriesLoading] =
    useState(false);

  const [loadingActions, setActionLoading] = useState(false);
  const [searchObject, setSearchObject] = useState({
    CategoryID: "",
    ModelName: null,
    Description: null,
    Filter: null,
    CustomFilters: {},
  });

  useEffect(() => {
    if (builderSelectedRoomCategory) {
      setSelectedCategoryID({
        value: builderSelectedRoomCategory?.ID,
        label: builderSelectedRoomCategory?.Name,
      });
    }
    if (builderSelectedRoomGroup) {
      setSelectedRoomType({
        value: builderSelectedRoomGroup?.ID,
        label: builderSelectedRoomGroup?.Name,
      });
      setIsGroupCategoriesLoading(true);
      dispatch(getBuilderRoomGroupDetails(builderSelectedRoomGroup.ID)).then(
        (res) => {
          setSelectedGroupCategories(res.Result);
          setIsGroupCategoriesLoading(false);
        }
      );
    }
  }, [builderSelectedRoomCategory, builderSelectedRoomGroup]);

  useEffect(() => {
    const updatedSearch = {
      ...searchObject,
      Filter: searchRef?.current?.value,
    };
    setSearchObject(updatedSearch);
  }, [searchRef?.current?.value]);

  useEffect(() => {
    handleFetchRoomGroups();
  }, []);

  const handleFetchRoomGroups = () => {
    dispatch(getBuilderRoomGroups());
  };

  // useEffect(() => {
  //   if (selectedCategoryID) {
  //     setIsLoading(true);

  //     dispatch(getProductsByCategoryID(selectedCategoryID?.value))
  //       .then(() => setIsLoading(false))
  //       .catch(() => setIsLoading(false));
  //   }
  // }, [selectedCategoryID]);

  useEffect(() => {
    if (selectedCategoryID?.value) {
      setIsLoading(true);
      const updatedSearch = {
        ...searchObject,
        // CategoryID: selectedCategoryID?.value,
      };
      fetchaddedProducts(updatedSearch);
    }else {
      setIsLoading(false)
    }
  }, [selectedCategoryID]);

  const fetchaddedProducts = async (searchObject) => {
    dispatch(
      getRoomGroupCategoryProduct(
        builderSelectedRoomGroup.ID,
        selectedCategoryID.value
      )
    ).then((res) => {
      dispatch(setSelectedGroupCategoryProducts(res?.Result || [])).then(() =>
        dispatch(searchProducts(selectedCategoryID?.value, searchObject))
          .then(() => setIsLoading(false))
          .catch(() => setIsLoading(false))
      );
    });
  };

  const isProductAdded = (ID) => {
    return builderSelectedRoomCategoryProducts?.find(
      (p) => p.Product?.ID === ID
    );
  };

  const onRoomTypeChange = (roomType) => {
    if (!roomType) return;

    // const group = builderRoomGroups?.find(g => g.ID === )

    setSelectedRoomType(roomType);
    setError(true);
    dispatch(setSelectedBuilderRoomGroup(roomType));
    dispatch(setSelectedBuilderCategory({})).then(() => {
      // dispatch(setSelectedBuilderRoomGroup(group));
    });
  };

  const onProductCategoryChange = (productCategory) => {
    if (!productCategory) return;

    setSelectedCategoryID(productCategory.Category);
    setError(false);
    // const getCategory = getFilteredCategories()?.find(
    //   (c) => c.ID === parseInt(productCategory)
    // );
    dispatch(setSelectedBuilderCategory(productCategory.Category)).then(() => {
      // dispatch(setSelectedBuilderRoomGroup(group));
    });
  };

  const addProduct = (productID, product) => {
    if (!selectedCategoryID?.value) {
      setError(true);
    } else {
      setSelectedProductID(productID);
      setActionLoading(true);
      dispatch(
        createRoomGroupCategoryProduct(
          builderSelectedRoomGroup?.ID,
          selectedCategoryID?.value,
          productID
        )
      ).then((pID) => {
        dispatch(
          setSelectedGroupCategoryProducts([
            ...builderSelectedRoomCategoryProducts,
            {
              ...product,
              IsTemp: true,
              pID: pID,
              Product: product,
            },
          ])
        );
        setActionLoading(false);
      });
    }
  };

  const handleDeleteRoomGroupCategoryProduct = (ID) => {
    if (isProductAdded(ID)?.ID) {
      setActionLoading(true);
      setSelectedProductID(ID);
      dispatch(
        deleteRoomGroupCategory(
          selectedRoomType?.value,
          selectedCategoryID?.value,
          isProductAdded(ID)?.pID
            ? isProductAdded(ID)?.pID
            : isProductAdded(ID)?.ID
        )
      )
        .then((res) => {
          if (res) {
            dispatch(
              setSelectedGroupCategoryProducts(
                builderSelectedRoomCategoryProducts.filter(
                  (p) => p.Product?.ID !== ID
                )
              )
            );
          }
          setActionLoading(false);
        })
        .catch(() => {
          alert("Something went wrong, please try again!");
          setActionLoading(false);
        });
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
    history.push(`/rooms-management/templates`);
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

  // update individual filter checkbox
  const handleFilters = (filterType, filterChild, filterChildIndex) => {
    setIsLoading(true);
    let updatedFilterChild = filterChild;

    updatedFilterChild.IsChecked = !updatedFilterChild.IsChecked;

    let updatedFilters = products?.CustomFilters;

    updatedFilters[filterType][filterChildIndex] = updatedFilterChild;

    const search = {
      // CategoryID: selectedCategoryID?.value,
      ModelName: null,
      Description: null,
      Filter: searchObject.Filter,
      CustomFilters: updatedFilters,
    };

    dispatch(searchProducts(selectedCategoryID?.value, search)).then(() => {
      setIsLoading(false);
    });
    setSearchObject(search);
  };

  const getFilteredCategories = () => {
    if (isGroupCategoriesLoading) return [];
    return (
      selectedGroupCategories.sort((a, b) =>
        a.CategoryLabel?.localeCompare(b.CategoryLabel)
      ) || []
    );
  };

  const handleSearch = () => {
    setIsLoading(true);
    const updatedSearch = {
      ...searchObject,
      Filter: searchRef.current.value,
    };

    dispatch(searchProducts(selectedCategoryID?.value, updatedSearch)).then(
      () => {
        setIsLoading(false);
      }
    );
    setSearchObject(updatedSearch);
  };

  return (
    <div className="add-product-container position-relative">
      <div className="d-flex">
        <div>
          <Button
            variant="link"
            className="link-btn"
            onClick={handleGoToProducts}
          >
            Templates / {builderSelectedRoomGroup?.Name} /
          </Button>
        </div>
        <div className="page-title">{selectedCategoryID?.label}</div>
      </div>
      <div>
        {isLoading ? (
          <div className="add-products-spinner d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : null}
        <div className="d-flex justify-content-between pr-3">
          <div className="filter-section">
            <div className="d-flex flex-wrap align-items-center">
              <div>
                <Form
                  className="d-flex  flex-wrap align-items-center h-auto"
                  style={{ gap: "20px" }}
                >
                  <Form.Group>
                    <Form.Label className="input-label">
                      Search Products
                    </Form.Label>
                    <div className="d-flex" style={{ gap: "10px" }}>
                      <Form.Control
                        placeholder="Search Products"
                        ref={searchRef}
                        style={{ height: "36px" }}
                      ></Form.Control>
                      <Button
                        onClick={handleSearch}
                        className="primary-gray-btn search-btn"
                      >
                        Search
                      </Button>
                    </div>
                  </Form.Group>
                  <Form.Group style={{ width: "250px", zIndex: 9999 }}>
                    <Form.Label className="input-label">
                      Template{" "}
                      {!builderSelectedRoomGroup?.ID ? (
                        <small className="text-danger">
                          Please select a template
                        </small>
                      ) : null}
                    </Form.Label>
                    <Select
                      options={roomGroups
                        ?.map((c) => {
                          return { ...c, label: c.Name, value: c.ID };
                        })
                        .sort((a, b) => a.label?.localeCompare(b.label))}
                      value={selectedRoomType}
                      onChange={onRoomTypeChange}
                      placeholder="Select template"
                    />
                  </Form.Group>
                  <Form.Group style={{ width: "250px", zIndex: 9999 }}>
                    <Form.Label className="input-label">
                      Category{" "}
                      {!builderSelectedRoomCategory?.ID ? (
                        <small className="text-danger">
                          Please select a category
                        </small>
                      ) : null}
                    </Form.Label>
                    <Select
                      options={getFilteredCategories()?.map((c) => {
                        return {
                          ...c,
                          label: c.CategoryLabel,
                          value: c.CategoryID,
                        };
                      })}
                      value={selectedCategoryID}
                      onChange={onProductCategoryChange}
                      placeholder="Select category"
                      isLoading={isGroupCategoriesLoading}
                      isDisabled={!selectedRoomType}
                    />
                  </Form.Group>

                  <Form.Check
                    className="ml-2"
                    checked={isOnlyAdded}
                    onChange={handleChangeSwitchFilter}
                    type="switch"
                    id="custom-switch"
                    label={<small>Only Added Products</small>}
                  />
                  <div className="d-flex qty-items-select justify-content-end">
                    <Form.Control
                      as="select"
                      value={pageCount}
                      onChange={(e) =>
                        setPageCount(
                          e.target.value === "all"
                            ? "all"
                            : parseInt(e.target.value)
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
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        {selectedCategoryID?.value && selectedRoomType.value ? (
          <div className="add-products-body d-flex">
            <div className="checkbox-filter">
              {products?.CustomFilters &&
                Object.keys(products?.CustomFilters)
                  ?.reverse()
                  ?.map((filter, index) => (
                    <div key={index} className="mt-3 mb-5 ml-2">
                      <div className="bold-text mb-3">{filter}</div>

                      {products?.CustomFilters?.[filter]?.map(
                        (filterChild, childIndex) =>
                          filterChild?.Name ? (
                            <Form.Check
                              key={childIndex}
                              type="checkbox"
                              className="mt-2"
                              label={filterChild?.Name}
                              value={filterChild?.IsChecked}
                              onClick={() =>
                                handleFilters(filter, filterChild, childIndex)
                              }
                            />
                          ) : null
                      )}
                    </div>
                  ))}
            </div>
            {selectedCategoryID ? (
              <div className="add-products-body d-flex">
                <div className="add-product-table w-100 px-3">
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
                      {getFilterProducts(products?.Products)?.map(
                        (product, index) => (
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
                                <b className="d-block">
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
                                    className={`action-button mr-2 ${
                                      isProductAdded(product.ID)
                                        ? "btn-success"
                                        : "add-product-btn"
                                    }`}
                                    onClick={() =>
                                      addProduct(product?.ID, product)
                                    }
                                    disabled={isProductAdded(product.ID)}
                                  >
                                    {isProductAdded(product.ID)
                                      ? "Added"
                                      : "Add"}
                                  </Button>
                                  <Button
                                    className="action-button btn-danger"
                                    onClick={() =>
                                      handleDeleteRoomGroupCategoryProduct(
                                        product?.ID
                                      )
                                    }
                                    disabled={!isProductAdded(product.ID)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-secondary" style={{ minHeight: "200px" }}>
                <p>Please select the category</p>
              </div>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <p>
              Please select a template and a category to list down their
              products!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomGroupDetails;
