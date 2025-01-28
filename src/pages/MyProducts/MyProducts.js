import React, { useEffect, useState } from "react";
import {
  Form,
  Modal,
  Table,
  Button,
  Spinner,
  FormControl,
} from "react-bootstrap";
import {
  deleteMyProduct,
  createMyProduct,
  setSelectedMyProduct,
  editMyProduct,
  getMyProducts,
} from "../../actions/myProductActions";
import { useDispatch, useSelector } from "react-redux";
import "./MyProducts.scss";
import AddProductModal from "../../components/AddProductModal/AddProductModal";
import ProjectPlaceholder from "../../assets/images/img-placeholder.png";
import CustomLightbox from "../../components/Lightbox";

const MyProducts = () => {
  const dispatch = useDispatch();

  const myProducts = useSelector(
    (state) => state.myProduct.myProducts?.Products
  );
  const selectedMyProduct = useSelector(
    (state) => state.myProduct.selectedMyProduct
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMyProductModal, setShowMyProductModal] = useState(false);
  const [filteredMyProducts, setFilteredMyProducts] = useState(myProducts);

  useEffect(() => {
    dispatch(getMyProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filter = myProducts?.filter?.((product) =>
        product?.ProductName?.toLowerCase().includes(searchTerm?.toLowerCase())
      );

      setFilteredMyProducts(filter);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, myProducts]);

  const handleDeleteMyProduct = () => {
    setIsLoading(true);

    dispatch(deleteMyProduct(selectedMyProduct?.ID))
      .then(() => {
        dispatch(getMyProducts());
        dispatch(setSelectedMyProduct({}));
      })
      .then(() => {
        setIsLoading(false);
        setShowDeleteModal(false);
        dispatch(setSelectedMyProduct({}));
      });
  };

  const deleteMyProductConfirmation = (product) => {
    dispatch(setSelectedMyProduct(product))?.then(() => {
      setShowDeleteModal(true);
    });
  };

  const cancelDeletion = () => {
    setShowDeleteModal(false);
    dispatch(setSelectedMyProduct({}));
  };

  const editProduct = (product) => {
    dispatch(setSelectedMyProduct(product)).then(() => {
      setShowMyProductModal(true);
    });
  };

  const handleAddMyProduct = () => {
    dispatch(setSelectedMyProduct({})).then(() => {
      setShowMyProductModal(true);
    });
  };

  const handleAddProduct = (customProduct) => {
    const formData = new FormData();
    Object.keys(customProduct).forEach((key) => {
      const obj = customProduct[key];
      formData.append(key, obj);
    });

    if (selectedMyProduct?.ID) {
      setIsLoading(true);
      dispatch(editMyProduct(formData))
        .then((res) => {
          dispatch(getMyProducts());
        })
        .then(() => {
          setShowMyProductModal(false);
          setIsLoading(false);
        });
    } else {
      dispatch(createMyProduct(formData))
        .then((res) => {
          dispatch(getMyProducts());
        })
        .then(() => {
          setShowMyProductModal(false);
        });
    }
  };

  const deleteMyProductModal = () => {
    return (
      <Modal show={showDeleteModal} onHide={cancelDeletion} centered size="md">
        <Modal.Body>
          <div className="page-title text-center">Delete My Product</div>
          <div className="d-flex justify-content-center">
            Are you sure you want to delete this product?
          </div>
          <div className="d-flex justify-content-center pt-5">
            <Button onClick={cancelDeletion} variant="link" className="cancel">
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={handleDeleteMyProduct}
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="d-flex my-products">
      <div className="my-products-container">
        <div className="d-flex align-items-center mb-4">
          <div className="page-title pb-0">My Products Management</div>
          <div className="ml-2">
            <Button
              variant="link"
              className="link-btn"
              onClick={handleAddMyProduct}
            >
              + Add My Product
            </Button>
          </div>

          <div className="d-flex search-bar">
            <Form inline>
              <FormControl
                placeholder="Search Keywords"
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>
          </div>
        </div>

        <div className="my-products-table">
          <Table hover responsive>
            <thead>
              <tr>
                {/* <th>Thumbnail</th> */}
                <th>Product Name</th>
                <th>Short Description</th>
                {/* <th>Series Name</th> */}
                <th>Product URL</th>
                <th>UPC</th>
                <th>Price</th>
                {/* <th>Model Number</th> */}
                <th>Product Number</th>
                {/* <th>Part Number</th> */}
                <th>Unit Of Sale</th>
                <th>Width</th>
                <th>Height</th>
                <th>Depth</th>
                <th>Weight</th>
                <th>Color/Finish</th>
                <th>Materials</th>
                <th>Collection</th>
                <th>Length</th>
                <th>Is Active?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredMyProducts?.map?.((product, index) => (
                <tr key={index}>
                  <td className="d-flex align-items-center">
                    {!product?.ThumbnailURL ? (
                      <img
                        width="50"
                        alt="my product"
                        className="mr-2"
                        src={ProjectPlaceholder}
                      />
                    ) : (
                      <div className="mr-3">
                        <CustomLightbox
                          images={
                            product?.ImageURL
                              ? [product?.ImageURL, product?.ThumbnailURL]
                              : [product?.ThumbnailURL]
                          }
                        />
                      </div>
                    )}
                    <div>{product?.ProductName}</div>
                  </td>
                  <td>{product?.ShortDescription}</td>
                  {/* <td>{product?.SeriesName}</td> */}
                  <td>{product?.ProductURL}</td>
                  <td>{product?.UPC}</td>
                  <td>${product?.MSRP}</td>
                  {/* <td>{product?.ModelNumber}</td> */}
                  <td>{product?.ProductNumber}</td>
                  {/* <td>{product?.PartNumber}</td> */}
                  <td>{product?.UnitOfSale}</td>
                  <td>{product?.Width}</td>
                  <td>{product?.Height}</td>
                  <td>{product?.Depth}</td>
                  <td>{product?.Weight}</td>
                  <td>{product?.ColorFinish}</td>
                  <td>{product?.Materials}</td>
                  <td>{product?.Collection}</td>
                  <td>{product?.Length}</td>
                  <td>
                    {product?.IsActive ? (
                      <i class="fas fa-check-double text-success"></i>
                    ) : (
                      <i class="fas fa-times text-danger"></i>
                    )}
                  </td>
                  <td>
                    {isLoading && selectedMyProduct?.ID === product.ID ? (
                      <Spinner
                        size="sm"
                        variant="primary"
                        animation="border"
                        className="justify-content-center d-flex"
                      />
                    ) : (
                      <div className="d-flex justify-content-between">
                        <i
                          className="far fa-pencil-alt mx-2"
                          onClick={() => editProduct(product)}
                        ></i>
                        <i
                          className="far fa-trash-alt"
                          onClick={() => deleteMyProductConfirmation(product)}
                        ></i>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {showMyProductModal && (
        <AddProductModal
          isEdit={selectedMyProduct?.ID}
          show={showMyProductModal}
          defaultValues={selectedMyProduct}
          handleClose={() => setShowMyProductModal(false)}
          // productCategories={productCategories}
          handleAddProduct={handleAddProduct}
        />
      )}
      {deleteMyProductModal()}
    </div>
  );
};

export default MyProducts;
