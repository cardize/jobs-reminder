export const EDIT_JOB = 'EDIT_JOB'

export const editJobR = (currentId, newName, newPriority) => {
  console.log(currentId, newName, newPriority)
  return {
    type: EDIT_JOB,
    payload: { currentId, newName, newPriority },
  }
}
