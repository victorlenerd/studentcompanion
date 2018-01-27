import {
    NetInfo,
    AsyncStorage
} from 'react-native';

const NOTES = 'NOTES';
const SET_CURRENT_NOTE = 'SET_CURRENT_NOTE';

import app, { toArray } from '../shared/Firebase';
import {StartRequest, FinishRequest} from './Request';

let initialState = {
    currentNote: {},
    notes: []
}

export const SetNotes = ( notes )=> {
  return {
    type: NOTES,
    notes
  };
}

export const GetNotes = (courseId)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let notesRef = app.database().ref("/notes").equalTo(courseId).orderByChild("courseId");
            notesRef.once("value", (snapshot)=> {
                dispatch(SetNotes(toArray(snapshot.val())));
                resolve(toArray(snapshot.val()));
            });
        });
    }
}

export const GetNotesOffline = (courseId)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(`@UPQ:OFFLINE_NOTES:ID_${courseId}`)
            .then((saved_notes)=> {
                if (saved_notes !== null) {
                    dispatch(SetNotes(JSON.parse(saved_notes)));
                    resolve(JSON.parse(saved_notes));
                } else {
                    resolve([]);
                }
            })
        });
    }
}

export const SaveNotesOffline = (courseId, notes)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            AsyncStorage.setItem(`@UPQ:OFFLINE_NOTES:ID_${courseId}`, JSON.stringify(notes))
            .then(()=> {
                resolve(notes);
            })
            .catch((err)=> {
                reject(err);
            });
        });
    }
}

export const SetCurrentNote = ( note )=> {
  return {
    type: SET_CURRENT_NOTE,
    note
  };
}

export const NotesReducer = (state = initialState, action)=> {

    switch (action.type) {
        case NOTES:
            return Object.assign({}, state, {
                notes: action.notes
            });
        case SET_CURRENT_NOTE:
            return Object.assign({}, state, {
                currentNote: action.note
            });
        default:
            break;
    }

    return state;

}