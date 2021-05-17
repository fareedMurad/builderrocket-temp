import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import ('./pages/Login'));
const Project = lazy(() => import('./pages/Project'));
const UtilityManagement = lazy(() => import('./pages/UtilityManagement'));

const Routes = (props) => {

    return (
        <Suspense fallback={<h1>Page is Loading...</h1>}>
            <Switch>
                    <Route path='/' exact component={Home} />
                    <Route exact path='/login' component={Login} /> 
                    <Route exact path='/project' component={Project} />
                    <Route path='/project/:project' component={Project} />
                    <Route path='/utility-management' component={UtilityManagement} />
            </Switch>
        </Suspense>
    )
}

export default Routes;