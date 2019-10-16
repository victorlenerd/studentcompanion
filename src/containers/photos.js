import { connect } from 'react-redux';
import { GetPhotoNotes, AddPhotoNote } from 'ducks/PhotoNotes';

const mapDispatchToProps = dispatch => {
  return {
    addPhotoNote: photoNote => dispatch(AddPhotoNote(photoNote)),
    getPhotoNotes: userId => dispatch(GetPhotoNotes(userId)),
  };
};

const mapStateToProps = store => {
  return {};
};

export default comp => connect(mapStateToProps, mapDispatchToProps)(comp);
