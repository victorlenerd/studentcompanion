import { AsyncStorage } from 'react-native';
import app, { toArray } from 'shared/Firebase';
import { StartRequest, FinishRequest } from './Request';

const PAPERS = 'PAPERS';
const SET_CURRENT_PAPER = 'SET_CURRENT_PAPER';

const initialState = {
  currentPaper: {},
  papers: {},
};

export const SetPapers = (courseId, papers) => {
  return {
    type: PAPERS,
    courseId,
    papers,
  };
};

export const GetPapers = courseId => (dispatch, getState) => new Promise((resolve, reject) => {
  const { paperState: { papers } } = getState();
  const cached = papers[courseId];

  if (cached) return resolve(cached);

  dispatch(StartRequest());

  const papersRef = app
    .database()
    .ref('/papers')
    .equalTo(courseId)
    .orderByChild('courseId');

  papersRef.once('value', snapshot => {
    const coursePapers = toArray(snapshot.val()) || [];
    if (coursePapers.length > 0) dispatch(SetPapers(courseId, coursePapers));
    resolve(coursePapers);
    dispatch(FinishRequest());
  });
});

export const GetPapersOffline = courseId => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const { paperState: { papers } } = getState();
  const cached = papers[courseId];
  if (cached) return resolve(cached);

  dispatch(StartRequest());

  try {
    const saved_courses = await AsyncStorage.getItem(`@UPQ:OFFLINE_PAPERS:ID_${courseId}`);
    if (saved_courses !== null) {
      dispatch(SetPapers(courseId, JSON.parse(saved_courses)));
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
    case PAPERS: {
      const { courseId, papers } = action;
      return Object.assign({}, state, {
        papers: { [courseId]: papers },
      });
    }
    case SET_CURRENT_PAPER:
      return Object.assign({}, state, {
        currentPaper: action.paper,
      });
    default:
      break;
  }

  return state;
};
