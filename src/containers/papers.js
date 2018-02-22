import { connect } from 'react-redux';
import { GetPapers, SetPapers, SetCurrentPaper, GetPapersOffline, SavePapersOffline } from 'ducks/papers';

const mapStateToProps = store => {
  return {
    papers: store.paperState.papers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPapers: papers => dispatch(SetPapers(papers)),
    getPapers: courseId => dispatch(GetPapers(courseId)),
    getPapersOffline: courseId => dispatch(GetPapersOffline(courseId)),
    savePapersOffline: (courseId, papers) => dispatch(SavePapersOffline(courseId, papers)),
    setCurrentPaper: paper => dispatch(SetCurrentPaper(paper))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
