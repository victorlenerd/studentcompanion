import { AsyncStorage } from 'react-native';
import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const NOTES = 'NOTES';
const SET_CURRENT_NOTE = 'SET_CURRENT_NOTE';

const initialState = {
  currentNote: {},
  notes: [],
};

export const SetNotes = notes => {
  return {
    type: NOTES,
    notes,
  };
};

export const GetNotes = courseId => dispatch => new Promise((resolve, reject) => {
  const notesRef = app
    .database()
    .ref('/notes')
    .equalTo(courseId)
    .orderByChild('courseId');

  dispatch(StartRequest());
  notesRef.once('value', snapshot => {
    dispatch(SetNotes(toArray(snapshot.val())));
    resolve(toArray(snapshot.val()));
    dispatch(FinishRequest());
  });
});

export const GetNotesOffline = courseId => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  try {
    const saved_notes = await AsyncStorage.getItem(`@UPQ:OFFLINE_NOTES:ID_${courseId}`);
    if (saved_notes !== null) {
      dispatch(SetNotes(JSON.parse(saved_notes)));
      resolve(JSON.parse(saved_notes));
    }
  } catch (err) {
    resolve([]);
  }

  dispatch(FinishRequest());
});

export const SaveNotesOffline = (courseId, notes) => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  try {
    await AsyncStorage.setItem(`@UPQ:OFFLINE_NOTES:ID_${courseId}`, JSON.stringify(notes));
    resolve(notes);
  } catch (err) {
    reject(err);
  }
  dispatch(FinishRequest());
});

export const SetCurrentNote = note => {
  return {
    type: SET_CURRENT_NOTE,
    note,
  };
};

export const NotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTES:
      return Object.assign({}, state, {
        notes: action.notes,
      });
    case SET_CURRENT_NOTE:
      return Object.assign({}, state, {
        currentNote: action.note,
      });
    default:
      break;
  }

  return state;
};
