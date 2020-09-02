import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import store, { history } from './store';
import routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css';

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      { routes() }
    </Router>
  </Provider>, document.getElementById('root')
);
