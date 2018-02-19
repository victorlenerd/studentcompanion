import { connect } from 'react-redux';
import { GetNotes, SetNotes, GetNotesOffline, SaveNotesOffline, SetCurrentNote } from 'ducks/notes';

const mapStateToProps = store => {
  return {
    notes: store.notesState.notes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setNotes: notes => dispatch(SetNotes(notes)),
    getNotes: () => dispatch(GetNotes()),
    getNotesOffline: () => dispatch(GetNotesOffline()),
    saveNotesOffline: (courseId, notes) => dispatch(SaveNotesOffline(courseId, notes)),
    setCurrentNote: note => dispatch(SetCurrentNote(note))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
