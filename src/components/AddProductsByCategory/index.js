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
import {
  searchProducts,
  setProduct,
  setProductDetail,
} from "../../actions/productActions";
import { Badge, Button, Form, Spinner } from "react-bootstrap";
import CustomLightbox from "../Lightbox";
import Avatar from "../../assets/images/img-placeholder.png";
import ProductPagination from "../Pagination/Pagination";
import Utils, { searchNestedCategoriesArray } from "../../utils";
import { updateUserGlobalProduct } from "../../actions/myProductActions";

const AddProductsByCategory = ({
  isTemplate,
  isReplace,
  current,
  handleAdd,
  existingProducts,
}) => {
  const listCategories = useSelector(
    (state) => state.product.productCategories
  );
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);
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
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isExtraFiltersOpen, setisExtraFiltersOpen] = useState(false);
  const [extraFiltersCount, setExtraFiltersCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [defaultExpandedIds, setDefaultExpandedIds] = useState([606, 666, 460]);
  const [filteredCategoies, setFilteredCategoies] = useState([]);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState({
    loading: false,
  });
  const [favoritedProducts, setIsFavoritedProducts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  useEffect(() => {
    setDefaultExpandedIds(
      getParentIDs(categories, builderSelectedRoomCategory?.ID)
    );
  }, [categories, builderSelectedRoomCategory]);

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
    if (isTemplate) {
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
    if (isTemplate) {
      return builderSelectedRoomCategoryProducts?.find(
        (p) => p.Product?.ID === ID
      );
    } else if (existingProducts?.length) {
      return existingProducts.find((p) => p.ProductID === ID);
    }
  };

  const addProduct = (productID, product) => {
    if (isTemplate && selectedCategory?.id) {
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
    } else {
      handleAdd?.(product);
    }
  };

  const handleDeleteRoomGroupCategoryProduct = (ID) => {
    if (isProductAdded(ID)?.ID && isTemplate) {
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
      CategoryID: "",
    };

    dispatch(searchProducts("", updatedSearch)).then(() => {
      setIsLoading(false);
    });
    setSearchObject(updatedSearch);
  };

  const handleSearchCategory = (value) => {
    setCategorySearchTerm(value);

    if (value.length > 2) {
      const { allBelongings, parents } = searchNestedCategoriesArray(
        categories,
        categorySearchTerm
      );
      if (allBelongings?.length) {
        setIsLoaded(false);
        setTimeout(() => {
          setDefaultExpandedIds(allBelongings.map((d) => d.ID));
          setFilteredCategoies(parents);
          setIsLoaded(true);
        }, 50);
      }
    } else {
      setIsLoaded(false);
      setTimeout(() => {
        setDefaultExpandedIds([]);
        setFilteredCategoies([]);
        setIsLoaded(true);
      }, 50);
    }
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

  function getParentIDs(list, searchForId) {
    if (!builderSelectedRoomCategory?.ID) return [];
    const { allBelongings } = searchNestedCategoriesArray(
      list,
      builderSelectedRoomCategory?.ID,
      "ID"
    );
    return [...(allBelongings ?? []).map((c) => c.ID), searchForId];
  }

  const handleIsFavorite = (item) => {
    setIsFavoriteLoading({ loading: true, ID: item?.ID });
    dispatch(
      updateUserGlobalProduct(item?.ID, !item.SearchIsFavorite, "IsFavorite")
    ).then(() => {
      if (favoritedProducts.includes(item.ID)) {
        setIsFavoritedProducts((prevs) => prevs.filter((p) => p !== item.ID));
      } else {
        setIsFavoritedProducts((prevs) => [...prevs, item.ID]);
      }

      setIsFavoriteLoading({ loading: false, ID: "" });
    });
  };

  const handleSelectedProductDetails = (productDetail) => {
    dispatch(
      setProduct({
        ID: productDetail?.ID,
        Quantity: 1,
        TemplateItemID: productDetail.ID,
        CategoryID: productDetail.CategoryID,
        RoughInTrimOutEnum: "RoughIn",
        IsApproved: false,
      })
    );
    dispatch(setProductDetail(productDetail)).then(() => {
      window.open(
        `/project/${project.ProjectNumber}/product/productDetail`,
        "_blank"
      );
    });
  };

  const data = flattenTree({
    name: "Root",
    children: categorySearchTerm?.length > 2 ? filteredCategoies : categories,
  });
  return (
    <div className="d-flex w-100" style={{ minHeight: "90vh" }}>
      <div className="w-100">
        <div className="d-flex justify-content-between">
          <h4>Categories</h4>
          <Form.Group className="mr-4">
            <div className="d-flex position-relative" style={{ gap: "10px" }}>
              <Form.Control
                placeholder="Find Categories"
                value={categorySearchTerm}
                onChange={(e) => handleSearchCategory(e.target.value)}
                style={{ height: "36px" }}
                className="w-fit pr-2"
              ></Form.Control>
              {categorySearchTerm ? (
                <div
                  className="d-flex align-items-center justify-content-center bg-danger rounded-circle position-absolute"
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    right: "8px",
                    top: "8px",
                  }}
                  onClick={() => {
                    setIsLoaded(false);
                    setCategorySearchTerm("");
                    setTimeout(() => {
                      setDefaultExpandedIds([]);
                      setFilteredCategoies([]);
                      setIsLoaded(true);
                    }, 50);
                  }}
                >
                  <i
                    className="fa fa-times text-white"
                    style={{ fontSize: "12px" }}
                  />
                </div>
              ) : null}
            </div>
          </Form.Group>
        </div>
        <div className="folder-tree-wrapper">
          {isLoaded ? (
            <TreeView
              data={data}
              aria-label="directory tree"
              togglableSelect={false}
              clickAction="EXCLUSIVE_SELECT"
              defaultExpandedIds={defaultExpandedIds}
              defaultSelectedIds={defaultExpandedIds}
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
                  <div
                    onClick={() => setSelectedCategory(element)}
                    className="d-flex align-items-center"
                  >
                    {isBranch || element.children ? (
                      <div className="d-inline-flex align-items-center">
                        {element.children.length ? (
                          <i
                            className={`text-secondary ${
                              isExpanded || isSelected
                                ? "fa fa-chevron-down"
                                : "fa fa-chevron-right"
                            }`}
                            style={{ fontSize: "12px" }}
                          />
                        ) : (
                          <span
                            style={{ marginLeft: "7.5px", height: "12px" }}
                          />
                        )}
                        <i
                          className={`ml-1 ${
                            isExpanded || isSelected
                              ? "fa fa-folder-open"
                              : "fa fa-folder"
                          }`}
                          style={isSelected ? { color: "#007bff" } : {}}
                        />
                      </div>
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
      {selectedCategory?.id ? <div className="verticle-line" /> : null}
      {selectedCategory?.id ? (
        <div className="w-100" style={{ minWidth: "60%" }}>
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
                    className="d-flex mt-4 products-item-wrapper position-relative"
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
                        <a
                          href="#"
                          onClick={() => handleSelectedProductDetails(product)}
                        >
                          <b className="d-block">{product?.ProductName}</b>
                        </a>

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
                          <div>Category: {product.CategoryName}</div>
                        </div>
                      </div>
                    </div>
                    <div>{product.ShortDescription}</div>
                    <div>
                      <div
                        className="position-absolute"
                        style={{ top: "6px", right: "22px", cursor: "pointer" }}
                      >
                        {Utils.itemLoading(product, isFavoriteLoading) ? (
                          <Spinner
                            animation="border"
                            variant="primary"
                            size="sm"
                          />
                        ) : (
                          <i
                            className={`position-absolute far ${
                              product.SearchIsFavorite ||
                              favoritedProducts.includes(product.ID)
                                ? "text-danger fas fa-heart"
                                : "fa-heart"
                            } mr-0`}
                            onClick={() => handleIsFavorite(product)}
                            style={{ fontSize: "16px" }}
                          ></i>
                        )}
                      </div>

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
                            {isReplace
                              ? "Replace"
                              : isProductAdded(product.ID)
                              ? "Added"
                              : "Add"}
                          </Button>
                          {isTemplate ? (
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
                          ) : null}
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
