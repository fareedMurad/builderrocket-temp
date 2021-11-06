import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import './ProductDetail.scss';

const ProductDetail = ( ) => {

    const productDetail = useSelector(state => state.product.productDetail);
    console.log('product detail', productDetail);

    return (
        <div className='product-detail'>
            <div className='d-flex title'>
                <div>
                    <Button 
                        variant='link' 
                        className='link-btn'
                        // onClick={() => handleShow(false)}
                    >
                        Products /
                    </Button>
                </div>  
                <div>
                    <Button 
                        variant='link' 
                        className='link-btn'
                        // onClick={() => handleShow(false)}
                    >
                        Products /
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

            <div className='d-flex justify-content-between details-container'>
                <div className='details-image'>
                    <img
                        alt='product details' 
                        src={productDetail?.ThumbnailURL}
                    />
                </div>
                <div className='details'>
                    <div className='details-title'>{productDetail?.ProductName}</div>

                    <div className='description'>{productDetail?.ShortDescription}</div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;