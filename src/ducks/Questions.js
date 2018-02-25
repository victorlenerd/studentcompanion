import { AsyncStorage } from 'react-native';
import app, { toArray } from 'shared/firebase';
import filter from 'lodash/filter';

import { StartRequest, FinishRequest } from './request';

const QUESTIONS = 'QUESTIONS';
const SET_CURRENT_QUESTION = 'SET_CURRENT_QUESTION';

const initialState = {
  currentQuestion: {},
  questions: {},
};

export const SetQuestions = questions => {
  return {
    type: QUESTIONS,
    questions,
  };
};

export const GetQuestions = paperId => (dispatch, getState) => new Promise((resolve, reject) => {
  const questionsRef = app
    .database()
    .ref('/questions')
    .equalTo(paperId)
    .orderByChild('paperId');

  dispatch(StartRequest());
  questionsRef.on('value', snapshot => {
    questionsRef.off();
    dispatch(SetQuestions(toArray(snapshot.val())));
    dispatch(FinishRequest());
    resolve();
  });
});

export const GetQuestionsOffline = (courseId, paperId) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  try {
    const saved_questions = await AsyncStorage.getItem(`@UPQ:OFFLINE_QUESTIONS:ID_${courseId}`);
    if (saved_questions !== null) {
      const questions = JSON.parse(saved_questions);
      dispatch(SetQuestions(filter(questions, question => (question.paperId === paperId))));
      resolve(JSON.parse(saved_questions));
    } else {
      resolve([]);
    }
  } catch (err) {
    resolve([]);
  }

  dispatch(FinishRequest());
});

export const SaveQuestionsOffline = courseId => dispatch => new Promise((resolve, reject) => {
  dispatch(StartRequest());
  const questionsRef = app
    .database()
    .ref('/questions')
    .equalTo(courseId)
    .orderByChild('courseId');

  questionsRef.once('value', async snapshot => {
    const questions = JSON.stringify(toArray(snapshot.val())) || '';
    try {
      await AsyncStorage.setItem(`@UPQ:OFFLINE_QUESTIONS:ID_${courseId}`, questions);
      resolve(questions);
    } catch (err) {
      reject(err);
    }
    dispatch(FinishRequest());
  });
});

export const SetCurrentQuestion = question => {
  return {
    type: SET_CURRENT_QUESTION,
    question,
  };
};

export const QuestionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case QUESTIONS:
      return Object.assign({}, state, {
        questions: action.questions,
      });
    case SET_CURRENT_QUESTION:
      return Object.assign({}, state, {
        currentQuestion: action.question,
      });
    default:
      break;
  }

  return state;
};
