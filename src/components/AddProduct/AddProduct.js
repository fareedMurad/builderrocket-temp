import React, { useEffect, useState, useRef } from "react";
import {
  setProduct,
  getCategories,
  setCategories,
  searchProducts,
  setProductDetail,
  setProducts,
  setSelectedProductTab,
  addCustomProduct,
} from "../../actions/productActions";
import {
  handleAddProductForProject,
  handleProductForProject,
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
import AddProductModal from "../AddProductModal/AddProductModal";

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
  const productCategories = useSelector(
    (state) => state.product.productCategories
  );
  const [roomsOptions, setRoomsOptions] = useState([]);

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
    setRoomsOptions(options);
  }, [project]);

  const [showModal, setShowModal] = useState(false);
  const [customProductModalVisible, setCustomProductModalVisible] =
    useState(false);
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
    const updatedSearch = {
      ...searchObject,
      CategoryID: productRef?.current?.CategoryID,
      Filter: searchRef?.current?.value,
    };
    dispatch(searchProducts(productRef.current?.CategoryID, updatedSearch))
      .then(setIsLoading(false))
      .catch(setIsLoading(false));
  }, [dispatch, product]);

  const onProductCategoryChange = (productCategoryID) => {
    if (!productCategoryID) return;

    dispatch(
      setProduct({
        ...product,
        CategoryID: parseInt(productCategoryID),
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

  const addProduct = (productID) => {
    if (!productID || !ProductSelectedRoom.length) return;

    let newProduct = {
      ProjectId: project.ID,
      Categories: [product.CategoryID],
      Brands: [0],
      Rooms: [...ProductSelectedRoom],
    };
    // if (product && product.TemplateItemID) {
    //     newProduct = [{
    //         ...product,
    //         ProductID: productID,
    //         ProjectRoomID: selectedRoom.ID
    //     }]

    // } else {
    //     const GetRoomId = project?.ProjectRooms.filter(b => ProductSelectedRoom.indexOf(b.ID) > -1)
    //     if (GetRoomId.length) {
    //         newProduct = GetRoomId.map(list => { return { ProductID: productID, ProjectRoomID: list.ID } })
    //     } else {
    //         console.log(selectedRoom, "selectedRoom")
    //         newProduct = [{
    //             ...product,
    //             ProductID: productID,
    //             ProjectRoomID: selectedRoom.ID
    //         }]
    //     }
    // }

    // delete newProduct.CategoryID
    dispatch(handleAddProductForProject(newProduct))
      .then
      //   history.push(`/project/${project.ProjectNumber}/products`)
      ();
  };

  const handleAddProduct = (customProduct) => {
    const formData = new FormData();

    Object.keys(customProduct).forEach((key) => {
      const obj = customProduct[key];
      formData.append(key, obj);
    });
    dispatch(addCustomProduct(customProduct)).then(() => {});
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

    dispatch(searchProducts(productRef.current?.CategoryID, updatedSearch));
    setSearchObject(updatedSearch);
  };

  const handleGoToProducts = () => {
    history.push(`/project/${project.ProjectNumber}/products`);
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
              Products /
            </Button>
          </div>
          <div className="page-title">
            Add Products - {selectedRoom?.RoomName}
          </div>
          {ProductSelectedRoom.length ? (
            <Multiselect
              tags
              className="tags-dropdown readonly_ms border-none"
              disable={true}
              placeholder=""
              showCheckbox={true}
              options={roomsOptions} // Options to display in the dropdown
              selectedValues={
                !ProductSelectedRoom
                  ? []
                  : project?.ProjectRooms?.length ===
                    ProductSelectedRoom?.length
                  ? roomsOptions
                  : roomsOptions.filter(
                      (b) => ProductSelectedRoom.indexOf(b.ID) > -1
                    )
              }
              displayValue="name" // Property name to display in the dropdown options
            />
          ) : (
            false
          )}
        </div>
        <Button
          variant="link"
          className="link-btn"
          onClick={() => setCustomProductModalVisible(true)}
        >
          + Add Custom Product
        </Button>
      </div>

      <div className="filter-section">
        <div className="d-flex flex-wrap">
          <div className="mr-3">
            <Form.Control
              as="select"
              value={product?.CategoryID}
              onChange={(event) => onProductCategoryChange(event.target.value)}
            >
              <option value="">Select Category</option>

              {productCategories?.map((category) => (
                <Category key={category.ID} category={category} />
              ))}
            </Form.Control>
          </div>
          <div className="d-flex">
            <Form.Control
              placeholder="Search Keywords"
              ref={searchRef}
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
          <div className="d-flex qty-items-select justify-content-end">
            <Form.Control as="select">
              <option>25</option>
            </Form.Control>
            <div className="select-text">Items Per Page</div>
          </div>
        </div>
      </div>

      {productRef.current?.CategoryID ? (
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
                  {products?.Products?.slice(0, 25)?.map((product, index) => (
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
                            onClick={() =>
                              handleSelectedProductDetails(product)
                            }
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
                        <Button
                          className="add-product-btn"
                          onClick={() => addProduct(product?.ID)}
                        >
                          Add
                        </Button>
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

      {/* <div className='d-flex justify-content-center p2-5'>
                <Button
                    variant='link'
                    className='cancel'
                    onClick={handleGoToProducts}
                >
                    Cancel
                </Button>
            </div> */}

      <ProductModal
        show={showModal}
        handleClose={handleClose}
        handleCloseModal={() => setShowModal(false)}
      />

      <AddProductModal
        show={customProductModalVisible}
        handleClose={() => setCustomProductModalVisible(false)}
        productCategories={productCategories}
        handleAddProduct={handleAddProduct}
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
