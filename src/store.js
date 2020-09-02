import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers';
import loadInitialState from './loadInitialState';

export const history = createBrowserHistory();

const initialState = loadInitialState();
const enhancers = [];

const middleware = [
  thunk
];

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers)

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;
