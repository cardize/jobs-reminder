export const UPDATE_JOB = 'UPDATE_JOB'
export const IMPORT_JOB = 'IMPORT_JOB'
export const DELETE_JOB = 'DELETE_JOB'

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
