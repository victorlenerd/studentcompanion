import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from '../ducks/index';

const loggerMiddleware = createLogger()

const middleware = [thunkMiddleware];

const store = compose(
  applyMiddleware(...middleware)
)(createStore)(reducers);

export default store;
