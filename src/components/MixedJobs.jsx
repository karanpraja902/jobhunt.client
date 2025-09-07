import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import Job from './Job';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import SafeImage from './ui/safe-image';
import { API_BASE_URL } from '../config/api.config';
import { 
    Search, 
    MapPin, 
    Briefcase, 
    DollarSign, 
    Building2, 
    RefreshCw,
    Filter,
    Globe,
    Database,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const MixedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    
    // Filter states
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('all');
    const [source, setSource] = useState('all');
    const [includeRemote, setIncludeRemote] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    
    // Debounced search
    const [searchTimeout, setSearchTimeout] = useState(null);

    const MIXED_JOBS_API = `${API_BASE_URL}/mixed-jobs`;

    // Fetch mixed jobs
    const fetchMixedJobs = async (resetPage = false) => {
        try {
            setLoading(true);
            setError(null);
            
            const currentPage = resetPage ? 1 : page;
            if (resetPage) setPage(1);
            
            const params = {
                keyword,
                location,
                jobType,
                source,
                includeRemote,
                page: currentPage,
                limit: 12
            };
            
            const response = await axios.get(`${MIXED_JOBS_API}/mixed`, { params });
            
            if (response.data.success) {
                setJobs(response.data.jobs);
                setTotalPages(response.data.totalPages || 1);
                setTotalJobs(response.data.totalJobs || response.data.jobs.length);
            }
        } catch (err) {
            console.error('Error fetching mixed jobs:', err);
            setError('Failed to load jobs. Please try again.');
            // Fetch random jobs as fallback
            fetchRandomJobs();
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch random jobs (when no filters)
    const fetchRandomJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${MIXED_JOBS_API}/random`);
            if (response.data.success) {
                setJobs(response.data.jobs);
                setTotalPages(1);
                setTotalJobs(response.data.jobs.length);
            }
        } catch (err) {
            console.error('Error fetching random jobs:', err);
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initial load - fetch random jobs immediately
    useEffect(() => {
        // Fetch random jobs immediately on component mount
        if (!hasInitialized) {
            setHasInitialized(true);
            fetchRandomJobs();
        }
    }, []); // Only on mount

    // Handle filter changes with debouncing for text inputs
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    useEffect(() => {
        // Skip the effect on initial load
        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }
        
        if (searchTimeout) clearTimeout(searchTimeout);
        
        const timeout = setTimeout(() => {
            if (keyword || location || jobType !== 'all' || source !== 'all') {
                fetchMixedJobs(true);
            } else {
                fetchRandomJobs();
            }
        }, 500);
        
        setSearchTimeout(timeout);
        
        return () => clearTimeout(timeout);
    }, [keyword, location, jobType, source, includeRemote]);

    // Handle page change
    useEffect(() => {
        if (page > 1) {
            fetchMixedJobs(false);
        }
    }, [page]);

    // Refresh handler
    const handleRefresh = () => {
        setRefreshing(true);
        // Clear cache first
        axios.delete(`${MIXED_JOBS_API}/cache/clear`)
            .then(() => fetchMixedJobs(true))
            .catch(() => fetchMixedJobs(true));
    };

    // Clear all filters
    const clearFilters = () => {
        setKeyword('');
        setLocation('');
        setJobType('all');
        setSource('all');
        setIncludeRemote(true);
        setPage(1);
    };

    const hasActiveFilters = keyword || location || jobType !== 'all' || source !== 'all';

    // Job card component for external jobs
    const ExternalJobCard = ({ job }) => (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 relative'>
            {/* Source Badge */}
            <div className='absolute top-2 right-2'>
                <Badge variant="secondary" className='text-xs'>
                    {job.source === 'Database' ? (
                        <Database className='h-3 w-3 mr-1' />
                    ) : (
                        <Globe className='h-3 w-3 mr-1' />
                    )}
                    {job.source}
                </Badge>
            </div>
            
            <div className='flex items-center gap-2 my-2'>
                <div className='p-2 border rounded'>
                    <SafeImage
                        src={job.company?.logo}
                        alt={job.company?.name}
                        className='h-8 w-8 object-contain'
                        iconClassName='h-8 w-8 text-gray-400'
                        fallback='icon'
                    />
                </div>
                <div>
                    <h3 className='font-medium text-lg'>{job.company?.name || 'Company'}</h3>
                    <p className='text-sm text-gray-500'>{job.location}</p>
                </div>
            </div>
            
            <div>
                <h2 className='font-bold text-lg my-2 line-clamp-2'>{job.title}</h2>
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
            <div className='max-w-7xl mx-auto px-4 py-6'>
            {/* Filters Section */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-bold flex items-center gap-2'>
                        <Filter className='h-5 w-5' />
                        Job Filters
                    </h2>
                    {hasActiveFilters && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={clearFilters}
                        >
                            Clear All
                        </Button>
                    )}
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                    {/* Keyword Search */}
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input
                            placeholder="Search jobs..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className='pl-9'
                        />
                    </div>
                    
                    {/* Location */}
                    <div className='relative'>
                        <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input
                            placeholder="Location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className='pl-9'
                        />
                    </div>
                    
                    {/* Job Type */}
                    <Select value={jobType} onValueChange={setJobType}>
                        <SelectTrigger>
                            <Briefcase className='h-4 w-4 mr-2' />
                            <SelectValue placeholder="Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    {/* Source */}
                    <Select value={source} onValueChange={setSource}>
                        <SelectTrigger>
                            <Database className='h-4 w-4 mr-2' />
                            <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="database">Database Only</SelectItem>
                            <SelectItem value="external">External APIs</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    {/* Refresh Button */}
                    <Button 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className='flex items-center gap-2'
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
                
                {/* Remote Jobs Toggle */}
                <div className='mt-4 flex items-center gap-2'>
                    <input
                        type="checkbox"
                        id="includeRemote"
                        checked={includeRemote}
                        onChange={(e) => setIncludeRemote(e.target.checked)}
                        className='rounded'
                    />
                    <label htmlFor="includeRemote" className='text-sm text-gray-600'>
                        Include remote opportunities
                    </label>
                </div>
            </div>

            {/* Results Summary */}
            {!loading && (
                <div className='mb-4 flex items-center justify-between'>
                    <p className='text-gray-600'>
                        {hasActiveFilters ? (
                            <>Showing {jobs.length} of {totalJobs} jobs</>
                        ) : (
                            <>Showing random job opportunities</>
                        )}
                    </p>
                    {totalPages > 1 && (
                        <div className='flex items-center gap-2'>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className='h-4 w-4' />
                            </Button>
                            <span className='text-sm'>
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className='h-4 w-4' />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Jobs Grid */}
            {loading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
            ) : error ? (
                <div className='text-center py-10'>
                    <p className='text-red-600'>{error}</p>
                    <Button onClick={() => fetchMixedJobs(true)} className='mt-4'>
                        Try Again
                    </Button>
                </div>
            ) : jobs.length === 0 ? (
                <div className='text-center py-10'>
                    <Briefcase className='h-20 w-20 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500 text-lg'>No jobs found</p>
                    {hasActiveFilters && (
                        <Button onClick={clearFilters} className='mt-4'>
                            Clear Filters
                        </Button>
                    )}
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {jobs.map((job, index) => (
                        <motion.div
                            key={`${job._id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            {job.isExternal ? (
                                <ExternalJobCard job={job} />
                            ) : (
                                <Job job={job} />
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className='mt-8 flex justify-center'>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className='h-4 w-4 mr-2' />
                            Previous
                        </Button>
                        
                        <div className='flex items-center gap-1'>
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                const pageNum = page <= 3 ? i + 1 : page + i - 2;
                                if (pageNum > totalPages) return null;
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                            <ChevronRight className='h-4 w-4 ml-2' />
                        </Button>
                    </div>
                </div>
            )}
            </div>
            <Footer />
        </div>
    );
};

export default MixedJobs;
