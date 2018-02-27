import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
const SET_CURRENT_SEARCH_RESULTS = 'SET_CURRENT_SEARCH_RESULTS';

const initialState = {
  results: {},
  currentSearch: {}
};

export const SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS: {
      const { data, search } = action;
      return Object.assign({}, state, {
        results: { [search]: data },
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

export const SetResults = (data, search) => {
  return {
    type: SET_SEARCH_RESULTS,
    data,
    search
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
  if (results[search] && results[search].length > 0) {
    dispatch(SetCurrentSearchResults(results[search]));
    return resolve(results[search]);
  }

  dispatch(StartRequest());

  const courseRef = app.database().ref('/courses').orderByChild('name').startAt(search)
    .endAt(`${search}/uf8ff`);

  courseRef.once('value', snapshot => {
    const data = toArray(snapshot.val()) || [];
    dispatch(SetResults(data));
    dispatch(SetCurrentSearchResults(data));
    dispatch(FinishRequest());
    resolve(data);
  });

});
