import React, { useEffect, useRef, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, setSelectedProductTab } from '../../actions/productActions';
import { handleProductForProject } from '../../actions/projectActions';
import './ProductDetail.scss';
import { useHistory } from 'react-router'

const ProductDetail = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const product = useSelector(state => state.product.product);
    const project = useSelector(state => state.project.project);
    const selectedRoom = useSelector(state => state.room.selectedRoom);
    const productDetail = useSelector(state => state.product.productDetail);
    const ProductSelectedRoom = useSelector(state => state.room.ProductSelectedRoom);
    const [isLoading, setIsLoading] = useState(true);

    const productDetailRef = useRef();

    useEffect(() => {
        productDetailRef.current = productDetail;
    }, [productDetail]);

    useEffect(() => {
        dispatch(getProductDetails(productDetailRef.current?.ID))
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    }, [dispatch]);

    const handleNavigation = (selectedTab) => {
        history.push(`/project/${project.ProjectNumber}/product/${selectedTab}`)
    }

    const addProduct = () => {
        if (!productDetailRef.current?.ID || !selectedRoom.ID || !ProductSelectedRoom.length) return;

        let newProduct
        if(product && product.TemplateItemID ){

            newProduct = [
                {
                ...product,
                ProductID: productDetailRef.current?.ID,
                ProjectRoomID: selectedRoom.ID
            }
        ]

        }else{
            const GetRoomId = project?.ProjectRooms.filter(b => ProductSelectedRoom.indexOf(b.ID) > -1)
            if (GetRoomId.length) {
                newProduct = GetRoomId.map(list=>{ return { ProductID: productDetailRef.current?.ID,ProjectRoomID: list.ID  } })
            } else {
                newProduct = [{
                    ...product,
                    ProductID: productDetailRef.current?.ID,
                    ProjectRoomID: selectedRoom.ID
                }]
            }
        }

        delete newProduct.CategoryID

        dispatch(handleProductForProject(newProduct))
            .then(
                history.push(`/project/${project.ProjectNumber}/products`)
            );
    }

    return (
        <div className='product-detail'>
            <div className='d-flex title'>
                <div>
                    <Button
                        variant='link'
                        className='link-btn'
                        onClick={() => handleNavigation('products')}
                    >
                        Products /
                    </Button>
                </div>
                <div>
                    <Button
                        variant='link'
                        className='link-btn'
                        onClick={() => handleNavigation('addProduct')}
                    >
                        Add Product /
                    </Button>
                </div>
                <div>
                    <Button
                        variant='link'
                        className='link-btn'
                    // onClick={() => handleShow(false)}
                    >
                        Products
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className='spinner d-flex justify-content-center'>
                    <Spinner
                        animation='border'
                        variant='primary'
                    />
                </div>
            ) : (
                <div className='d-flex justify-content-between details-container'>
                    <div className='details-image'>
                        <img
                            alt='product details'
                            src={productDetail?.ThumbnailURL}
                        />
                    </div>
                    <div className='details'>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <div className='details-title'>{productDetail?.ProductName}</div>
                                <div className='description'>{productDetail?.ShortDescription}</div>
                            </div>
                            <button
                                className='add-button'
                                onClick={addProduct}
                            >
                                Add to Project
                            </button>
                        </div>
                        <div className='mt-5 d-flex justify-content-between'>
                            <div className='sub-details'>
                                <div>Item #</div>
                                <div>Model #{productDetail?.ModelNumber}</div>
                            </div>
                            <div>${productDetail?.MSRP} {productDetail?.UnitOfSale}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetail;