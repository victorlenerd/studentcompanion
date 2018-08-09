import { AsyncStorage } from 'react-native';
import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const NOTES = 'NOTES';
const SET_CURRENT_NOTE = 'SET_CURRENT_NOTE';
const REMOVE_NOTE = 'REMOVE_NOTE';

const initialState = {
  currentNote: {},
  notes: {}
};

export const SetNotes = (courseId, notes) => {
  return {
    type: NOTES,
    courseId,
    notes,
  };
};

export const GetNotes = courseId => (dispatch, getState) => new Promise((resolve, reject) => {
  const { notesState: { notes } } = getState();

  if (notes[courseId]) {
    resolve(notes[courseId]);
    dispatch(FinishRequest());
    return;
  }

  const notesRef = app
    .database()
    .ref('/notes')
    .equalTo(courseId)
    .orderByChild('courseId');

  dispatch(StartRequest());

  notesRef.once('value', snapshot => {
    const courseNotes = toArray(snapshot.val()) || [];
    dispatch(SetNotes(courseId, courseNotes));
    resolve(courseNotes);
    dispatch(FinishRequest());
  });
});

export const GetNotesOffline = courseId => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const { notesState: { notes } } = getState();
  dispatch(StartRequest());

  if (notes[courseId]) {
    resolve(notes[courseId]);
    dispatch(FinishRequest());
    return;
  }

  try {
    const saved_notes = await AsyncStorage.getItem(`@UPQ:OFFLINE_NOTES:ID_${courseId}`);
    if (saved_notes !== null) {
      dispatch(SetNotes(courseId, JSON.parse(saved_notes)));
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

export const RemoveNoteOffline = courseId => dispatch => new Promise(async (resolve, reject) => {
  dispatch(StartRequest());
  try {
    await AsyncStorage.removeItem(`@UPQ:OFFLINE_NOTES:ID_${courseId}`);
    dispatch({ type: REMOVE_NOTE, courseId });
    resolve();
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
    case NOTES: {
      const { courseId, notes } = action;
      const oldNotes = state.notes;
      const newNotes = Object.assign({}, oldNotes, {
        [courseId]: notes
      });

      return Object.assign({}, state, {
        notes: newNotes
      });
    }

    case REMOVE_NOTE: {
      const { courseId } = action;
      const { notes } = state;
      delete notes[courseId];
      return notes;
    }

    case SET_CURRENT_NOTE:
      return Object.assign({}, state, {
        currentNote: action.note,
      });
    default:
      break;
  }

  return state;
};
