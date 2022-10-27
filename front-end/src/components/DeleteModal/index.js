import { connect } from 'react-redux'
import React from 'react'
import '../../styles/styles.scss'
import {
    deleteJob,
    popUpStatus,
} from '../../redux/actions'

const DeleteModal = (props) => {

    const removeJob = () => {
        const newJobs = props.jobs.filter((job) => job.id != props.requestedJob.id)
        localStorage.setItem('jobs', JSON.stringify(newJobs))
        props.deleteJob(newJobs)
        props.popUpStatus(false)
        console.log(newJobs, props.requestedJob.id, props.jobs)
    }
    if (props.popUp == 'delete')
        return (
            <div>
                <div
                    className="pop-up-back"
                ></div>
                <div className="popup-container">
                    <div className="popup-remove">
                        <div className="confirmation-icon"></div>
                        <h3 className="confirmation-text">
                            Are you sure you want to delete it?
                        </h3>
                        <div className="button-container">
                            <button
                                className="cancel-button"
                                onClick={() => props.popUpStatus('')}
                            >
                                Cancel
                            </button>
                            <button className="approve-button" onClick={() => removeJob(props.requestedJob.id)}>
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )

}

const mapStateToProps = (state) => {
    return {
        priorityList: state.priorityList,
        jobs: state.jobs,
        requestedJob: state.requestedJob,
        popUp: state.popUp,
    }
}

export default connect(mapStateToProps, {
    deleteJob,
    popUpStatus,
})(DeleteModal)
