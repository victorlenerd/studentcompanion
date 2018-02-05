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
import { IsConnectedReducer } from './IsConnected';
import { PriceReducer } from './Price';
import { passReducer } from './Pass';

var reducers = combineReducers({
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
  passState: passReducer,
});

export default reducers;
