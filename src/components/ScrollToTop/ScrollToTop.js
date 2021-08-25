import React, { useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ScrollToTop = ({ children }) => {
    const history = useHistory();

    const selectedProjectTab = useSelector(state => state.project.selectedProjectTab);

    useEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });

        return () => {
            unlisten();
        }
    }, [history]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedProjectTab]);

    return <Fragment>{children}</Fragment>;
}

export default ScrollToTop;