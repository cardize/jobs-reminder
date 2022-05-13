import { EDIT_JOB } from '../actions/index'

const INITIAL_STATE = {
  job: [
    {
      id: '',
      job_name: '',
      job_priority: '',
      priority_number: '',
    },
  ],
}

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EDIT_JOB:
      return {
        ...state,
        job: [
          ...state.job,
          {
            id: action.payload.id,
            job_name: action.payload.newName,
            job_priority: action.payload.newPriority,
            priority_number:
              action.payload.priority === 'Urgent'
                ? 1
                : action.payload.priority === 'Regular'
                ? 2
                : 3,
          },
        ],
      }
    default:
      return state
  }
}
