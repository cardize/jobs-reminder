export const GET_JOB_PRIORITY_LIST = 'GET_JOB_PRIORITY_LIST'
export const REQUESTED_JOB = 'REQUESTED_JOB'
export const UPDATE_JOB = 'UPDATE_JOB'
export const IMPORT_JOB = 'IMPORT_JOB'
export const DELETE_JOB = 'DELETE_JOB'
export const POP_UP = 'POP_UP'

export const getJobPriority = (priorityList) => {
  return {
    type: GET_JOB_PRIORITY_LIST,
    payload: { priorityList },
  }
}

export const requestJob = (item) => {
  return {
    type: REQUESTED_JOB,
    payload: { item }
  }
}

export const updateJob = (newJobs) => {
  return {
    type: UPDATE_JOB,
    payload: { newJobs },
  }
}

export const importJob = (job) => {
  return {
    type: IMPORT_JOB,
    payload: { job },
  }
}

export const deleteJob = (newJobs) => {
  return {
    type: DELETE_JOB,
    payload: { newJobs },
  }
}

export const popUpStatus = (popUp) => {
  return {
    type: POP_UP,
    payload: { popUp },
  }
}