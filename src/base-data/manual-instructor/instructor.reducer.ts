import { ManualInstructor } from './instructor.modal';
import { Action } from 'redux';
import { INIT_MANUAL_INSTRUCTORS, InitManualInstructorsAction, FETCH_MANUAL_INSTRUCTOR_DATA_COMPLETED, FetchManualInstructorDataCompletedAction } from './instructor.actions';
import { combineEpics } from 'redux-observable';
import { fetchManualInstructorsEpic } from './instructor.epics';
import { IBaseDataState } from '../base-data.reducer';
export interface ManualInstructorEntities {
  [id: string]: ManualInstructor
}
export interface ManualInstructorState extends IBaseDataState{
  ids: number[];
  manualInstructorEntities: ManualInstructorEntities;
}
const initialState:ManualInstructorState={
  ids:[],
  isCompleted:false,
  manualInstructorEntities:{}
}
export function ManualInstructorReducer(state: ManualInstructorState=initialState, action: Action): ManualInstructorState {
  switch (action.type) {
    default: {
      return state;
    }
    case INIT_MANUAL_INSTRUCTORS: {
      return (<InitManualInstructorsAction>action).state;
    }
    case FETCH_MANUAL_INSTRUCTOR_DATA_COMPLETED: {
      const instructors = (<FetchManualInstructorDataCompletedAction>action).instructors;
      return {
        ...state,
        isCompleted:true,
        ids: instructors.map(manual => manual.manualInfoDTO.manualId),
        manualInstructorEntities: instructors.reduce((entities, manual) => {
          entities[manual.manualInfoDTO.manualId] = manual;
          return entities;
        }, {})
      }
    }
  }
}
export const RootManualInstructorEpics=combineEpics(fetchManualInstructorsEpic);
