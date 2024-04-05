import React, { useEffect, createRef, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import TreeView, { flattenTree } from "react-accessible-treeview";
import "./AddProductsByCategory.scss";
import {
  createRoomGroupCategoryProduct,
  deleteRoomGroupCategory,
  getRoomGroupCategoryProduct,
  setSelectedGroupCategoryProducts,
} from "../../actions/roomActions";
import { searchProducts } from "../../actions/productActions";
import { Badge, Button, Form, Spinner } from "react-bootstrap";
import CustomLightbox from "../Lightbox";
import Avatar from "../../assets/images/img-placeholder.png";
import ProductPagination from "../Pagination/Pagination";

const AddProductsByCategory = ({ isTemplate, current }) => {
  const listCategories = useSelector(
    (state) => state.product.productCategories
  );
  const dispatch = useDispatch();
  const builderSelectedRoomCategoryProducts = useSelector(
    (state) => state.builderRooms.builderSelectedRoomCategoryProducts
  );
  const builderSelectedRoomGroup = useSelector(
    (state) => state.builderRooms.builderSelectedRoomGroup
  );
  const builderSelectedRoomCategory = useSelector(
    (state) => state.builderRooms.builderSelectedRoomCategory
  );
  const products = useSelector((state) => state.product.products);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [searchObject, setSearchObject] = useState({
    PageSize: 20,
    CategoryID: "",
    ModelName: null,
    Description: null,
    Filter: null,
    CustomFilters: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExtraFiltersOpen, setisExtraFiltersOpen] = useState(false);
  const [extraFiltersCount, setExtraFiltersCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (builderSelectedRoomCategory.ID) {
      setSelectedCategory({
        ...builderSelectedRoomCategory,
        id: builderSelectedRoomCategory.ID,
      });
    }
  }, [builderSelectedRoomCategory]);

  useEffect(() => {
    const updatedSearch = {
      ...searchObject,
      Filter: searchTerm,
    };
    setSearchObject(updatedSearch);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedCategory?.id) {
      setIsLoading(true);
      const updatedSearch = {
        ...searchObject,
        Filter: "",
        CategoryID: selectedCategory?.id,
        CustomFilters: [],
      };
      setSearchTerm("");
      fetchaddedProducts(updatedSearch);
    } else {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  const fetchaddedProducts = async (searchObject) => {
    if (!isTemplate) {
      dispatch(
        getRoomGroupCategoryProduct(
          builderSelectedRoomGroup.ID,
          selectedCategory.id
        )
      ).then((res) => {
        dispatch(setSelectedGroupCategoryProducts(res?.Result || [])).then(() =>
          dispatch(searchProducts(selectedCategory?.id, searchObject))
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false))
        );
      });
    } else {
      dispatch(searchProducts(selectedCategory?.id, searchObject))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  };

  const isProductAdded = (ID) => {
    return builderSelectedRoomCategoryProducts?.find(
      (p) => p.Product?.ID === ID
    );
  };

  const addProduct = (productID, product) => {
    if (selectedCategory?.id) {
      setSelectedProductID(productID);
      setActionLoading(true);
      dispatch(
        createRoomGroupCategoryProduct(
          builderSelectedRoomGroup?.ID,
          selectedCategory?.id,
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
          current?.ID,
          selectedCategory?.id,
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

  const handleSearch = () => {
    setIsLoading(true);
    const updatedSearch = {
      ...searchObject,
      Filter: searchTerm,
      CategoryID: selectedCategory?.id,
    };

    dispatch(searchProducts(selectedCategory?.id, updatedSearch)).then(() => {
      setIsLoading(false);
    });
    setSearchObject(updatedSearch);
  };

  const handlePaginate = (page, size) => {
    const updatedSearch = {
      ...searchObject,
      PageNumber: page,
      CategoryID: selectedCategory?.id,
      PageSize: 20,
    };
    setIsLoading(true);
    dispatch(searchProducts(selectedCategory?.id, updatedSearch)).then(() => {
      setIsLoading(false);
    });
  };

  // update individual filter checkbox
  const handleFilters = (filterType, filterChild, filterChildIndex) => {
    setIsLoading(true);
    let updatedFilterChild = filterChild;

    updatedFilterChild.IsChecked = !updatedFilterChild.IsChecked;

    let updatedFilters = products?.CustomFilters;

    updatedFilters[filterType][filterChildIndex] = updatedFilterChild;

    const search = {
      CategoryID: selectedCategory?.id,
      ModelName: null,
      Description: null,
      Filter: searchObject.Filter,
      CustomFilters: updatedFilters,
      PageSize: 20,
    };

    dispatch(searchProducts(selectedCategory?.id, search)).then(() => {
      setIsLoading(false);
    });
    setSearchObject(search);
  };

  const formatCategory = (items) => {
    return items?.map((item) => {
      const obj = {
        ...item,
        id: item.ID,
        name: item.Name?.replaceAll("&nbsp;", ""),
        isOpen: builderSelectedRoomCategory.ID === item.ID ? true : false,
      };

      obj.children = formatCategory(item.SubCategories) || [];
      return obj;
    });
  };

  useEffect(() => {
    setCategories(formatCategory(listCategories));
  }, [listCategories]);

  useEffect(() => {
    if (products) {
      if (!products?.CustomFilters) setExtraFiltersCount(0);
      else {
        let count = 0;
        Object.keys(products?.CustomFilters)
          ?.reverse()
          ?.forEach((filter) => {
            count =
              count +
              (products?.CustomFilters?.[filter].filter((f) => f?.IsChecked)
                ?.length || 0);
          });
        setExtraFiltersCount(count);
      }
    }
  }, [products]);

  function getParentIDs() {
    if (!builderSelectedRoomCategory?.ID) return [];
    // Helper function to recursively search for the target ID
    function findParentIDs(arr, id, parentIDs) {
      for (let item of arr) {
        if (item.ID === id) {
          // If the target ID is found, return its parent IDs
          return parentIDs;
        }
        if (item?.SubCategories?.length > 0) {
          // If the item has SubCategories, recursively search them
          let result = findParentIDs(
            item.SubCategories,
            id,
            parentIDs.concat(item.ID)
          );
          if (result) {
            // If the target ID is found in the SubCategories, return its parent IDs
            return result;
          }
        }
      }
      // If the target ID is not found, return null
      return null;
    }

    // Start the search from the top-level categories
    return [
      ...(findParentIDs(categories, builderSelectedRoomCategory?.ID, []) ?? []),
      builderSelectedRoomCategory?.ID,
    ];
  }

  console.log(getParentIDs(), "getParentIDs");
  const data = flattenTree({ name: "Root", children: categories });
  return (
    <div className="d-flex w-100" style={{ minHeight: "90vh" }}>
      <div className="w-100">
        <h4>Categories</h4>
        <div className="folder-tree-wrapper">
          {isLoaded ? (
            <TreeView
              data={data}
              aria-label="directory tree"
              togglableSelect={false}
              clickAction="EXCLUSIVE_SELECT"
              defaultExpandedIds={getParentIDs()}
              defaultSelectedIds={getParentIDs()}
              multiSelect
              nodeRenderer={({
                element,
                isBranch,
                isExpanded,
                getNodeProps,
                level,
                isSelected,
              }) => (
                <div
                  {...getNodeProps()}
                  style={{ paddingLeft: 20 * (level - 1) }}
                  className={`tree-item ${isSelected ? "text-primary" : ""}`}
                >
                  <div onClick={() => setSelectedCategory(element)}>
                    {isBranch || element.children ? (
                      <i
                        className={`${
                          isExpanded || isSelected
                            ? "fa fa-folder-open"
                            : "fa fa-folder"
                        }`}
                        style={isSelected ? { color: "#007bff" } : {}}
                      />
                    ) : (
                      <i
                        className={"fa fa-file"}
                        style={isSelected ? { color: "#007bff" } : {}}
                      />
                    )}
                    {element.name}
                  </div>
                </div>
              )}
            />
          ) : null}
        </div>
      </div>
      {selectedCategory?.id ? (
        <div className="w-100">
          <h4>Products</h4>
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <div
              className="d-flex"
              onClick={() => setisExtraFiltersOpen(!isExtraFiltersOpen)}
              style={{ minWidth: "30px" }}
            >
              <i
                className={`pointer pt-4 fa ${
                  isExtraFiltersOpen
                    ? "fa-caret-right text-primary"
                    : " fa-caret-down text-secondary"
                }`}
              />
              <i
                className={`pointer pt-4 fa fa-filter ${
                  isExtraFiltersOpen ? "text-primary" : "text-secondary"
                }`}
              />
              {extraFiltersCount ? (
                <Badge pill bg="primary" className="custom-badge-styles">
                  {extraFiltersCount}
                </Badge>
              ) : null}
            </div>
            <Form.Group className="w-100">
              <Form.Label className="input-label">Search Products</Form.Label>
              <div className="d-flex" style={{ gap: "10px" }}>
                <Form.Control
                  placeholder="Search Products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
          </div>
          {isExtraFiltersOpen ? (
            <div>
              <div className="checkbox-filter">
                {products?.CustomFilters &&
                  Object.keys(products?.CustomFilters)
                    ?.reverse()
                    ?.map((filter, index) => (
                      <div key={index} className="mt-2">
                        <div className="bold-text">{filter}</div>
                        <hr className="mt-1" />
                        <div className="filters-wrapper">
                          {products?.CustomFilters?.[filter]?.map(
                            (filterChild, childIndex) =>
                              filterChild?.Name ? (
                                <Form.Check
                                  key={childIndex}
                                  type="checkbox"
                                  className="mt-1"
                                  label={filterChild?.Name}
                                  value={filterChild?.IsChecked}
                                  checked={filterChild?.IsChecked}
                                  onClick={() =>
                                    handleFilters(
                                      filter,
                                      filterChild,
                                      childIndex
                                    )
                                  }
                                />
                              ) : null
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          ) : null}
          <div>
            {isLoading ? (
              <div className="add-products-empty-wrapper">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : !products?.Products?.length ? (
              <div className="add-products-empty-wrapper">
                No products found!
              </div>
            ) : (
              <>
                {products?.Products?.map((product, index) => (
                  <div
                    key={index}
                    className="d-flex mt-4 products-item-wrapper"
                  >
                    <div>
                      <CustomLightbox
                        images={[
                          product?.ThumbnailName
                            ? product?.ThumbnailURL
                            : Avatar,
                        ]}
                        size={"100px"}
                      />
                    </div>
                    <div>
                      <div className="add-btn-product-details">
                        <b className="d-block">{product?.ProductName}</b>

                        <div>
                          <div className="model-number">
                            Model: {product?.ModelNumber}
                          </div>

                          {product?.MSRP ? (
                            <div>Price: ${product?.MSRP}</div>
                          ) : null}
                          {product?.ColorFinish ? (
                            <div>Color: {product?.ColorFinish}</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div>{product.ShortDescription}</div>
                    <div>
                      {loadingActions && product.ID === selectedProductID ? (
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
                            onClick={() => addProduct(product?.ID, product)}
                            disabled={isProductAdded(product.ID)}
                          >
                            {isProductAdded(product.ID) ? "Added" : "Add"}
                          </Button>
                          <Button
                            className="action-button btn-danger"
                            onClick={() =>
                              handleDeleteRoomGroupCategoryProduct(product?.ID)
                            }
                            disabled={!isProductAdded(product.ID)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-center mt-5">
                  <ProductPagination
                    handlePaginate={handlePaginate}
                    pageIndex={products?.PageNumber}
                    pageCount={products?.ProductsCount}
                    pageSize={products?.pageSize}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AddProductsByCategory;
