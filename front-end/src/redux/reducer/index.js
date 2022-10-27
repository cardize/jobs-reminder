import {
  GET_JOB_PRIORITY_LIST,
  UPDATE_JOB,
  IMPORT_JOB,
  DELETE_JOB,
} from '../actions/index'
import data from '../../data/mock-data.json'

let localJobs = JSON.parse(localStorage.getItem('jobs'))
if (!localJobs) {
  localStorage.setItem('jobs', JSON.stringify(data))
  localJobs = data
}

const INITIAL_STATE = {
  priorityList: '',
  jobs: localJobs,
}

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_JOB_PRIORITY_LIST:
      return {
        ...state,
        priorityList: action.payload.priorityList,
      }
    case UPDATE_JOB:
      return {
        ...state,
        jobs: action.payload.newJobs,
      }
    case IMPORT_JOB:
      return {
        ...state,
        jobs: [...state.jobs, action.payload.job],
      }
    case DELETE_JOB:
      return {
        ...state,
        jobs: action.payload.newJobs,
      }
    default:
      return state
  }
}
