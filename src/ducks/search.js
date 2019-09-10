import Fuse from 'fuse.js';
import app, { toArray } from 'shared/Firebase';
import { StartRequest, FinishRequest } from './Request';

const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
const SET_CURRENT_SEARCH_RESULTS = 'SET_CURRENT_SEARCH_RESULTS';

const initialState = {
  results: {},
  currentSearch: {}
};

export const SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS: {
      const { data } = action;
      return Object.assign({}, state, {
        results: data
      });
    }

    case SET_CURRENT_SEARCH_RESULTS:
      return Object.assign({}, state, {
        currentSearch: action.data,
      });
    default:
      break;
  }

  return state;
};

export const SetResults = data => {
  return {
    type: SET_SEARCH_RESULTS,
    data
  };
};

export const SetCurrentSearchResults = data => {
  return {
    type: SET_CURRENT_SEARCH_RESULTS,
    data
  };
};

export const Search = search => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const { searchState: { results } } = getState();
  const options = {
    keys: ['name', 'code', 'departmentName', 'universityName', 'facultyName'],
  };
  let fuse;
  let searchResults;

  if (results && results.length > 0) {
    fuse = new Fuse(results, options);
    searchResults = fuse.search(search);
    dispatch(SetCurrentSearchResults(searchResults));
    return resolve(searchResults);
  }

  dispatch(StartRequest());

  const courseRef = app.database().ref('/courses');

  courseRef.once('value', snapshot => {
    const data = toArray(snapshot.val()) || [];
    dispatch(SetResults(data));

    fuse = new Fuse(data, options);
    searchResults = fuse.search(search);

    dispatch(SetCurrentSearchResults(searchResults));
    dispatch(FinishRequest());
    resolve(searchResults);
  });
});
