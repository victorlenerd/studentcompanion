import { connect } from 'react-redux';
import { GetQuestionsOffline, GetQuestions, SetCurrentQuestion, SetQuestions, SaveQuestionsOffline } from 'ducks/questions';

const mapStateToProps = store => {
  return {
    currentQuestion: store.questionsState.currentQuestion,
    questions: store.questionsState.questions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getQuestionsOffline: (courseId, pId) => dispatch(GetQuestionsOffline(courseId, pId)),
    saveQuestionsOffline: questions => dispatch(SaveQuestionsOffline(questions)),
    setCurrentQuestions: question => dispatch(SetCurrentQuestion(question)),
    setQuestions: questions => dispatch(SetQuestions(questions)),
    getQuestions: pId => dispatch(GetQuestions(pId))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
