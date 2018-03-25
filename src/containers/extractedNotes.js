import { connect } from 'react-redux';
import {
  LoadNotes,
  SaveNotes,
  AddNote,
  UpdateNote,
  RemoveNote
} from 'ducks/extractedNotes';

const mapStateToProps = store => {
  const { extractedNotesState: { notes: extractedNotes, currentNote: currentNoteExtracted } } = store;
  return {
    extractedNotes,
    currentNoteExtracted
  };
};

const mapDispatchToProps = dispatch => ({
  loadNotes: () => dispatch(LoadNotes()),
  saveNotes: () => dispatch(SaveNotes()),
  addNote: note => dispatch(AddNote(note)),
  updateNote: (noteId, note) => dispatch(UpdateNote(noteId, note)),
  removeNote: noteId => dispatch(RemoveNote(noteId)),
});

export default use => connect(mapStateToProps, mapDispatchToProps)(use);
