import React, { useEffect, useState, useRef } from "react";
import {
  setProduct,
  getCategories,
  setCategories,
  searchProducts,
  setProductDetail,
  setProducts,
  setSelectedProductTab,
  getReplaceProduct,
  replaceProductService,
  setReplaceProduct,
} from "../../actions/productActions";
import { handleProductForProject } from "../../actions/projectActions";
import { Button, Form, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../assets/images/img-placeholder.png";
import { isEmpty } from "lodash";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./ReplaceProduct.scss";
import { useHistory } from "react-router";
import Select, { components } from "react-select";

// components
import ProductModal from "../ProductModal";
import testUtils from "react-dom/test-utils";
import Utils from "../../utils";
import CustomLightbox from "../Lightbox";

const ReplaceProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const product = useSelector((state) => state.product.replaceOldProduct);
  const project = useSelector((state) => state.project.project);
  const replaceProduct = useSelector((state) => state.product.replaceProduct);
  const productDetials = useSelector((state) => state.product.replaceOldProductDetails);
  const products = useSelector((state) => state.product.products);
  const selectedRoom = useSelector((state) => state.room.selectedRoom);

  const listCatgories = useSelector((state) => state.product.productCategories);
  const [productCategories, setProductCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenLightBox, setOpenLightBox] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightBoxImages, setLightBoxImages] = useState([]);
  const [searchObject, setSearchObject] = useState({
    CategoryID: "",
    ModelName: null,
    Description: null,
    Filter: null,
    CustomFilters: {},
  });
  const [pageCount, setPageCount] = useState(25);
  const[selectedCategory, setSelectedCategory] = useState();

  const [openReplaceProductModal, setOpenReplaceProductModal] = useState(false);

  const productRef = useRef();
  const searchRef = useRef("");
  const productCategoriesRef = useRef();


  useEffect(() => {
    const list = [];

    listCatgories.forEach((c) => {
      list.push({
        ...c,
        value: c.ID,
        label: c.Name?.replaceAll("&nbsp;", ""),
      });
      c.SubCategories?.forEach((sc) => {
        list.push({
          ...sc,
          value: sc.ID,
          label: sc.Name?.replaceAll("&nbsp;", ""),
        });
      });
    });
    setProductCategories(list);
  }, [listCatgories]);

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
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const updatedSearch = {
      ...searchObject,
      CategoryID: selectedCategory?.value || productRef.current?.CategoryID,
      Filter: searchRef?.current?.value,
    };
    dispatch(searchProducts(updatedSearch.CategoryID, updatedSearch))
      .then(setIsLoading(false))
      .catch(setIsLoading(false));
  }, [dispatch, product, selectedCategory]);

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

    if (updatedFilterChild.IsChecked) {
      updatedFilterChild.IsChecked = false;
    } else {
      updatedFilterChild.IsChecked = true;
    }

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

  // const addProduct = (productID) => {
  //     if (!productID || !selectedRoom.ID) return;

  //     const newProduct = {
  //         ...product,
  //         ProductID: productID,
  //         ProjectRoomID: selectedRoom.ID
  //     }

  //     delete newProduct.CategoryID

  //     dispatch(handleProductForProject([newProduct]))
  //         .then(
  //             dispatch(setSelectedProductTab('products'))
  //         );
  // }

  const handleClose = () => {
    setShowModal(false);
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
      history.push(`/project/${project.ProjectNumber}/product/productDetail`);
    });
  };

  const handleSearch = () => {
    const updatedSearch = {
      ...searchObject,
      Filter: searchRef.current.value,
    };

    dispatch(searchProducts(selectedCategory?.value, updatedSearch));
    setSearchObject(updatedSearch);
  };

  const handleGoToProducts = () => {
    history.push(`/project/${project.ProjectNumber}/products`);
  };

  const includedRooms = (ProductID) => {
    let roomIds = [];
    project?.ProjectRooms?.map((room) => {
      room?.Items?.map((item) => {
        return item?.ProductID === ProductID
          ? !roomIds.includes(room?.ID) && roomIds.push(room?.ID)
          : item;
      });
    });

    return roomIds;
  };

  const handleReplaceProduct = (ID) => {
    dispatch(getReplaceProduct(ID, includedRooms(productDetials.ID))).then(() => {
      setShowModal(true);
    });
  };

  const getFilterProducts = () => {
    const listProducts = products?.CustomFilters &&
    Object.keys(products?.CustomFilters)
      ?.reverse();
    
    const pagedProducts =
      pageCount === "all" ? listProducts : listProducts?.slice(0, pageCount);
 
    return pagedProducts;
  };

  return (
    <div className="add-product-container">
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
          Replace Products - {selectedRoom?.RoomName}
        </div>
      </div>

      <div className="filter-section">
        <div className="d-flex flex-wrap">
          <div className="mr-3"  style={{ width: "300px" }}>
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
        </div>
        <div className="d-flex qty-items-select justify-content-end">
        <Form.Control
                as="select"
                value={pageCount}
                onChange={(e) =>
                  setPageCount(
                    e.target.value === "all" ? "all" : parseInt(e.target.value)
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
      </div>

      <div className="add-products-body d-flex">
        <div className="checkbox-filter">
          {getFilterProducts()?.map((filter, index) => (
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
                      {Utils.getProductImages(product)?.length ? (
                        <CustomLightbox
                          images={Utils.getProductImages(product)}
                        />
                      ) : null}
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
                      <i
                        className={`far ${true ? "fa-heart" : "fas-heart"}`}
                      ></i>
                    </td>
                    <td>
                      <Button
                        className="add-product-btn"
                        onClick={() => {
                          handleReplaceProduct(product.ID, );
                          setShowModal(true);
                        }}
                      >
                        Replace
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center p2-5">
        <Button variant="link" className="cancel" onClick={handleGoToProducts}>
          Cancel
        </Button>
      </div>

      {showModal && (
        <ProductModal
          show={showModal}
          handleClose={handleClose}
          handleCloseModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ReplaceProduct;
