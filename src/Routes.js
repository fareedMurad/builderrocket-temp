import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));

const Routes = (props) => {

    return (
        <Suspense fallback={<h1>Page is Loading...</h1>}>
            <Switch>
                <Route path='/' exact component={Home} />
            </Switch>
        </Suspense>
    )
}

export default Routes;