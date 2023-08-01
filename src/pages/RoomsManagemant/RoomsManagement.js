import React, { useEffect, useState } from 'react';
import {
    Form,
    Modal,
    Table,
    Button,
    Spinner,
    FormControl,
} from 'react-bootstrap';
import { deleteUtility, getUtilities, setSelectedUtility, updateIsFavorite } from '../../actions/utilityActions';
import { useDispatch, useSelector } from 'react-redux';
import './RoomsManagement.scss';

// components 
import AddUtility from '../../components/AddUtility';
import RoomsTabs from '../../components/RoomsTabs/RoomsTabs';

const RoomsManagement = () => {
    const dispatch = useDispatch();

    const utilities = useSelector(state => state.utility.utilities);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isIsFavoriteLoading, setIsIsFavoriteLoading] = useState(false);
    const [selectedUtilityID, setSelectedUtilityID] = useState();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUtilityModal, setShowUtilityModal] = useState(false);
    const [filteredUtilities, setFilteredUtilities] = useState(utilities);

    // useEffect(() => {
    //     dispatch(getUtilities());
    // }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const filter = utilities?.filter(utility =>
                utility?.CompanyName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                utility?.UtilityType?.Name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                utility?.PhoneNumber?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                utility?.Region?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                utility?.EmailAddress?.toLowerCase().includes(searchTerm?.toLowerCase())
            );

            setFilteredUtilities(filter);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, utilities]);

    const handleDeleteUtility = () => {
        setIsLoading(true);

        dispatch(deleteUtility(selectedUtilityID))
            .then(() => {
                dispatch(getUtilities());
            })
            .then(() => {
                setIsLoading(false);
                setShowDeleteModal(false);
            })
    }

    const deleteUtilityConfirmation = (utilityID) => {
        setSelectedUtilityID(utilityID);

        setShowDeleteModal(true);
    }

    const cancelDeletion = () => {
        setSelectedUtilityID();

        setShowDeleteModal(false);
    }

    const editUtillity = (utility) => {
        setShowUtilityModal(true);

        dispatch(setSelectedUtility(utility));
    }

    const handleAddUtility = () => {
        dispatch(setSelectedUtility({}))
            .then(() => {
                setShowUtilityModal(true);
            });
    }

    const handleFavorite = (utility) => {
        if (!isIsFavoriteLoading) {
            setIsIsFavoriteLoading(true)
            dispatch(updateIsFavorite(utility, !utility?.IsFavorite))
                .then(() => {
                    setIsIsFavoriteLoading(false)
                });
        }
    }


    const deleteUtilityModal = () => {
        return (
            <Modal
                show={showDeleteModal}
                onHide={cancelDeletion}
                centered
                size='lg'
            >
                <Modal.Body>
                    <div className='page-title'>Delete Utility</div>
                    <div className='d-flex justify-content-center'>
                        Are you sure you want to delete this utility?
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
                            onClick={handleDeleteUtility}
                        >
                            Delete
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <div className=' room-management'>
            <div className='page-title'>Rooms Management</div>
            <RoomsTabs />
            {showUtilityModal && (
                <AddUtility
                    show={showUtilityModal}
                    handleClose={() => setShowUtilityModal(false)}
                />
            )}
            {deleteUtilityModal()}
        </div>
    );
}

export default RoomsManagement;