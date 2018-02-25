import { combineReducers } from 'redux';

import { CourseReducer } from './courses';
import { PapersReducer } from './papers';
import { UniversitiesReducer } from './universities';
import { FacultiesReducer } from './faculties';
import { DepartmentsReducer } from './departments';
import { LevelsReducer } from './levels';
import { QuestionsReducer } from './questions';
import { RequestReducer } from './request';
import { NotesReducer } from './notes';
import { IsConnectedReducer } from './connection';
import { PriceReducer } from './price';
import { UserReducer } from './user';
import { CommentsReducer } from './comments';
import { ReaderReducer } from './reader';

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
  readerState: ReaderReducer
});

export default reducers;
