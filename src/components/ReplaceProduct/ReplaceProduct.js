import React, { useState, useEffect } from "react";
import { getCategories, getReplaceProduct } from "../../actions/productActions";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./ReplaceProduct.scss";
import { useHistory } from "react-router";

// components
import ProductModal from "../ProductModal";
import AddProductsByCategory from "../AddProductsByCategory";

const ReplaceProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const project = useSelector((state) => state.project.project);
  const productDetials = useSelector(
    (state) => state.product.replaceOldProductDetails
  );
  const selectedRoom = useSelector((state) => state.room.selectedRoom);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCategories()).then(() => {
      setIsLoading(false);
    });
  }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 0);

  //   return () => {
  //     dispatch(setCategories([]));
  //     dispatch(setProducts([]));
  //   };
  // }, [dispatch]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleGoToProducts = () => {
    history.push(`/project/${project.ProjectNumber}/products`);
  };

  const includedRooms = (ProductID) => {
    let roomIds = [];
    project?.BuilderProjectRooms?.map((room) => {
      room?.Items?.map((item) => {
        return item?.ProductID === ProductID
          ? !roomIds.includes(room?.ID) && roomIds.push(room?.ID)
          : item;
      });
    });

    return roomIds;
  };

  const handleReplaceProduct = (ID) => {
    dispatch(getReplaceProduct(ID, includedRooms(productDetials.ID))).then(
      () => {
        setShowModal(true);
      }
    );
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

      {isLoading ? (
        <div className="add-products-spinner d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <AddProductsByCategory
          handleAdd={(product) => {
            handleReplaceProduct(product.ID);
          }}
          isReplace={true}
        />
      )}

      {showModal && (
        <ProductModal
          show={showModal}
          handleClose={handleClose}
          handleCloseModal={() => setShowModal(false)}
        />
      )}

      {/* {showModal && <ColorProductModal
        show={showModal}
        handleCloseModal={handleClose}
      />} */}
    </div>
  );
};

export default ReplaceProduct;
