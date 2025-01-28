import React, { useEffect, useRef, useState } from "react";
import {
  addDocument,
  deleteDocument,
  getDocumentTypes,
} from "../../actions/documentActions";
import {
  getProjectByProjectID,
  saveDocuments,
  saveProject,
  setSelectedProject,
  setSelectedProjectTab,
} from "../../actions/projectActions";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Utils from "../../utils";
import "./Documents.scss";

// components
import ClearChangesModal from "../ClearChangesModal";
import MarketingBlock from "../MarketingBlock";
import FileUpload from "../FileUpload";
import { getBuilderSubdivision } from "../../actions/builderSubdivisionActions";
import FieldLoader from "../ProjectFieldLoader";
import InputField from "../ProjectInput/TextInput";

const Documents = () => {
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project.project);
  const originalProject = useSelector((state) => state.project.originalProject);
  const documentTypes = useSelector((state) => state.document.documentTypes);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedInput, setSelectedInput] = useState();
  const [progress, setProgress] = useState({});
  const [documentsInfo, setDocumentsInfo] = useState({
    ...project,
    PermitDate: Utils.formatShortDateUS(project?.PermitDate),
  });
  const [subdivisionDocuments, setSubdivisionDocuments] = useState([]);
  const [fieldsLoader, setFieldsLoader] = useState({});

  // Ref to access changes on unmount
  const documentsRef = useRef();

  useEffect(() => {
    dispatch(getDocumentTypes());
    if (project?.Subdivision)
      dispatch(getBuilderSubdivision(parseInt(project?.Subdivision))).then(
        (res) => {
          setSubdivisionDocuments(res?.[0] || {});
        }
      );
  }, [dispatch]);

  const onFileChange = (documentTypeID, event) => {
    // Save new file / document
    const formData = new FormData();

    formData.append("DocumentTypeID", documentTypeID);
    formData.append("File", event.target?.files?.[0]);
    progress[documentTypeID] = { progress: 0, loading: false };
    setProgress({ ...progress });

    dispatch(
      addDocument(project.ID, formData, (event) => {
        progress[documentTypeID] = {
          progress: Math.round((100 * event.loaded) / event.total),
          loading: true,
        };
        setProgress({ ...progress });
      })
    ).then((response) => {
      progress[documentTypeID] = { progress: 0, loading: false };
      setProgress({ ...progress });
      if (response) {
        let documents = project?.Documents?.filter(
          (d) => d?.DocumentTypeID !== documentTypeID
        );
        documents = documents.concat(
          response.Documents?.filter(
            (d) => d?.DocumentTypeID === documentTypeID
          )
        );
        project.Documents = documents;
        dispatch(setSelectedProject({ ...project }));
      }
      //dispatch(getProjectByProjectID(project.ID));
    });
  };

  let findDocumentType = (id) => {
    // return document type to use for label
    return documentTypes?.find((documentType) => documentType?.ID === id);
  };

  let findDocumentTypeFiles = (id) => {
    // return document list based on type
    return [...project?.Documents?.filter((d) => d?.DocumentTypeID === id)];
  };
  let fileProgress = (id) => {
    if (!progress) return {};
    return { ...progress[id] };
  };

  const handleDocumentDelete = (documentID) => {
    // delete document by document ID then refresh project
    dispatch(deleteDocument(documentID))
      .then((response) => {
        if (response) {
          project.Documents = project?.Documents?.filter(
            (d) => d?.ID !== documentID
          );
          dispatch(setSelectedProject({ ...project }));
        }
      })
      .catch(() => {});
  };

  const clearChanges = () => {
    //Reset changes to default
    setDocumentsInfo({ ...project });

    setShowModal(false);
  };

  const saveChanges = (goToNext = true, field) => {
    setIsLoading(true);

    setFieldsLoader({
      ...fieldsLoader,
      [field]: {
        loading: true,
      },
    });

    const documentsInfoFinal = {
      ...documentsInfo,
      PermitDate: Utils.formatDate(documentsInfo.PermitDate),
      OccupencyDate: Utils.formatDate(documentsInfo.OccupencyDate),
    };

    // Save Project then navigate to utilities tab
    dispatch(saveProject(documentsInfoFinal))
      .then(() => {
        setIsLoading(false);
        setFieldsLoader({
          ...fieldsLoader,
          [field]: {
            loading: false,
          },
        });
        if (goToNext) dispatch(setSelectedProjectTab("utilities"));
      })
      .catch(() => {
        setFieldsLoader({
          ...fieldsLoader,
          [field]: {
            loading: false,
          },
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // reference latest changes
    documentsRef.current = documentsInfo;
  }, [documentsInfo]);

  useEffect(() => {
    if (
      documentsInfo?.PolicyExpirationDate !==
      originalProject?.PolicyExpirationDate
    )
      saveChanges(false, "PolicyExpirationDate");
  }, [documentsInfo?.PolicyExpirationDate]);

  useEffect(() => {
    if (
      documentsInfo?.PermitDate !==
      Utils.formatShortDateUS(originalProject?.PermitDate)
    )
      saveChanges(false, "PermitDate");
  }, [documentsInfo?.PermitDate]);

  useEffect(() => {
    if (documentsInfo?.OccupencyDate !== originalProject?.OccupencyDate)
      saveChanges(false, "OccupencyDate");
  }, [documentsInfo?.OccupencyDate]);

  const handleDownloadFile = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="d-flex documents">
      <div className="documents-container">
        <div className="page-title">Documents</div>

        <Form>
          <div className="d-flex flex-wrap documents-form">
            <div className="form-col pb-2">
              <FileUpload
                short
                progress={fileProgress(1)}
                label={findDocumentType(1)?.Name}
                files={findDocumentTypeFiles(1)}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                handleDocumentDelete={handleDocumentDelete}
                onFileChange={(event) => onFileChange(1, event)}
              />
            </div>
            <div className="form-col pb-2">
              <FileUpload
                progress={fileProgress(2)}
                short
                label={findDocumentType(2)?.Name}
                files={findDocumentTypeFiles(2)}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                handleDocumentDelete={handleDocumentDelete}
                onFileChange={(event) => onFileChange(2, event)}
              />
            </div>
            <div className="form-col pb-2">
              <Form.Label className="input-label">
                Permit Date
                <FieldLoader loading={fieldsLoader?.["PermitDate"]?.loading} />
              </Form.Label>
              <DatePicker
                className="input-gray date-picker"
                selected={
                  documentsInfo?.PermitDate
                    ? new Date(documentsInfo?.PermitDate)
                    : ""
                }
                onChange={(date) =>
                  setDocumentsInfo({ ...documentsInfo, PermitDate: date })
                }
              />
            </div>
            <div className="form-col pb-2">
              <Form.Label className="input-label">
                C.O. Date
                <FieldLoader
                  loading={fieldsLoader?.["OccupencyDate"]?.loading}
                />
              </Form.Label>
              <DatePicker
                className="input-gray date-picker"
                selected={
                  documentsInfo?.OccupencyDate
                    ? new Date(documentsInfo?.OccupencyDate)
                    : ""
                }
                onChange={(date) =>
                  setDocumentsInfo({ ...documentsInfo, OccupencyDate: date })
                }
              />
            </div>
            <div className="form-col pb-2">
              <FileUpload
                progress={fileProgress(20)}
                short
                label={findDocumentType(20)?.Name}
                files={findDocumentTypeFiles(20)}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                handleDocumentDelete={handleDocumentDelete}
                onFileChange={(event) => onFileChange(20, event)}
              />
            </div>

            <div className="form-col pb-2">
              <InputField
                label="Building Permit #"
                loading={fieldsLoader?.["BuildingPermitNumber"]?.loading}
                value={documentsInfo?.BuildingPermitNumber}
                onChange={(event) =>
                  setDocumentsInfo({
                    ...documentsInfo,
                    BuildingPermitNumber: event.target.value,
                  })
                }
                onBlur={() => saveChanges(false, "BuildingPermitNumber")}
              />
            </div>
            <div className="form-col pb-2">
              <FileUpload
                short
                progress={fileProgress(3)}
                files={findDocumentTypeFiles(3)}
                label={findDocumentType(3)?.Name}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                handleDocumentDelete={handleDocumentDelete}
                onFileChange={(event) => onFileChange(3, event)}
              />
            </div>

            <div className="form-col pb-2">
              <InputField
                label="Septic Permit #"
                loading={fieldsLoader?.["SepticPermitNumber"]?.loading}
                value={documentsInfo?.SepticPermitNumber}
                onChange={(event) =>
                  setDocumentsInfo({
                    ...documentsInfo,
                    SepticPermitNumber: event.target.value,
                  })
                }
                onBlur={() => saveChanges(false, "SepticPermitNumber")}
              />
            </div>
            <div className="form-col pb-2">
              <FileUpload
                short
                progress={fileProgress(9)}
                files={findDocumentTypeFiles(9)}
                label={findDocumentType(9)?.Name}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                handleDocumentDelete={handleDocumentDelete}
                onFileChange={(event) => onFileChange(9, event)}
              />
            </div>
            <div className="form-col pb-2">
              <FileUpload
                short
                progress={fileProgress(4)}
                files={findDocumentTypeFiles(4)}
                label={findDocumentType(4)?.Name}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                handleDocumentDelete={handleDocumentDelete}
                onFileChange={(event) => onFileChange(4, event)}
              />
            </div>
            <div className="form-col pb-2">
              <InputField
                label="Tax Map #"
                loading={fieldsLoader?.["TaxMapNumber"]?.loading}
                value={documentsInfo?.TaxMapNumber}
                onChange={(event) =>
                  setDocumentsInfo({
                    ...documentsInfo,
                    TaxMapNumber: event.target.value,
                  })
                }
                onBlur={() => saveChanges(false, "TaxMapNumber")}
              />
            </div>
            <div className="form-col pb-2">
              <InputField
                label="Building Risk Policy"
                loading={fieldsLoader?.["BuildingRiskPolicy"]?.loading}
                value={documentsInfo?.BuildingRiskPolicy}
                onChange={(event) =>
                  setDocumentsInfo({
                    ...documentsInfo,
                    BuildingRiskPolicy: event.target.value,
                  })
                }
                onBlur={() => saveChanges(false, "BuildingRiskPolicy")}
              />
            </div>
            <div className="form-col pb-2">
              <div className="d-flex gap-2">
                <div className="w-50">
                  <InputField
                    label="Policy#"
                    loading={fieldsLoader?.["Policy"]?.loading}
                    value={documentsInfo?.Policy}
                    onChange={(event) =>
                      setDocumentsInfo({
                        ...documentsInfo,
                        Policy: event.target.value,
                      })
                    }
                    onBlur={() => saveChanges(false, "Policy")}
                  />
                </div>
                <div className="w-50">
                  <Form.Label className="input-label">
                    Policy Expiration Date
                    <FieldLoader
                      loading={fieldsLoader?.["PolicyExpirationDate"]?.loading}
                    />
                  </Form.Label>
                  <DatePicker
                    className="input-gray date-picker"
                    selected={
                      documentsInfo?.PolicyExpirationDate
                        ? new Date(documentsInfo?.PolicyExpirationDate)
                        : ""
                    }
                    onChange={(date) =>
                      setDocumentsInfo({
                        ...documentsInfo,
                        PolicyExpirationDate: date,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="form-col pb-2">
              <InputField
                label="Purchase Policy Button"
                loading={fieldsLoader?.["PurchasePolicyButton"]?.loading}
                value={documentsInfo?.PurchasePolicyButton}
                onChange={(event) =>
                  setDocumentsInfo({
                    ...documentsInfo,
                    PurchasePolicyButton: event.target.value,
                  })
                }
                onBlur={() => saveChanges(false, "PurchasePolicyButton")}
              />
            </div>
            <div className="form-col pb-2"></div>
            <div className="px-5 w-100">
              <Form.Label className="input-label font-weight-bold">
                Subdivision - {subdivisionDocuments?.SubdivisionName}
              </Form.Label>
              <div className="d-flex flex-column gap-1">
                {subdivisionDocuments?.Documents?.map((file) => (
                  <div className="px-0">
                    <div className="file-name d-flex justify-content-between">
                      <a href={file?.URL} target="_blank" rel="noreferrer">
                        {file?.UserFileName}
                      </a>
                      <i
                        className="fa fa-download text-secondary pointer"
                        onClick={() => handleDownloadFile(file.URL)}
                      ></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Form>

        {/* <ClearChangesModal
          show={showModal}
          setShow={setShowModal}
          clearChanges={clearChanges}
        /> */}

        <div className="d-flex justify-content-center pt-5">
          {isLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <Button
                className="primary-gray-btn next-btn ml-3"
                onClick={() =>
                  dispatch(setSelectedProjectTab("projectInformation"))
                }
              >
                Prevs
              </Button>
              <Button
                className="primary-gray-btn next-btn ml-3"
                onClick={() => dispatch(setSelectedProjectTab("utilities"))}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>

      <MarketingBlock />
    </div>
  );
};

export default Documents;
