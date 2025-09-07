import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { MapPin, Globe, Building2 } from 'lucide-react'
import useGetAllPublicCompanies from '@/hooks/useGetAllPublicCompanies'

const CompaniesForStudents = () => {
    // Fetch all companies using the public hook
    useGetAllPublicCompanies();
    
    const { companies } = useSelector(store => store.company);
    
    return (
        <div className='max-w-7xl mx-auto my-10 px-4'>
            <h1 className='font-bold text-3xl mb-8'>All Companies</h1>
            
            {companies.length === 0 ? (
                <div className='text-center py-10'>
                    <Building2 className='h-20 w-20 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500 text-lg'>No companies available at the moment</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {companies.map((company) => (
                        <div key={company._id} className='p-6 rounded-lg shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow'>
                            <div className='flex items-center gap-4 mb-4'>
                                <Avatar className="h-16 w-16">
                                    <AvatarImage 
                                        src={company.logo || "https://via.placeholder.com/150"} 
                                        alt={company.name} 
                                    />
                                </Avatar>
                                <div>
                                    <h2 className='font-semibold text-xl'>{company.name}</h2>
                                    {company.location && (
                                        <div className='flex items-center gap-1 text-gray-600 text-sm mt-1'>
                                            <MapPin className='h-3 w-3' />
                                            <span>{company.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {company.description && (
                                <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                                    {company.description}
                                </p>
                            )}
                            
                            <div className='flex flex-col gap-2'>
                                {company.website && (
                                    <a 
                                        href={company.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className='flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm'
                                    >
                                        <Globe className='h-4 w-4' />
                                        <span>Visit Website</span>
                                    </a>
                                )}
                                
                                <div className='mt-2'>
                                    <Badge variant="secondary" className="text-xs">
                                        {company.userId?.fullname ? `Added by ${company.userId.fullname}` : 'Company'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CompaniesForStudents
