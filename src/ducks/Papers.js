import { AsyncStorage } from 'react-native';
import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';


const PAPERS = 'PAPERS';
const SET_CURRENT_PAPER = 'SET_CURRENT_PAPER';

const initialState = {
  currentPaper: {},
  papers: [],
};

export const SetPapers = papers => {
  return {
    type: PAPERS,
    papers,
  };
};

export const GetPapers = courseId => dispatch => new Promise((resolve, reject) => {
  const papersRef = app
    .database()
    .ref('/papers')
    .equalTo(courseId)
    .orderByChild('courseId');

  dispatch(StartRequest());

  papersRef.once('value', snapshot => {
    dispatch(SetPapers(toArray(snapshot.val())));
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});

export const GetPapersOffline = courseId => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());

  try {
    const saved_courses = await AsyncStorage.getItem(`@UPQ:OFFLINE_PAPERS:ID_${courseId}`);
    if (saved_courses !== null) {
      dispatch(SetPapers(JSON.parse(saved_courses)));
      resolve(JSON.parse(saved_courses));
    }
    resolve([]);
  } catch (err) {
    resolve([]);
  }

  dispatch(FinishRequest());
});

export const SavePapersOffline = (courseId, papers) => dispatch => new Promise(async (resolve, reject) => {
  try {
    await AsyncStorage.setItem(`@UPQ:OFFLINE_PAPERS:ID_${courseId}`, JSON.stringify(papers));
    resolve(papers);
  } catch (err) {
    reject(err);
  }
});

export const SetCurrentPaper = paper => {
  return {
    type: SET_CURRENT_PAPER,
    paper,
  };
};

export const PapersReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAPERS:
      return Object.assign({}, state, {
        papers: action.papers,
      });
    case SET_CURRENT_PAPER:
      return Object.assign({}, state, {
        currentPaper: action.paper,
      });
    default:
      break;
  }

  return state;
};
