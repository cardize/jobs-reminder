import { UPDATE_JOB, IMPORT_JOB, DELETE_JOB } from '../actions/index'
import data from '../data/mock-data.json'

let localJobs = JSON.parse(localStorage.getItem('jobs'))
if (!localJobs) {
  localStorage.setItem('jobs', JSON.stringify(data))
  localJobs = data
}

const INITIAL_STATE = {
  jobs: localJobs,
}

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
