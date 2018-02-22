import { connect } from 'react-redux';
import { GetNotes, SetNotes, GetNotesOffline, SaveNotesOffline, SetCurrentNote } from 'ducks/notes';

const mapStateToProps = store => {
  return {
    notes: store.notesState.notes,
    currentNote: store.notesState.currentNote
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setNotes: notes => dispatch(SetNotes(notes)),
    getNotes: courseId => dispatch(GetNotes(courseId)),
    getNotesOffline: courseId => dispatch(GetNotesOffline(courseId)),
    saveNotesOffline: (courseId, notes) => dispatch(SaveNotesOffline(courseId, notes)),
    setCurrentNote: note => dispatch(SetCurrentNote(note))
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
