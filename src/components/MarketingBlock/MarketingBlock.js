import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogos } from '../../actions/projectActions.js';
import './MarketingBlock.scss';

const MarketingBlock = () => {
    const dispatch = useDispatch();
    const logos = useSelector(state => state.project.logos);
    const [fadeProp, setFadeProp] = useState({fade:'fade-in '});
    useEffect(() => {
        const timer = setTimeout(
            () =>{
                
                if (fadeProp.fade === 'fade-in') {
                    setFadeProp({
                         fade: 'fade-out'
                    })
                    
                 } 
                 dispatch(getLogos())
            } ,
            10000
          );
          return () => clearTimeout(timer);
    });

    useEffect(() => {
        const timer = setTimeout(
            () =>{
                if (fadeProp.fade === 'fade-out') {
                    setFadeProp({
                         fade: 'fade-in'
                    })
                   
                }
            } ,
            2000
          );
          return () => clearTimeout(timer);
    },[fadeProp]);
    
    

    console.log("looooogooo1111", logos)

    return (
        
        <div className='marketing-block'>
            <div className='marketing-block-body p-3 justify-content-center'>
                {logos?.map((logo, index) => (
                    <div className={`border border-secondary p-1 mb-2 ${fadeProp.fade}`}>
                        <img src={logo} className='img-fluid'/>
                    </div>
                    
                ))}
                
            </div>
        </div>
    );
}

export default MarketingBlock;