import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { MapPin, Globe, ExternalLink, TrendingUp, RefreshCw } from 'lucide-react';
import useGetExternalJobs from '@/hooks/useGetExternalJobs';
import { Skeleton } from './ui/skeleton';


const RealTimeJobs = () => {
    const { externalJobs, loading, error } = useGetExternalJobs('trending');
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        // Clear cache and refetch
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/external-jobs/cache/clear`, {
                method: 'DELETE'
            });
            window.location.reload();
        } catch (error) {
            console.error('Error refreshing jobs:', error);
        }
        setRefreshing(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    if (loading) {
        return (
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h2 className='font-bold text-3xl flex items-center gap-2'>
                            <TrendingUp className='h-8 w-8 text-green-600' />
                            Real-Time Job Openings
                        </h2>
                        <p className='text-gray-600 mt-2'>Latest opportunities from across the web</p>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className='p-5 rounded-lg border'>
                            <Skeleton className="h-12 w-12 rounded-full mb-4" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-20 w-full mb-4" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='text-center py-10'>
                    <p className='text-red-600'>Error loading real-time jobs: {error}</p>
                    <Button onClick={handleRefresh} className='mt-4'>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto my-10 px-4'>
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h2 className='font-bold text-3xl flex items-center gap-2'>
                        <TrendingUp className='h-8 w-8 text-green-600' />
                        Real-Time Job Openings
                    </h2>
                    <p className='text-gray-600 mt-2'>
                        {externalJobs.length} latest opportunities from across the web
                    </p>
                </div>
                <Button 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    className='flex items-center gap-2'
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {externalJobs.map((job, index) => (
                    <div 
                        key={`${job.source}-${job.id}-${index}`}
                        className='p-5 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-xl transition-shadow'
                    >
                        {/* Source Badge */}
                        <div className='flex items-center justify-between mb-3'>
                            <Badge variant="secondary" className='text-xs'>
                                {job.source}
                            </Badge>
                            <span className='text-xs text-gray-500'>
                                {formatDate(job.created_at)}
                            </span>
                        </div>

                        {/* Company Info */}
                        <div className='flex items-center gap-3 mb-3'>
                            <Avatar className="h-10 w-10">
                                <AvatarImage 
                                    src={job.company?.logo || "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=" + (job.company?.name?.charAt(0) || '?')} 
                                    alt={job.company?.name || 'Company'} 
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=" + (job.company?.name?.charAt(0) || '?');
                                    }}
                                />
                            </Avatar>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-sm'>
                                    {job.company?.name || 'Company'}
                                </h3>
                                <p className='text-xs text-gray-500 flex items-center gap-1'>
                                    <MapPin className='h-3 w-3' />
                                    {job.location}
                                </p>
                            </div>
                        </div>

                        {/* Job Title */}
                        <h4 className='font-bold text-lg mb-2 line-clamp-2'>
                            {job.title}
                        </h4>

                        {/* Job Description */}
                        <p className='text-sm text-gray-600 mb-3 line-clamp-3'>
                            {job.description?.replace(/<[^>]*>/g, '') || 'No description available'}
                        </p>

                        {/* Tags */}
                        {job.tags && job.tags.length > 0 && (
                            <div className='flex flex-wrap gap-1 mb-3'>
                                {job.tags.slice(0, 3).map((tag, idx) => (
                                    <Badge key={idx} variant="outline" className='text-xs'>
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Job Details */}
                        <div className='flex flex-wrap gap-2 mb-4'>
                            <Badge className='text-xs' variant="ghost">
                                {job.jobType}
                            </Badge>
                            {job.salary !== 'Not specified' && (
                                <Badge className='text-xs text-green-700' variant="ghost">
                                    {job.salary}
                                </Badge>
                            )}
                        </div>

                        {/* Apply Button */}
                        <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className='block'
                        >
                            <Button className='w-full flex items-center justify-center gap-2'>
                                Apply on {job.source}
                                <ExternalLink className='h-4 w-4' />
                            </Button>
                        </a>
                    </div>
                ))}
            </div>

            {externalJobs.length === 0 && !loading && (
                <div className='text-center py-10'>
                    <Globe className='h-20 w-20 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500 text-lg'>No real-time jobs available at the moment</p>
                    <Button onClick={handleRefresh} className='mt-4'>
                        Refresh Jobs
                    </Button>
                </div>
            )}
        </div>
    );
};

export default RealTimeJobs;
