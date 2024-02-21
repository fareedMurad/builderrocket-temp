import React, { useEffect, useState, useRef } from "react";
import {
  setProduct,
  getCategories,
  setCategories,
  searchProducts,
  setProductDetail,
  setProducts,
  setSelectedProductTab,
} from "../../actions/productActions";
import {
  handleAddProductForProject,
  handleProductForProject,
  setSelectedProject,
} from "../../actions/projectActions";
import { Button, Form, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import Avatar from "../../assets/images/img-placeholder.png";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in our app
import "./AddProduct.scss";
import { useHistory } from "react-router";

import CustomLightbox from "../Lightbox";

// components
import ProductModal from "../ProductModal";
import ColorProductModal from "../ColorProductModal";
import Multiselect from "multiselect-react-dropdown";
import AddProductConfirmationModal from "../AddProductConfirmationModal/AddProductConfirmationModal";
import Select, { components } from "react-select";
import SelectRooms from "../Products/SelectRooms";
import { handleAddMyProductToProject } from "../../actions/myProductActions";
import ProductPagination from "../Pagination/Pagination";

const AddProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const product = useSelector((state) => state.product.product);
  const project = useSelector((state) => state.project.project);
  const products = useSelector((state) => state.product.products);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);
  const ProductSelectedRoom = useSelector(
    (state) => state.room.ProductSelectedRoom
  );

  const listCatgories = useSelector((state) => state.product.productCategories);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  const [roomsOptions, setRoomsOptions] = useState([]);
  const [addActionLoading, setAddActionLoading] = useState();
  const [addProductModal, setAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productFilter, setProductFilter] = useState({
    rooms: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const list = [];

    listCatgories.forEach((c) => {
      list.push({
        ...c,
        value: c.ID,
        label: c.Name?.replaceAll("&nbsp;", ""),
      });
      // c.SubCategories?.forEach((sc) => {
      //   list.push({
      //     ...sc,
      //     value: sc.ID,
      //     label: sc.Name?.replaceAll("&nbsp;", ""),
      //   });
      // });
    });
    setProductCategories(list.sort((a, b) => a.label?.localeCompare(b.label)));
  }, [listCatgories]);

  useEffect(() => {
    let options = [
      ...project?.ProjectRooms?.map((b) => {
        return {
          ...b,
          name: b.RoomName,
          value: b.ID,
        };
      }),
    ];
    setRoomsOptions(options.sort((a, b) => a.name?.localeCompare(b.name)));
  }, [project]);

  useEffect(() => {
    if (productCategories.length < 1) {
      dispatch(getCategories(""));
    }
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchObject, setSearchObject] = useState({
    CategoryID: "",
    ModelName: null,
    Description: null,
    Filter: null,
    CustomFilters: {},
  });

  const productRef = useRef();
  const searchRef = useRef("");
  const productCategoriesRef = useRef();

  useEffect(() => {
    productRef.current = product;
    productCategoriesRef.current = productCategories;
  }, [product, productCategories]);

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      dispatch(setCategories([]));
      dispatch(setProducts([]));
    };
  }, [dispatch]);

  useEffect(() => {
    if (isEmpty(productCategoriesRef.current))
      dispatch(getCategories(productRef.current?.CategoryID));
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    const updatedSearch = {
      ...searchObject,
      CategoryID: productRef?.current?.CategoryID,
      Filter: searchRef?.current?.value,
    };
    dispatch(searchProducts(productRef.current?.CategoryID, updatedSearch))
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [dispatch, product]);

  const onProductCategoryChange = (option) => {
    if (!option) return;

    setSelectedCategory(option);
    dispatch(
      setProduct({
        ...product,
        CategoryID: parseInt(option.value),
      })
    );
  };

  // update individual filter checkbox
  const handleFilters = (filterType, filterChild, filterChildIndex) => {
    let updatedFilterChild = filterChild;

    updatedFilterChild.IsChecked = !updatedFilterChild.IsChecked;

    let updatedFilters = products?.CustomFilters;

    updatedFilters[filterType][filterChildIndex] = updatedFilterChild;

    const search = {
      CategoryID: product?.CategoryID,
      ModelName: null,
      Description: null,
      Filter: searchObject.Filter,
      CustomFilters: updatedFilters,
    };

    dispatch(searchProducts(product?.CategoryID, search));
    setSearchObject(search);
  };

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
      // handleAddProductForProject(newProduct)
      handleAddMyProductToProject(newProduct)
    ).then((project) => {
      dispatch(setSelectedProject(project));
      setAddProductModal(false);
      setAddActionLoading(null);
    });
  };

  const handleClose = () => {
    setShowModal(false);
  };
  const handleColorClose = () => {
    setShowColorModal(false);
  };

  const Category = ({ category, type }) => {
    return (
      <option
        value={category?.ID}
        dangerouslySetInnerHTML={{ __html: category?.Name }}
      ></option>
    );
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
      //setShowColorModal(true);
      history.push(`/project/${project.ProjectNumber}/product/productDetail`);
    });
  };

  const handleSearch = () => {
    const updatedSearch = {
      ...searchObject,
      Filter: searchRef.current.value,
    };

    setIsLoading(true);
    dispatch(
      searchProducts(productRef.current?.CategoryID, updatedSearch)
    ).then(() => {
      setIsLoading(false);
    });
    setSearchObject(updatedSearch);
  };

  const handleGoToProducts = () => {
    history.push(`/project/${project.ProjectNumber}/products`);
  };

  return (
    <div className="add-product-container">
      <div className="d-flex justify-content-between pr-3">
        <div className="d-flex" style={{ flex: 1 }}>
          <div>
            <Button
              variant="link"
              className="link-btn"
              onClick={handleGoToProducts}
            >
              Products /
            </Button>
          </div>
          <div className="d-flex" style={{ flex: 1 }}>
            <div className="page-title mr-2">Add Products</div>

            <SelectRooms
              setProductFilter={setProductFilter}
              productFilter={productFilter}
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="d-flex flex-wrap">
          <div className="mr-3" style={{ width: "300px" }}>
            <Select
              options={productCategories}
              value={selectedCategory}
              onChange={onProductCategoryChange}
              placeholder="Select Category"
              isSearchable
            />
          </div>
          <div className="d-flex">
            <Form.Control
              placeholder="Search Keywords"
              ref={searchRef}
              style={{ height: "36px" }}
            ></Form.Control>
            <Button
              onClick={handleSearch}
              className="primary-gray-btn search-btn ml-3"
            >
              Search
            </Button>
            <Button
              variant="link"
              className="cancel ml-3"
              onClick={handleGoToProducts}
            >
              Cancel
            </Button>
          </div>
          <div></div>
          {/* <div className="d-flex qty-items-select justify-content-end">
            <Form.Control as="select">
              <option>25</option>
            </Form.Control>
            <div className="select-text">Items Per Page</div>
          </div> */}
        </div>
      </div>

      <div className="add-products-body d-flex">
        <div className="checkbox-filter">
          {products?.CustomFilters &&
            Object.keys(products?.CustomFilters)
              ?.reverse()
              ?.map((filter, index) => (
                <div key={index} className="mt-3 mb-5">
                  <div className="bold-text mb-3">{filter}</div>

                  {products?.CustomFilters?.[filter]?.map(
                    (filterChild, childIndex) => (
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
                    )
                  )}
                </div>
              ))}
        </div>

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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products?.Products?.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )?.map((product, index) => (
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
                      <i className={`far fa-heart`}></i>
                    </td>
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
          <div className="d-flex justify-content-center">
            <ProductPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={products?.Products?.length}
            />
          </div>
        </div>
      </div>

      <ProductModal
        show={showModal}
        handleClose={handleClose}
        handleCloseModal={() => setShowModal(false)}
      />

      <AddProductConfirmationModal
        show={addProductModal}
        handleClose={() => setAddProductModal(false)}
        isShowRooms
        handleAdd={(values) => addProduct(values)}
        loader={addActionLoading}
        productFilter={productFilter}
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
