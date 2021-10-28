import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import './ProductDetail.scss';

const ProductDetail = ( ) => {

    const productDetails = useSelector(state => state.product.productDetails);

    return (
        <div className='d-flex product-detail'>
            <div className='d-flex'>
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

            <div className='d-flex'>
                <div>

                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default ProductDetail;