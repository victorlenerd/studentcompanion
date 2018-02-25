import app, { toArray } from 'shared/firebase';
import { StartRequest, FinishRequest } from './request';

const initialState = {
  notesComments: {},
  papersComments: {}
};

const NOTES_COMMENTS = 'NOTES_COMMENTS';
const PAPERS_COMMENTS = 'PAPERS_COMMENTS';


export const SetComments = (type, typeId, comments) => (dispatch, getState) => new Promise((resolve, reject) => {
  const action = {
    type: `${type.toUpperCase()}S_COMMNETS`,
    comments
  };

  (type === 'note') ? action.noteId = typeId : action.paperId = typeId;

  dispatch(action);
});

export const GetComments = (type, typeId) => (dispatch, getState) => new Promise((resolve, reject) => {
  const { commentsState } = getState();
  const cached = commentsState[`${type}sComments`][typeId];
  if (cached) resolve(cached);

  const typeCommentsRef = app
    .database()
    .ref('comments/')
    .equalTo(typeId)
    .orderByChild(`${type}Id`);

  dispatch(StartRequest());

  typeCommentsRef.once(
    'value',
    snapshot => {
      const typeComments = toArray(snapshot.val()) || [];
      dispatch(FinishRequest());
      resolve(typeComments);
    },
    err => {
      dispatch(FinishRequest());
      reject(err);
    });
});

export const PostComments = comment => (dispatch, getState) => new Promise((resolve, reject) => {
  const commentsRef = app.database().ref('comments/');
  dispatch(StartRequest());

  commentsRef
    .push(comment)
    .then(() => {
      resolve(comment);
      dispatch(FinishRequest());
    })
    .catch(err => {
      reject(err);
      dispatch(FinishRequest());
    });
});


export const CommentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTES_COMMENTS: {
      const { noteId, comments } = action;
      return Object.assign({}, state, {
        notesComments: { [noteId]: comments }
      });
    }
    case PAPERS_COMMENTS: {
      const { papersId, comments } = action;
      return Object.assign({}, state, {
        papersComments: { [papersId]: comments }
      });
    }
    default:
      break;
  }

  return state;
};

