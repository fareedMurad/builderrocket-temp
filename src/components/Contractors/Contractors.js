import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Spinner } from "react-bootstrap";
import {
  getContractors,
  getContractorTypes,
} from "../../actions/contractorActions";
// import { getProductDetails, setSelectedProductTab } from '../../actions/productActions';
import {
  saveProject,
  setSelectedProjectTab,
  saveProjectContractor,
  // setSelectedProject,
} from "../../actions/projectActions";
import "./Contractors.scss";

// components
import ClearChangesModal from "../ClearChangesModal";
import MarketingBlock from "../MarketingBlock";
import AddContractor from "../AddContractor";
// import { addDocument, deleteDocument } from '../../actions/documentActions';
// import FileUpload from '../FileUpload';

const Contractors = () => {
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project.project);
  const contractors = useSelector((state) => state.contractor.contractors);
  const contractorTypes = useSelector(
    (state) => state.contractor.contractorTypes
  );
  // const documentTypes = useSelector(state => state.document.documentTypes)

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [contractorsInfo, setContractorsInfo] = useState(project.Contractors);

  // Ref to access changes on unmount
  const contractorsRef = useRef();
  const projectRef = useRef();

  useEffect(() => {
    dispatch(getContractors());
    dispatch(getContractorTypes());
  }, [dispatch]);

  const filterContractorsByType = (id) => {
    // filter contractors that fit contractor type ID
    return contractors
      ?.filter((contractor) =>
        contractor.ContractorTypes.find((type) => type.ID === id)
      )
      .sort(function (x, y) {
        return y.IsFavorite - x.IsFavorite;
      });
  };

  // const [progress, setProgress] = useState({});
  // const [selectedInput, setSelectedInput] = useState();

  // const onFileChange = (documentTypeID, event) => {
  //     // Save new file / document
  //     const formData = new FormData();

  //     formData.append('DocumentTypeID', documentTypeID);
  //     formData.append('File', event.target?.files?.[0]);
  //     progress[documentTypeID] = { progress: 0, loading: false };
  //     setProgress({ ...progress });

  //     dispatch(addDocument(project.ID, formData, (event) => {
  //         progress[documentTypeID] = { progress: Math.round((100 * event.loaded) / event.total), loading: true };
  //         setProgress({ ...progress });
  //         console.log(progress);
  //     }))
  //         .then((response) => {
  //             progress[documentTypeID] = { progress: 0, loading: false };
  //             setProgress({ ...progress });
  //             if (response) {
  //                 let documents = project?.Documents?.filter((d) => d?.DocumentTypeID !== documentTypeID);
  //                 documents = documents.concat(response.Documents?.filter((d) => d?.DocumentTypeID === documentTypeID));
  //                 project.Documents = documents;
  //                 dispatch(setSelectedProject({ ...project }));
  //             }
  //             //dispatch(getProjectByProjectID(project.ID));
  //         });
  // }

  // let findDocumentType = (id) => {
  //     // return document type to use for label
  //     return documentTypes?.find((documentType) => documentType?.ID === id);
  // }

  // let findDocumentTypeFiles = (id) => {
  //     // return document list based on type
  //     return [...project?.Documents?.filter((d) => d?.DocumentTypeID === id)];
  // }
  // let fileProgress = (id) => {
  //     if (!progress) return {};
  //     return { ...progress[id] };
  // }

  // const handleDocumentDelete = (documentID) => {
  //     // delete document by document ID then refresh project
  //     dispatch(deleteDocument(documentID))
  //         .then((response) => {
  //             if (response) {
  //                 project.Documents = project?.Documents?.filter((d) => d?.ID !== documentID);
  //                 dispatch(setSelectedProject({ ...project }));
  //             }
  //         })
  //         .catch(() => { });
  // }

  const handleContractor = (contractorID, contractorTypeID) => {
    if (!contractorTypeID) return;

    dispatch(
      saveProjectContractor(project.ID, contractorTypeID, contractorID)
    ).then((data) => {
      console.log(data);
    });

    let newContractorsMap;
    let selectedContractor;

    if (contractorID) {
      selectedContractor = contractors.find(
        (contractor) => contractor.ID === contractorID
      );

      // update the selected contractor TYPE with selected contractor
      newContractorsMap = {
        ...contractorsInfo,
        [contractorTypeID]: {
          ContractorID: contractorID,
          ContractorTypeID: contractorTypeID,
          CompanyName: selectedContractor?.CompanyName,
          PhoneNumber: selectedContractor?.PhoneNumber,
          EmailAddress: selectedContractor?.EmailAddress,
        },
      };
    } else {
      newContractorsMap = {
        ...contractorsInfo,
        [contractorTypeID]: {
          ContractorID: null,
          ContractorTypeID: contractorTypeID,
        },
      };
    }

    // update component state with updated contractor map
    setContractorsInfo({ ...newContractorsMap });
  };

  const clearChanges = () => {
    setContractorsInfo({ ...project.Contractors });

    setShowModal(false);
  };

  const saveChanges = () => {
    // Save changes and navigate to Drawings tab
    setIsLoading(true);

    dispatch(saveProject({ ...project, Contractors: contractorsInfo })).then(
      () => {
        setIsLoading(false);
        dispatch(setSelectedProjectTab("drawings"));
      }
    );
  };

  useEffect(() => {
    // reference latest changes
    contractorsRef.current = contractorsInfo;
    projectRef.current = project;
  }, [contractorsInfo, project]);

  // useEffect(() => {
  //     return () => {
  //         // save any changes when navigating away
  //         dispatch(saveProject({
  //             ...projectRef.current,
  //             Contractors: contractorsRef.current
  //         }));
  //     }
  // }, [dispatch]);

  return (
    <div className="d-flex contractors">
      <div className="contractors-container">
        <div className="d-flex">
          <div className="page-title">Contractor</div>

          <div className="ml-1">
            <Button
              variant="link"
              className="link-btn"
              onClick={() => setShowContractorModal(true)}
            >
              + Add Contractor
            </Button>
          </div>
        </div>

        <div className="contractors-form">
          <div className="d-flex flex-wrap">
            {contractorTypes?.map((contractorType, index) => (
              <div key={index} className="select contractor">
                <Form.Label className="input-label">
                  {contractorType.Name && contractorType.Name}
                </Form.Label>

                <Form.Control
                  as="select"
                  value={
                    contractorsInfo?.[contractorType?.ID]?.ContractorID ?? ""
                  }
                  onChange={(event) =>
                    handleContractor(event.target.value, contractorType.ID)
                  }
                >
                  <option value="">SELECT</option>
                  {filterContractorsByType(contractorType.ID)?.map(
                    (contractor, index) => (
                      <option key={index} value={contractor.ID}>
                        {contractor.CompanyName}
                        {contractor.FirstName && ` - ${contractor.FirstName}`}
                        {contractor.LastName && ` ${contractor.LastName}`}
                      </option>
                    )
                  )}
                </Form.Control>

                {contractorsInfo?.[contractorType?.ID]?.ContractorID && (
                  <div className="pt-1 pl-1">
                    {contractorsInfo?.[contractorType?.ID]?.PhoneNumber && (
                      <div className="pr-3">
                        <i className="fas fa-phone mr-2"></i>
                        <a
                          href={`tel:+1${
                            contractorsInfo?.[contractorType?.ID]?.PhoneNumber
                          }`}
                        >
                          {contractorsInfo?.[contractorType?.ID]?.PhoneNumber}
                        </a>
                      </div>
                    )}
                    {contractorsInfo?.[contractorType?.ID]?.EmailAddress && (
                      <div>
                        <i className="fas fa-envelope mr-2"></i>
                        <a
                          href={`mailto:${
                            contractorsInfo?.[contractorType?.ID]?.EmailAddress
                          }`}
                        >
                          {contractorsInfo?.[contractorType?.ID]?.EmailAddress}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {/* <div className='select contractor'>
                            <Form.Label className='input-label'>Soil Treatment Contractor</Form.Label>
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
                        </div> */}
          </div>
        </div>

        <div className="d-flex justify-content-center pt-5">
          {isLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <Button
                variant="link"
                className="cancel"
                onClick={() => setShowModal(true)}
              >
                Cancel
              </Button>
              <Button
                className="primary-gray-btn next-btn ml-3"
                onClick={saveChanges}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>

      <MarketingBlock />

      <ClearChangesModal
        show={showModal}
        setShow={setShowModal}
        clearChanges={clearChanges}
      />

      {showContractorModal && (
        <AddContractor
          show={showContractorModal}
          handleClose={() => setShowContractorModal(false)}
        />
      )}
    </div>
  );
};

export default Contractors;
