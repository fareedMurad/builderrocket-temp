import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Form,
    Modal,
    Table,
    Button,
    Spinner,
    Tooltip,
    FormControl,
    OverlayTrigger,
} from 'react-bootstrap';
import {
    getContractors,
    deleteContractor,
    getContractorTypes,
    setSelectedContractor,
    updateIsFavorite
} from '../../actions/contractorActions';
import './ContractorManagement.scss';

import ReactStars from "react-rating-stars-component";
// components
import AddContractor from '../../components/AddContractor';

const ContractorManagement = () => {
    const dispatch = useDispatch();

    const contractors = useSelector(state => state.contractor.contractors);
    const contractorTypes = useSelector(state => state.contractor.contractorTypes);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContractorID, setSelectedContractorID] = useState();
    const [showContractorModal, setShowContractorModal] = useState(false);
    const [filteredContractors, setFilteredContractors] = useState(contractors);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        dispatch(getContractorTypes());
        dispatch(getContractors())
            .then(() => {
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                alert('Something went wrong getting contractors please try again');
            });
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const filter = contractors?.filter((contractor) =>
                contractor?.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.LastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.City?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.State?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.ZipCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.PhoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor?.EmailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${contractor?.FirstName} ${contractor?.LastName}`.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                contractor?.ContractorTypes.find((type) => type.Name.toLowerCase().includes(searchTerm.toLocaleLowerCase()))
            )

            setFilteredContractors(filter)
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm, contractors]);

    const handleDeleteContractor = () => {
        setIsLoading(true);

        dispatch(deleteContractor(selectedContractorID))
            .then(() => {
                dispatch(getContractors());
            })
            .then(() => {
                setIsLoading(false);
                setShowDeleteModal(false);
            })
            .catch(() => { });
    }

    const deleteContractorConfirmation = (contractorID) => {
        setSelectedContractorID(contractorID);

        setShowDeleteModal(true);
    }

    const cancelDeletion = () => {
        setSelectedContractorID();

        setShowDeleteModal(false);
    }

    const editContractor = (contractor) => {
        setShowContractorModal(true);

        dispatch(setSelectedContractor(contractor));
    }

    const deleteContractorModal = () => {
        return (
            <Modal
                size='lg'
                centered
                show={showDeleteModal}
                onHide={cancelDeletion}
            >
                <Modal.Body>
                    <div className='page-title'>Delete Contractor</div>
                    <div className='d-flex justify-content-center'>
                        Are you sure you want to delete this contractor?
                    </div>
                    <div className='d-flex justify-content-center pt-5'>
                        <Button
                            onClick={cancelDeletion}
                            variant='link'
                            className='cancel'
                        >
                            Cancel
                        </Button>
                        <button
                            className='primary-gray-btn next-btn ml-3'
                            onClick={handleDeleteContractor}
                        >
                            Delete
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    const handleCloseContractorModal = () => {
        dispatch(setSelectedContractor({}));
        setShowContractorModal(false);
    }

    // const getContractorCategories = (contractorCategories) => {
    //     return contractorCategories.map((category) => {
    //         return `${category.Name} `;
    //     })
    // }

    const handleFavorite = (contractor) => {
        if(!isFavoriteLoading){
            setIsFavoriteLoading(true)
            dispatch(updateIsFavorite(contractor, !contractor?.IsFavorite))
            .then(() => {
                setIsFavoriteLoading(false)
            });
        }
    }

    const handleContractors = (contractorTypeID) => {
        const contractorsByType = filteredContractors.filter((contractor) => {
            return contractor.ContractorTypes.find((type) => type.ID === contractorTypeID);
        });

        if (contractorsByType.length > 0) {
            return contractorsByType;
        }
        return [];
    }

    return (
        <div className='d-flex contractor-management'>
            <div className='contractor-management-container'>
                <div className='d-flex'>
                    <div className='page-title'>Contractor Management</div>
                    <div className='ml-2'>
                        <Button
                            variant='link'
                            className='link-btn'
                            onClick={() => setShowContractorModal(true)}
                        >
                            + Add Contractor
                        </Button>
                    </div>

                    <div className='d-flex search-bar'>
                        <Form inline>
                            <FormControl
                                placeholder='Search Keywords'
                                type='text'
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form>
                    </div>
                </div>
                {isLoading ? (
                    <div className='d-flex justify-content-center pt-5'>
                        <Spinner
                            animation='border'
                            variant='primary'
                        />
                    </div>
                ) : (
                    <div className='contractor-management-table'>
                        <ContractorTable
                            contractorTypes={contractorTypes}
                            isLoading={isLoading}
                            editContractor={editContractor}
                            selectedContractorID={selectedContractorID}
                            handleContractors={handleContractors}
                            deleteContractorConfirmation={deleteContractorConfirmation}
                            handleFavorite={handleFavorite}
                        />
                    </div>

                )}
            </div>

            {showContractorModal &&
                <AddContractor
                    show={showContractorModal}
                    handleClose={handleCloseContractorModal}
                />
            }
            {deleteContractorModal()}
        </div>
    )
}

const ContractorTable = ({
    isLoading,
    editContractor,
    selectedContractorID,
    deleteContractorConfirmation,
    handleContractors,
    contractorTypes,
    handleFavorite
}) => {

    return (

        <Table hover responsive>
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Contact Name</th>
                    <th>City/State</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Notes</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {contractorTypes?.map((type) => {
                    if (handleContractors(type?.ID)?.length > 0) {
                        return (
                            <>
                                <tr>
                                    <td colSpan={7} className="contractor-type-name">{type.Name}</td>
                                </tr>
                                {handleContractors(type?.ID).map((contractor, index) => (
                                    <tr key={index}>
                                        <td width='15%'>{contractor?.CompanyName}</td>
                                        <td>{contractor?.FirstName}</td>
                                        <td>{contractor?.City} {contractor?.State}</td>
                                        <td>
                                            <a href={`tel:+1${contractor?.PhoneNumber}`}>
                                                {contractor?.PhoneNumber}
                                            </a>
                                        </td>
                                        <td>
                                            <a href={`mailto:${contractor?.EmailAddress}`}>
                                                {contractor?.EmailAddress}
                                            </a>
                                        </td>
                                        <td>
                                            <ReactStars
                                                edit={false}
                                                value={contractor?.Rating ? contractor?.Rating : 0}
                                                size={15}
                                                count={5}
                                                color="#aaa"
                                                activeColor="#ffd700"
                                            />
                                        </td>
                                        <td className={`${contractor?.Notes && 'sticky-note-red'}`}>
                                            <OverlayTrigger
                                                placement='top'
                                                overlay={
                                                    <Tooltip id='button-tooltip'>
                                                        {contractor?.Notes}
                                                    </Tooltip>
                                                }
                                                delay={{ show: 250, hide: 400 }}
                                            >
                                                <i className='far fa-sticky-note d-flex justify-content-center'></i>
                                            </OverlayTrigger>
                                        </td>
                                        <td width='5%'>
                                            {(isLoading && selectedContractorID === contractor.ID) ? (
                                                <Spinner
                                                    size='sm'
                                                    className='justify-content-center d-flex'
                                                    animation='border'
                                                    variant='primary'
                                                />
                                            ) : (
                                                <div className='d-flex justify-content-between'>
                                                    <i
                                                        className={`text-danger ${contractor.IsFavorite ? 'fas fa-heart' : 'far fa-heart'}`}
                                                        onClick={() => handleFavorite(contractor)}
                                                    ></i>
                                                    <i
                                                        className='far fa-pencil-alt'
                                                        onClick={() => editContractor(contractor)}
                                                    ></i>
                                                    <i
                                                        className='far fa-trash-alt'
                                                        onClick={() => deleteContractorConfirmation(contractor.ID)}
                                                    ></i>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )
                    }
                    return null;
                })}

            </tbody>
        </Table>
    )
}

export default ContractorManagement;
