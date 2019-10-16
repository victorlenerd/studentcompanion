import { combineReducers } from 'redux';

import { CourseReducer } from './Courses';
import { PapersReducer } from './Papers';
import { UniversitiesReducer } from './Universities';
import { FacultiesReducer } from './Faculties';
import { DepartmentsReducer } from './Departments';
import { LevelsReducer } from './Levels';
import { QuestionsReducer } from './Questions';
import { RequestReducer } from './Request';
import { NotesReducer } from './Notes';
import { IsConnectedReducer } from './connection';
import { PriceReducer } from './Price';
import { UserReducer } from './User';
import { CommentsReducer } from './Comments';
import { ReaderReducer } from './reader';
import { SearchReducer } from './search';
import { UploadPhotosReducer } from './PhotoNotes';
import { ExtractedNotesReducer } from './extractedNotes';
import { DrawerIconReducer } from './drawerIcon';

const reducers = combineReducers({
  courseState: CourseReducer,
  paperState: PapersReducer,
  universitiesState: UniversitiesReducer,
  facultiesState: FacultiesReducer,
  departmentsState: DepartmentsReducer,
  levelsState: LevelsReducer,
  questionsState: QuestionsReducer,
  requestState: RequestReducer,
  notesState: NotesReducer,
  isConnectedState: IsConnectedReducer,
  priceState: PriceReducer,
  userState: UserReducer,
  commentsState: CommentsReducer,
  searchState: SearchReducer,
  readerState: ReaderReducer,
  drawerIconState: DrawerIconReducer,
  uploadPhotosState: UploadPhotosReducer,
  extractedNotesState: ExtractedNotesReducer
});

export default reducers;
