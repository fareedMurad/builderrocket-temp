import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

    return (
        <Suspense fallback={<h1>Page is Loading...</h1>}>
            <Switch>
                    <Route path='/' exact component={Home} />
                    <Route exact path='/login' component={Login} /> 
                    <Route exact path='/project' component={Project} />
                    <Route path='/project/:project' component={Project} />
                    <Route path='/utility-management' component={UtilityManagement} />
                    <Route path='/contractor-management' component={ContractorManagement} />
            </Switch>
        </Suspense>
    )
}

export default Routes;