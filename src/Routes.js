import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useSelector,useDispatch } from 'react-redux';
import { SET_CUSTOMER_PROJECT } from './actions/types';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import ('./pages/Login'));
const Signup = lazy(() => import ('./pages/Signup'));
const Project = lazy(() => import('./pages/Project'));
const UtilityManagement = lazy(() => import('./pages/UtilityManagement'));
const ContractorManagement = lazy(() => import('./pages/ContractorManagement'));
const Customer = lazy(() => import('./pages/Customer'));
const CustomerSignup = lazy(() => import('./pages/Customer/Signup'));

const Routes = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const getpath= history.location.pathname
    const token = useSelector(state => state.auth.token);
    console.log(getpath);
    const path_array = getpath.split('/');
    console.log(path_array[1]);
    useEffect(() => {
        if(path_array[1]!=="customer"){
            if (!token) 
                history.push('/login');
        }else{
            dispatch({ type: SET_CUSTOMER_PROJECT, payload: path_array[2] });
        }
        
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
                    <Route path='/signup' component={Signup} /> 
                    <Route path='/project/:project/:tab' component={Project} />
                    <Route path='/utility-management' component={UtilityManagement} />
                    <Route path='/contractor-management' component={ContractorManagement} />
                    <Route path='/customer/signup/:id' component={CustomerSignup} />
                    <Route path='/customer' component={Customer} />
                    <Route path='/customer/:project' component={Customer} />
                    <Redirect to='/' />
                </Switch>
            </ScrollToTop>
        </Suspense>
    )
}

export default Routes;