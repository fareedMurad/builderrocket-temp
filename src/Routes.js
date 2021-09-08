import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import ('./pages/Login'));
const Project = lazy(() => import('./pages/Project'));
const UtilityManagement = lazy(() => import('./pages/UtilityManagement'));
const ContractorManagement = lazy(() => import('./pages/ContractorManagement'));

const Routes = (props) => {
    const history = useHistory();

    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        if (!token) 
            history.push('/login');
    });

    const Loading = () => {
        return (
            <div 
                style={{ marginTop: '15rem' }} 
                className='d-flex justify-content-center'
            >
                <Spinner 
                    animation='border'
                    variant='primary' 
                />
            </div>
        );
    }

    return (
        <Suspense fallback={<Loading />}>
            <ScrollToTop>
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route exact path='/login' component={Login} /> 
                    <Route exact path='/project' component={Project} />
                    <Route path='/project/:project' component={Project} />
                    <Route path='/utility-management' component={UtilityManagement} />
                    <Route path='/contractor-management' component={ContractorManagement} />
                </Switch>
            </ScrollToTop>
        </Suspense>
    )
}

export default Routes;