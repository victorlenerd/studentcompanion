import { connect } from 'react-redux';
import {
  LoadNotes,
  SaveNotes,
  AddNote,
  UpdateNote,
  RemoveNote
} from 'ducks/extractedNotes';

const mapStateToProps = store => {
  const { extractedNotesState: { notes, currentNote } } = this.props;
  return {
    notes, 
    currentNote
  }
};

const mapDispatchToProps = dispatch => ({
  loadNotes: () => dispatch(LoadNotes()),
  saveNotes: () => dispatch(SaveNotes()),
  addNote: note => dispatch(AddNote(note)),
  updateNote: (noteId, note) => dispatch(UpdateNote(note, noteId)),
  removeNote: noteId => dispatch(RemoveNote(note, noteId)),
});