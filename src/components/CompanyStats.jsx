import React from 'react';
import { Building2, Briefcase, MapPin, TrendingUp } from 'lucide-react';

const CompanyStats = ({ jobs }) => {
    // Calculate statistics
    const getStats = () => {
        const companiesSet = new Set();
        const locationsSet = new Set();
        let totalPositions = 0;

        jobs.forEach(job => {
            if (job.company?._id) {
                companiesSet.add(job.company._id);
            }
            if (job.location) {
                locationsSet.add(job.location);
            }
            if (job.position) {
                totalPositions += Number(job.position) || 1;
            }
        });

        return {
            totalJobs: jobs.length,
            totalCompanies: companiesSet.size,
            totalLocations: locationsSet.size,
            totalPositions: totalPositions || jobs.length
        };
    };

    const stats = getStats();

    return (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
            <div className='bg-white p-4 rounded-lg border border-gray-200'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                        <Briefcase className='h-5 w-5 text-blue-600' />
                    </div>
                    <div>
                        <p className='text-2xl font-bold text-gray-800'>{stats.totalJobs}</p>
                        <p className='text-xs text-gray-500'>Active Jobs</p>
                    </div>
                </div>
            </div>

            <div className='bg-white p-4 rounded-lg border border-gray-200'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-purple-100 rounded-lg'>
                        <Building2 className='h-5 w-5 text-purple-600' />
                    </div>
                    <div>
                        <p className='text-2xl font-bold text-gray-800'>{stats.totalCompanies}</p>
                        <p className='text-xs text-gray-500'>Companies</p>
                    </div>
                </div>
            </div>

            <div className='bg-white p-4 rounded-lg border border-gray-200'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-green-100 rounded-lg'>
                        <MapPin className='h-5 w-5 text-green-600' />
                    </div>
                    <div>
                        <p className='text-2xl font-bold text-gray-800'>{stats.totalLocations}</p>
                        <p className='text-xs text-gray-500'>Locations</p>
                    </div>
                </div>
            </div>

            <div className='bg-white p-4 rounded-lg border border-gray-200'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-orange-100 rounded-lg'>
                        <TrendingUp className='h-5 w-5 text-orange-600' />
                    </div>
                    <div>
                        <p className='text-2xl font-bold text-gray-800'>{stats.totalPositions}</p>
                        <p className='text-xs text-gray-500'>Open Positions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyStats;
