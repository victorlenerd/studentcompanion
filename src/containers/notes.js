import { connect } from 'react-redux';
import { GetNotes, SetNotes, GetNotesOffline, SaveNotesOffline, SetCurrentNote, RemoveNoteOffline, UpdateReadNotes, GetReadNotes } from 'ducks/Notes';

const mapStateToProps = store => {
  return {
    notes: store.notesState.notes,
    currentNote: store.notesState.currentNote
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setNotes: (courseId, notes) => dispatch(SetNotes(courseId, notes)),
    getNotes: courseId => dispatch(GetNotes(courseId)),
    getNotesOffline: courseId => dispatch(GetNotesOffline(courseId)),
    saveNotesOffline: (courseId, notes) => dispatch(SaveNotesOffline(courseId, notes)),
    removeNoteOffline: courseId => dispatch(RemoveNoteOffline(courseId)),
    setCurrentNote: note => dispatch(SetCurrentNote(note)),
    updateReadNotes: (note, id) => dispatch(UpdateReadNotes(note, id)),
    getReadNotes: () => dispatch(GetReadNotes())
  };
};

export default com => connect(mapStateToProps, mapDispatchToProps)(com);
