import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import HiringCompanies from './HiringCompanies';
import CompanyStats from './CompanyStats';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        let filteredJobs = allJobs;
        
        // Apply search query filter
        if (searchedQuery) {
            filteredJobs = filteredJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            });
        }
        
        // Apply company filter
        if (selectedCompany) {
            filteredJobs = filteredJobs.filter((job) => 
                job.company && job.company._id === selectedCompany
            );
        }
        
        setFilterJobs(filteredJobs);
    }, [allJobs, searchedQuery, selectedCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                {/* Statistics Section */}
                <CompanyStats jobs={allJobs} />
                
                {/* Companies Section */}
                <HiringCompanies 
                    jobs={allJobs}
                    selectedCompany={selectedCompany}
                    onCompanySelect={setSelectedCompany}
                />
                
                {/* Jobs Section */}
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? (
                            <div className='flex-1 flex flex-col items-center justify-center py-10'>
                                <Building2 className='h-16 w-16 text-gray-400 mb-4' />
                                <span className='text-gray-600 text-lg'>
                                    {selectedCompany ? 'No jobs found for this company' : 'No jobs found'}
                                </span>
                                {selectedCompany && (
                                    <button 
                                        onClick={() => setSelectedCompany(null)}
                                        className='mt-4 text-blue-600 hover:text-blue-700 underline'
                                    >
                                        Clear filter to see all jobs
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                {selectedCompany && (
                                    <div className='mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200'>
                                        <p className='text-sm text-purple-700'>
                                            Showing jobs from selected company. 
                                            <button 
                                                onClick={() => setSelectedCompany(null)}
                                                className='ml-2 underline hover:text-purple-800'
                                            >
                                                Clear filter
                                            </button>
                                        </p>
                                    </div>
                                )}
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs