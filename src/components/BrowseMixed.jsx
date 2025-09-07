import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import SafeImage from './ui/safe-image';
import SafeImageCORS from './ui/safe-image-cors';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import axios from 'axios';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, Building2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api.config';

const BrowseMixed = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/mixed-jobs/mixed`, {
                    params: {
                        keyword: searchedQuery || '',
                        source: 'all',
                        limit: 30
                    }
                });
                
                if (response.data.success) {
                    setJobs(response.data.jobs);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [searchedQuery]);

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, []);

    // External job card component
    const ExternalJobCard = ({ job }) => (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 relative'>
            <div className='absolute top-2 right-2'>
                <Badge variant="secondary" className='text-xs'>
                    {job.source}
                </Badge>
            </div>
            
            <div className='flex items-center gap-2 my-2'>
                <div className='p-2 border rounded'>
                    <SafeImageCORS
                        src={job.company?.logo}
                        alt={job.company?.name}
                        className='h-8 w-8 object-contain'
                        iconClassName='h-8 w-8 text-gray-400'
                        fallback='initial'
                        fallbackText={job.company?.name || 'Company'}
                        useProxy={true}
                    />
                </div>
                <div>
                    <h3 className='font-medium text-lg'>{job.company?.name || 'Company'}</h3>
                    <p className='text-sm text-gray-500'>{job.location}</p>
                </div>
            </div>
            
            <div>
                <h2 className='font-bold text-lg my-2'>{job.title}</h2>
                <p className='text-sm text-gray-600 line-clamp-3'>{job.description}</p>
            </div>
            
            <div className='flex flex-wrap gap-2 mt-4'>
                <Badge className='text-blue-700 font-bold' variant="ghost">
                    {job.position || 1} Position{job.position > 1 ? 's' : ''}
                </Badge>
                <Badge className='text-[#F83002] font-bold' variant="ghost">
                    {job.jobType}
                </Badge>
                {job.salary > 0 && (
                    <Badge className='text-[#7209b7] font-bold' variant="ghost">
                        {typeof job.salary === 'number' ? `${job.salary}LPA` : job.salary}
                    </Badge>
                )}
            </div>
            
            <div className='flex items-center gap-4 mt-4'>
                {job.isExternal ? (
                    <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className='flex-1'
                    >
                        <Button className='w-full flex items-center justify-center gap-2'>
                            Apply on {job.source}
                            <ExternalLink className='h-4 w-4' />
                        </Button>
                    </a>
                ) : (
                    <>
                        <Button 
                            onClick={() => window.location.href = `/description/${job._id}`}
                            variant="outline"
                        >
                            Details
                        </Button>
                        <Button className="bg-[#7209b7]">Save For Later</Button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold text-xl my-10'>
                    {searchedQuery ? `Search Results for "${searchedQuery}"` : 'Browse All Jobs'} 
                    ({jobs.length})
                </h1>
                
                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className='p-5 rounded-md border'>
                                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2 mb-4" />
                                <Skeleton className="h-20 w-full mb-4" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {jobs.map((job) => (
                            job.isExternal ? (
                                <ExternalJobCard key={job._id} job={job} />
                            ) : (
                                <Job key={job._id} job={job} />
                            )
                        ))}
                    </div>
                )}
                
                {!loading && jobs.length === 0 && (
                    <div className='text-center py-10'>
                        <Building2 className='h-20 w-20 text-gray-400 mx-auto mb-4' />
                        <p className='text-gray-500 text-lg'>No jobs found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrowseMixed
