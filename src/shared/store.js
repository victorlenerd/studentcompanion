import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from 'ducks/index';

import logger from 'redux-logger';

const middleware = [thunkMiddleware];

const store = compose(applyMiddleware(...middleware))(createStore)(reducers);

export default store;
