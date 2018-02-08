import app from 'shared/firebase';

const SendFeedback = (userId, feedback) => dispatch => new Promise((resolve, reject) => {
  const feedbackRef = app.database().ref('/feedback');

  feedbackRef
    .push({
      userId,
      feedback,
      dateAdded: new Date().toISOString(),
    })
    .then(resolve)
    .catch(reject);
});

export default SendFeedback;
