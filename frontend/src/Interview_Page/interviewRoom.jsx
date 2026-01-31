import React from 'react'
import withAuth from '../utils/withAuth'
import VedioComponent from '../pages/VedioCall';
import PracticeCoding from '../Practice_Coding/practiceCoding';

function InterviewRoom() {
    return (
        <>
            <div className="interview-room">
                <div>Coding</div>
                <div>VideoCall</div>
            </div>
        </>
    )
}

export default withAuth(InterviewRoom);