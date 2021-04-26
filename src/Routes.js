import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Project = lazy(() => import('./pages/Project'));

const Routes = (props) => {

    return (
        <Suspense fallback={<h1>Page is Loading...</h1>}>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/project' exact component={Project} />
            </Switch>
        </Suspense>
    )
}

export default Routes;