import React, { useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Building2, MapPin, Briefcase, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const HiringCompanies = ({ jobs, selectedCompany, onCompanySelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Extract unique companies from jobs
    const getUniqueCompanies = () => {
        const companiesMap = new Map();
        
        jobs.forEach(job => {
            if (job.company && job.company._id) {
                if (!companiesMap.has(job.company._id)) {
                    companiesMap.set(job.company._id, {
                        ...job.company,
                        jobCount: 1
                    });
                } else {
                    const company = companiesMap.get(job.company._id);
                    company.jobCount += 1;
                }
            }
        });
        
        return Array.from(companiesMap.values());
    };

    const companies = getUniqueCompanies();
    
    // Filter companies based on search term
    const filteredCompanies = companies.filter(company => {
        const searchLower = searchTerm.toLowerCase();
        return (
            company.name?.toLowerCase().includes(searchLower) ||
            company.location?.toLowerCase().includes(searchLower) ||
            company.description?.toLowerCase().includes(searchLower)
        );
    });

    if (companies.length === 0) {
        return null;
    }

    return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4'>
                <h2 className='font-bold text-xl flex items-center gap-2'>
                    <Building2 className='h-5 w-5 text-gray-600' />
                    Hiring Companies ({companies.length})
                </h2>
                <div className='flex items-center gap-2 w-full sm:w-auto'>
                    <div className='relative flex-1 sm:flex-initial'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-9 pr-3 py-1 w-full sm:w-[200px]'
                        />
                    </div>
                    {selectedCompany && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onCompanySelect(null)}
                        >
                            Clear Filter
                        </Button>
                    )}
                </div>
            </div>
            
            {filteredCompanies.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <Search className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                    <p>No companies found matching "{searchTerm}"</p>
                </div>
            ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {filteredCompanies.map((company) => (
                    <div
                        key={company._id}
                        onClick={() => onCompanySelect(company._id === selectedCompany ? null : company._id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                            selectedCompany === company._id 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className='flex items-start gap-3'>
                            <Avatar className="h-12 w-12 flex-shrink-0">
                                <AvatarImage 
                                    src={company.logo || "https://via.placeholder.com/100"} 
                                    alt={company.name} 
                                />
                            </Avatar>
                            <div className='flex-1 min-w-0'>
                                <h3 className='font-semibold text-sm truncate' title={company.name}>
                                    {company.name || 'Unknown Company'}
                                </h3>
                                {company.location && (
                                    <p className='text-xs text-gray-500 flex items-center gap-1 mt-1'>
                                        <MapPin className='h-3 w-3' />
                                        <span className='truncate' title={company.location}>{company.location}</span>
                                    </p>
                                )}
                                {company.description && (
                                    <p className='text-xs text-gray-400 mt-1 line-clamp-2' title={company.description}>
                                        {company.description}
                                    </p>
                                )}
                                <div className='mt-2'>
                                    <Badge variant="secondary" className='text-xs'>
                                        <Briefcase className='h-3 w-3 mr-1' />
                                        {company.jobCount} {company.jobCount === 1 ? 'Job' : 'Jobs'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}

            {filteredCompanies.length > 8 && (
                <div className='mt-4 text-center'>
                    <Button variant="outline" size="sm">
                        View All Companies
                    </Button>
                </div>
            )}
        </div>
    );
};

export default HiringCompanies;
