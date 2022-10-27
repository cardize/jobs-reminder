import {
  GET_JOB_PRIORITY_LIST,
  UPDATE_JOB,
  IMPORT_JOB,
  DELETE_JOB,
  REQUESTED_JOB,
  POP_UP,
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
  requestedJob: '',
  popUp: '',
}

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_JOB_PRIORITY_LIST:
      return {
        ...state,
        priorityList: action.payload.priorityList,
      }
    case REQUESTED_JOB:
      return {
        ...state,
        requestedJob: action.payload.item
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
    case POP_UP:
      console.log(action.payload.popUp)
      return {
        ...state,
        popUp: action.payload.popUp,
      }
    default:
      return state
  }
}
