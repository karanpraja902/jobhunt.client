import React from 'react'
import Navbar from './shared/Navbar'
import RealTimeJobs from './RealTimeJobs'
import Footer from './shared/Footer'

const RealTimeJobsPage = () => {
    return (
        <div>
            <Navbar />
            <div className='min-h-screen'>
                <RealTimeJobs />
            </div>
            <Footer />
        </div>
    )
}

export default RealTimeJobsPage
