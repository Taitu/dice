import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Bets from './components/bets'
import Main from './components/main'

const routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={ Main }/>
        <Route exact path='/bets' component={ Bets }/>
      </Switch>
    </BrowserRouter>
    );
};

export default routes;