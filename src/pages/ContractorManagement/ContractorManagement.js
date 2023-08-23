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
import StarRatings from 'react-star-ratings';
import Select from 'react-select';
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
    const [contractor, setContractor] = useState({});

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


    const [Param] = useState(["CompanyName", "State", "FirstName", "LastName", "City"]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const filter = contractors?.filter((contractor) => {
                return Param.some(newItem => {

                    if (contractor[newItem]) {
                        return (
                            contractor[newItem].toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                        );
                    }

                })  
            }).filter(t => {
                    if (contractor.value) {

                        return t.ContractorTypes.find((type) => type.ID === contractor.value && type.Name === contractor.label)
                    } else { return t }
                })
            setFilteredContractors(filter)
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm, contractors, contractor]);

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
        if (!isFavoriteLoading) {
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
            if (contractor.value === contractorTypeID) {
                return contractorsByType.map(type => {
                    return {
                        ...type,
                        ContractorTypes:type.ContractorTypes.filter((typ) => typ.ID === contractor.value)}
                })
            }
            if(!Object.keys(contractor).length){
                return contractorsByType;
            }
        }
        return [];
    }


    return (
        <div className='d-flex contractor-management'>
            <div className='contractor-management-container'>
                <div className='d-flex justify-content-between pr-2 '>
                    <div className="d-flex flex-wrap">
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
                    </div>

                    <div className='d-flex'>
                        <Form inline className='search-bar'>
                            <Form.Group className='contractor-type'>
                                <Select
                                    // isMulti
                                    isClearable={true}
                                    placeholde="Contractor Type"
                                    options={
                                        contractorTypes?.map((contractor, index) => {
                                            return { value: contractor.ID, label: contractor.Name }
                                        })
                                    }
                                    onm
                                    value={contractor.ContractorTypes}
                                    onChange={(options) => setContractor(options ? options : {})}
                                />
                            </Form.Group>
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
                            SelectedcontractorType={contractor}
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
    SelectedcontractorType,
    deleteContractorConfirmation,
    handleContractors,
    contractorTypes,
    handleFavorite
}) => {
    
    return (

        <Table hover responsive>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {contractorTypes?.map((type) => {
                    if (handleContractors(type?.ID)?.length > 0) {
                       return (
                                <>
                                    <tr className="contractor-type-row">
                                        <td colSpan={7} className="contractor-type-name">{type.Name}</td>
                                    </tr>
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
                                    {handleContractors(type?.ID).map((contractor, index) => {

                                        return (
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
                                                    <div className="star-ratings">
                                                        <StarRatings
                                                            rating={contractor?.Rating ? contractor?.Rating : 0}
                                                            starRatedColor="#ffd700"
                                                            starSpacing="0"
                                                            numberOfStars={5}
                                                            starDimension="12px"
                                                            name='rating'
                                                            starEmptyColor="#aaa"
                                                        />
                                                    </div>

                                                </td>
                                                <td className={`${contractor?.Notes && 'sticky-note-red'}`}>
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip id='button-tooltip'>
                                                                {contractor?.Notes ? contractor?.Notes : "No Notes"}
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
                                                                className={`${contractor.IsFavorite ? 'fas fa-heart' : 'far fa-heart'}`}
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
                                        )
                                    })}
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
