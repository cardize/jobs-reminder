import { connect } from 'react-redux'
import React, { useState } from 'react'
import '../../styles/styles.scss'
import {
    updateJob,
    popUpStatus,
} from '../../redux/actions'

const EditModal = (props) => {
    const [jobs, setJobs] = useState(() => props.jobs)
    const [newPriority, setNewPriority] = useState('')
    const [newName, setNewName] = useState('')

    const editJob = () => {
        const newJobs = jobs.map((job) => {
            if (job.id === props.requestedJob.id) {
                job.job_name = newName == '' ? props.requestedJob.job_name : newName
                let currentPriority = newPriority ? newPriority : props.requestedJob.job_priority
                job.job_priority = currentPriority === '' ? 'Regular' : currentPriority
                job.priority_number =
                    currentPriority === ''
                        ? 2
                        : currentPriority === 'Urgent'
                            ? 1
                            : currentPriority === 'Regular'
                                ? 2
                                : 3
            }
            return job
        })
        props.updateJob(newJobs)
        setJobs(newJobs)
        localStorage.setItem('jobs', JSON.stringify(newJobs))
    }

    const priorityChanced = (event) => {
        setNewPriority(event.target.value)
    }
    const nameChanged = (event) => {
        setNewName(event.target.value)
    }

    if (props.popUp == 'edit')
        return (
            <>
                <div
                    className="pop-up-back"
                ></div>
                <div
                    className="popup-container"
                >
                    <div className="popup-edit">
                        <h4 className="edit-title">Job Name</h4>
                        <input
                            id="edit-job-input"
                            className="edit-input"
                            value={newName || props.requestedJob.job_name}
                            onChange={nameChanged}
                        ></input>

                        <h4 className="edit-title">Job Priority</h4>
                        <select
                            className="edit-select"
                            onChange={priorityChanced}
                            value={newPriority ? newPriority : props.requestedJob.job_priority}
                        >
                            {props.priorityList.length == 0 ? null : props.priorityList.map((item) => {
                                return (
                                    <option
                                        key={item.id}
                                        value={item.priority_name}>
                                        {item.priority_name}
                                    </option>)
                            })}
                        </select>

                        <div className="button-container">
                            <button
                                className="cancel-button"
                                onClick={() => (props.popUpStatus(''), setNewName(''), setNewPriority(''))}
                            >
                                Cancel
                            </button>
                            <button
                                className="approve-button"
                                onClick={() => (editJob(), props.popUpStatus(''), setNewName(''), setNewPriority(''))}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
}

const mapStateToProps = (state) => {
    return {
        filteredJobs: state.filteredJobs,
        priorityList: state.priorityList,
        jobs: state.jobs,
        requestedJob: state.requestedJob,
        popUp: state.popUp,
    }
}

export default connect(mapStateToProps, {
    updateJob,
    popUpStatus,
})(EditModal)
