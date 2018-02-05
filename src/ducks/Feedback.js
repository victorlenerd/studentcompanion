import app from '../shared/Firebase';

let feedbackRef = app.database().ref('/feedback');

export const SendFeedback = (userId, feedback) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      feedbackRef
        .push({
          userId,
          feedback,
          dateAdded: new Date().toISOString(),
        })
        .then(resolve)
        .catch(reject);
    });
  };
};
