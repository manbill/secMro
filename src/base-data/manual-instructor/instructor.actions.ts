import { Action } from 'redux';
import { ManualInstructor } from './instructor.modal';
import { ManualInstructorState } from './instructor.reducer';
export const FETCH_MANUAL_INSTRUCTOR_DATA = 'fetch_manual_instructor_data';
export const FETCH_MANUAL_INSTRUCTOR_DATA_COMPLETED = 'fetch_manual_instructor_data_completed';
export const INIT_MANUAL_INSTRUCTORS = 'init_manual_instructors';
export interface InitManualInstructorsAction extends Action {
  state: ManualInstructorState
}
export function initManualInstructorState(state: ManualInstructorState): InitManualInstructorsAction {
  return {
    type: INIT_MANUAL_INSTRUCTORS,
    state: state
  }
}
export function fetchManualInstructorData(): Action {
  return {
    type: FETCH_MANUAL_INSTRUCTOR_DATA
  }
}
export interface FetchManualInstructorDataCompletedAction extends Action {
  instructors: ManualInstructor[];
}
export function fetchManualInstructorDataCompleted(instructors: ManualInstructor[]): FetchManualInstructorDataCompletedAction {
  return {
    type: FETCH_MANUAL_INSTRUCTOR_DATA_COMPLETED,
    instructors: instructors
  }
}
