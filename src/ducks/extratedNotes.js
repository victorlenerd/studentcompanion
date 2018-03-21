import omit from 'lodash/omit';
import {
  AsyncStorage
} from 'react-native';

const SET_NOTES = 'SET_NOTES';
const ADD_NOTE = 'ADD_NOTE';
const UPDATE_NOTE = 'UPDATE_NOTE';
const REMOVE_NOTE = 'REMOVE_NOTE';

const initialState = {
  notes: {},
  currentNote: null
};

const generateId = () => {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  return `${Math.floor(Math.random() * 9)}${alpha.charAt(Math.floor(Math.random() * 25))}${Math.floor(Math.random() * 25)}${alpha.charAt(Math.floor(Math.random() * 25))}${Math.floor(Math.random() * 9)}${alpha.charAt(Math.floor(Math.random() * 25))}`;
};

const objToArr = obj => {
  let results = [];
  const keys = Object.keys(obj);
  results = keys.map(key => {
    return Object.assign({}, obj[key], { id: key });
  });
  return results;
};

export const AddNote = note => async dispatch => {
  const id = generateId();
  note.id = id;

  dispatch({
    type: ADD_NOTE,
    noteId: id,
    note
  });

  dispatch(SaveNotes());
};

export const UpdateNote = note => async dispatch => {
  dispatch({
    type: UPDATE_NOTE,
    note
  });

  dispatch(SaveNotes());
};

export const RemoveNote = noteId => async dispatch => {
  dispatch({
    type: REMOVE_NOTE,
    noteId
  });

  dispatch(SaveNotes());
};

export const SaveNotes = () => (dispatch, getState) => {
  const { notes } = getState();
  AsyncStorage.setItem('@UPQ:EXTRACTED_NOTES', JSON.stringify(notes));
};


export const LoadNotes = () => async (dispatch, getState) => Promise(async (resolve, reject) => {
  const notesStr = await AsyncStorage.getItem('@UPQ:EXTRACTED_NOTES');
  const notes = JSON.parse(notesStr);
  const notesArr = objToArr(notes);
  resolve(notesArr);
  dispatch({
    type: SET_NOTES,
    notes
  });
});

export const ExtractedNotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTES:
      return { notes: action.notes };
    case ADD_NOTE:
      return Object.assign({}, state, { notes: { [action.noteId]: action.note } });
    case UPDATE_NOTE: {
      const note = state.notes[action.noteId];
      note.body = action.body;
      const notes = Object.assign({}, state.notes, note);
      return Object.assign({}, state, { notes });
    }
    case REMOVE_NOTE: {
      const notes = omit(state.notes, action.noteId);
      return Object.assign({}, state, { notes });
    }
    default:
      break;
  }

  return state;
};
