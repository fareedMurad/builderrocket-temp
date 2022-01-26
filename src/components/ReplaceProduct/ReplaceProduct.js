import React, { useEffect, useState, useRef } from 'react';
import {
    setProduct,
    getCategories,
    setCategories,
    searchProducts,
    setProductDetail,
    setProducts,
    setSelectedProductTab,
    getReplaceProduct,
    replaceProductService
} from '../../actions/productActions';
import { handleProductForProject } from '../../actions/projectActions';
import { Button, Form, Table, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './ReplaceProduct.scss';
import { useHistory } from 'react-router';

// components 
import ProductModal from '../ProductModal';
import testUtils from 'react-dom/test-utils';

const ReplaceProduct = () => {
    const dispatch = useDispatch();
    const history = useHistory()

    const product = useSelector(state => state.product.product);
    const project = useSelector(state => state.project.project);
    const replaceProduct = useSelector(state => state.product.replaceProduct);
    const products = useSelector(state => state.product.products);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const productCategories = useSelector(state => state.product.productCategories);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenLightBox, setOpenLightBox] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)
    const [lightBoxImages, setLightBoxImages] = useState([])
    const [searchObject, setSearchObject] = useState({
        CategoryID: '',
        ModelName: null,
        Description: null,
        Filter: null,
        CustomFilters: {}
    });

    const productRef = useRef();
    const searchRef = useRef('');
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
        }
    }, [dispatch]);

    useEffect(() => {
        if (isEmpty(productCategoriesRef.current))
            dispatch(getCategories(productRef.current?.CategoryID));
    }, [dispatch]);

    useEffect(() => {
        if (productRef.current?.CategoryID) {
            dispatch(searchProducts(productRef.current?.CategoryID))
                .then(setIsLoading(false))
                .catch(setIsLoading(false));
        } else {
            dispatch(searchProducts())
                .then(setIsLoading(false))
                .catch(setIsLoading(false));
        }
    }, [dispatch, product]);

    const onProductCategoryChange = (productCategoryID) => {
        if (!productCategoryID) return;

        dispatch(setProduct({
            ...product,
            CategoryID: parseInt(productCategoryID)
        }));
    }

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
            CustomFilters: updatedFilters
        }

        dispatch(searchProducts(product?.CategoryID, search));
        setSearchObject(search);
    }

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
    }

    const Category = ({ category, type }) => {
        return (
            <option value={category?.ID} dangerouslySetInnerHTML={{ __html: category?.Name }}></option>
        )
    }

    const handleSelectedProductDetails = (productDetail) => {
        dispatch(setProductDetail(productDetail))
            .then(() => {
                history.push(`/project/${project.ProjectNumber}/product/productDetail`)
            });
    }

    const handleSearch = () => {
        const updatedSearch = {
            ...searchObject,
            Filter: searchRef.current.value
        }

        dispatch(searchProducts(productRef.current?.CategoryID, updatedSearch));
        setSearchObject(updatedSearch);
    }

    const handleGoToProducts = () => {
        history.push(`/project/${project.ProjectNumber}/products`)
    }

    const includedRooms = (ProductID) => {
        let roomIds = []
        project?.ProjectRooms?.map(room => {
            room?.Items?.map(item => {
                return item?.ProductID === ProductID ? !roomIds.includes(room?.ID) && roomIds.push(room?.ID) : item
            })
        })

        return roomIds;
    }

    const handleReplaceProduct = (ID, ProductID) => {
        
        if (includedRooms(ProductID).length < 2) {
            dispatch(replaceProductService(project?.ID, {
                OldProductID: product?.TemplateItemID,
                NewProductID: ID,
                ProjectRoomIDs: includedRooms(ProductID)
            }))
        } else {
            dispatch(getReplaceProduct(ID))
                .then(() => {
                    setShowModal(true)
                })
        }

    }

    return (
        <div className='add-product-container'>
            <div className='d-flex'>
                <div>
                    <Button
                        variant='link'
                        className='link-btn'
                        onClick={handleGoToProducts}
                    >
                        Products /
                    </Button>
                </div>
                <div className='page-title'>Replace Products - {selectedRoom?.RoomName}</div>
            </div>

            <div className='filter-section'>
                <div className='d-flex flex-wrap'>
                    <div className='mr-3'>
                        <Form.Control
                            as='select'
                            value={product?.CategoryID}
                            onChange={(event) => onProductCategoryChange(event.target.value)}
                        >
                            <option value=''>Select Category</option>

                            {productCategories?.map((category) => (
                                <Category
                                    key={category.ID}
                                    category={category}
                                />
                            ))}
                        </Form.Control>
                    </div>
                    <div className='d-flex'>
                        <Form.Control
                            placeholder='Search Keywords'
                            ref={searchRef}
                        >
                        </Form.Control>
                        <Button
                            onClick={handleSearch}
                            className='primary-gray-btn search-btn ml-3'
                        >
                            Search
                        </Button>
                        <Button
                            variant='link'
                            className='cancel ml-3'
                            onClick={handleGoToProducts}
                        >
                            Cancel
                        </Button>
                    </div>
                    <div>
                    </div>
                </div>
                <div className='d-flex qty-items-select justify-content-end'>
                    <Form.Control as='select'>
                        <option>25</option>
                    </Form.Control>
                    <div className='select-text'>Items Per Page</div>
                </div>
            </div>

            <div className='add-products-body d-flex'>
                <div className='checkbox-filter'>
                    {products?.CustomFilters && Object.keys(products?.CustomFilters)?.reverse()?.map((filter, index) => (
                        <div
                            key={index}
                            className='mt-3 mb-5'
                        >
                            <div className='bold-text mb-3'>{filter}</div>

                            {products?.CustomFilters?.[filter]?.map((filterChild, childIndex) => (
                                <Form.Check
                                    key={childIndex}
                                    type='checkbox'
                                    className='mt-2'
                                    label={filterChild?.Name}
                                    value={filterChild?.IsChecked}
                                    onClick={() => handleFilters(filter, filterChild, childIndex)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <div className='add-product-table'>
                    {isLoading ? (
                        <div className='add-products-spinner d-flex justify-content-center'>
                            <Spinner
                                animation='border'
                                variant='primary'
                            />
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
                                            <img
                                                alt='product'
                                                width='50'
                                                height='50'
                                                style={{ cursor: "pointer" }}
                                                src={product?.ThumbnailURL}
                                                onClick={() => {
                                                    setLightBoxImages([product?.ThumbnailURL])
                                                    setOpenLightBox(true)
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <div className='add-btn-product-details'>
                                                <Button
                                                    variant='link'
                                                    className='link-btn item-button'
                                                    onClick={() => handleSelectedProductDetails(product)}
                                                >
                                                    {product?.ProductName}
                                                </Button>

                                                <div className='d-flex mt-2'>
                                                    <div className='model-number'>
                                                        Model: {product?.ModelNumber}
                                                    </div>
                                                    <div>
                                                        Part:
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product?.ModelNumber}</td>
                                        <td>{product?.ColorFinish}</td>
                                        <td>
                                            <div className='distributor-select'>
                                                <Form.Control as='select'>
                                                </Form.Control>
                                                <div>Available from x vendors</div>
                                            </div>
                                        </td>
                                        <td>${product?.MSRP}</td>
                                        <td>
                                            <i className={`far ${true ? 'fa-heart' : 'fas-heart'}`}></i>
                                        </td>
                                        <td>
                                            <Button
                                                className='add-product-btn'
                                                onClick={() => handleReplaceProduct(product.ID, product?.ProductID)}
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

            <div className='d-flex justify-content-center p2-5'>
                <Button
                    variant='link'
                    className='cancel'
                    onClick={handleGoToProducts}
                >
                    Cancel
                </Button>
            </div>

            {showModal && <ProductModal
                show={showModal}
                handleClose={handleClose}
                handleCloseModal={() => setShowModal(false)}
            />}
            {isOpenLightBox && (
                <Lightbox
                    mainSrc={lightBoxImages[photoIndex]}
                    nextSrc={lightBoxImages[(photoIndex + 1) % lightBoxImages.length]}
                    prevSrc={lightBoxImages[(photoIndex + lightBoxImages.length - 1) % lightBoxImages.length]}
                    onCloseRequest={() => setOpenLightBox(false)}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + lightBoxImages.length - 1) % lightBoxImages.length)}
                    onMoveNextRequest={() => setPhotoIndex(((photoIndex + 1) % lightBoxImages.length))}
                />
            )}
        </div>
    );
}

export default ReplaceProduct;