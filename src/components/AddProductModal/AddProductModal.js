import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import "./AddProductModal.scss";
import FileUpload from "../FileUpload";

const Category = ({ category, type }) => {
  return (
    <option
      value={category?.ID}
      dangerouslySetInnerHTML={{ __html: category?.Name }}
    ></option>
  );
};

const AddProductModal = ({
  show,
  handleClose,
  productCategories,
  handleAddProduct,
}) => {
  const [newProduct, setProduct] = useState({
    ProductName: "",
    ShortDescription: "",
    ProductDescription: "",
    SeriesName: "",
    ProductURL: "",
    CategoryID: 0,
    DefaultUsageID: 0,
    UPC: "",
    ModelNumber: "",
    ProductNumber: "",
    PartNumber: "",
    UnitOfSale: "",
    IsActive: true,
    Width: "",
    Height: "",
    Depth: "",
    Weight: "",
    BrandID: 0,
    StatusID: 0,
    MSRP: "",
    ColorFinish: "",
    Materials: "",
    Collection: "",
    Length: "",
    LogoDoc: "",
    FullImageFile: "",
    ThumbnailImageFiles: "",
  });
  console.log(newProduct, "newProduct");
  const saveChanges = () => {
    handleAddProduct({
      ...newProduct,
      StatusID: Number(newProduct.StatusID),
      CategoryID: Number(newProduct.CategoryID),
      DefaultUsageID: Number(newProduct.DefaultUsageID),
      BrandID: Number(newProduct.BrandID),
      MSRP: Number(newProduct.MSRP),
    });
  };

  const onFileChange = (event, field) => {
    let file = event.target?.files?.[0];
    setProduct({
      ...newProduct,
      [field]: file,
    });
  };

  const cancelChanges = () => {
    handleClose();
  };

  return (
    <Modal centered size="lg" show={show} className="customer-modal">
      <Modal.Body>
        <div className="page-title">Add Custom Product</div>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="input-label">Product Name</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.ProductName}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    ProductName: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="input-label">Category</Form.Label>

              <Form.Control
                as="select"
                value={newProduct?.CategoryID}
                className="input-gray"
                style={{ fontSize: "12px" }}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    CategoryID: event.target.value,
                  })
                }
              >
                {productCategories?.map((category) => (
                  <Category key={category.ID} category={category} />
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="input-label">Short Description</Form.Label>
              <Form.Control
                rows={4}
                type="text"
                as="textarea"
                className="input-gray"
                defaultValue={newProduct?.ShortDescription}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    ShortDescription: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="input-label">
                Product Detailed Description
              </Form.Label>
              <Form.Control
                rows={4}
                type="text"
                as="textarea"
                className="input-gray"
                defaultValue={newProduct?.ProductDescription}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    ProductDescription: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Series</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.SeriesName}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    SeriesName: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">URL</Form.Label>
              <Form.Control
                type="url"
                className="input-gray"
                value={newProduct?.ProductURL}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    ProductURL: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>

          {/* <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Usage ID</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.DefaultUsageID}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    DefaultUsageID: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col> */}
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">UPC</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.UPC}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    UPC: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Model Number</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.ModelNumber}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    ModelNumber: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Product Number</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.ProductNumber}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    ProductNumber: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Part Number</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.PartNumber}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    PartNumber: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Unit Of Sale</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.UnitOfSale}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    UnitOfSale: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Width</Form.Label>
              <Form.Control
                type="number"
                className="input-gray"
                value={newProduct?.Width}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    Width: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Height</Form.Label>
              <Form.Control
                type="number"
                className="input-gray"
                value={newProduct?.Height}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    Height: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Depth</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.Depth}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    Depth: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Weight</Form.Label>
              <Form.Control
                type="number"
                className="input-gray"
                value={newProduct?.Weight}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    Weight: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          {/* <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">BrandID</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.BrandID}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    BrandID: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col> */}
          {/* <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Status</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.StatusID}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    StatusID: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col> */}
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">MSRP</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.MSRP}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    MSRP: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Color Finish</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.ColorFinish}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    ColorFinish: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Materials</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.Materials}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    Materials: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Collection</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                value={newProduct?.Collection}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    Collection: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Length</Form.Label>
              <Form.Control
                type="number"
                className="input-gray"
                value={newProduct?.Length}
                onChange={(event) =>
                  setProduct({
                    ...newProduct,
                    Length: event.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <FileUpload
              short
              label="LogoDoc"
              buttonText="Upload Image"
              fileURL={newProduct?.LogoDoc}
              onFileChange={(event) => onFileChange(event, "LogoDoc")}
              placeholder={newProduct?.["LogoDoc"]?.name}
            />
          </Col>
          <Col md={4}>
            <FileUpload
              short
              label="ImageFile"
              buttonText="Upload Image"
              fileURL={newProduct?.ImageFile}
              onFileChange={(event) => onFileChange(event, "ImageFile")}
              placeholder={newProduct?.["ImageFile"]?.name}
            />
          </Col>
          <Col md={4}>
            <FileUpload
              short
              label="ThumbnailImageFile"
              buttonText="Upload Image"
              fileURL={newProduct?.ThumbnailImageFiles}
              onFileChange={(event) =>
                onFileChange(event, "ThumbnailImageFiles")
              }
              placeholder={newProduct?.["ThumbnailImageFiles"]?.name}
            />
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="input-label">Is Active</Form.Label>
              <div className="d-flex">
                <Form.Check
                  type="radio"
                  label="Yes"
                  className="mr-3"
                  checked={newProduct.IsActive}
                  onChange={() =>
                    setProduct({
                      ...newProduct,
                      IsActive: true,
                    })
                  }
                />
                <Form.Check
                  type="radio"
                  label="No"
                  checked={!newProduct.IsActive}
                  onChange={() =>
                    setProduct({
                      ...newProduct,
                      IsActive: false,
                    })
                  }
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center pt-5">
          <Button variant="link" className="cancel" onClick={cancelChanges}>
            Cancel
          </Button>
          <Button
            onClick={saveChanges}
            className="primary-gray-btn next-btn ml-3"
          >
            Ok
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
