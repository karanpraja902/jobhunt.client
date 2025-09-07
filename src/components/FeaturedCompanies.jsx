import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { MapPin, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import useGetAllPublicCompanies from '@/hooks/useGetAllPublicCompanies'

const FeaturedCompanies = () => {
    // Fetch all companies
    useGetAllPublicCompanies();
    
    const { companies } = useSelector(store => store.company);
    
    // Show only first 6 companies as featured
    const featuredCompanies = companies.slice(0, 6);
    
    if (featuredCompanies.length === 0) {
        return null; // Don't show section if no companies
    }
    
    return (
        <div className='max-w-7xl mx-auto my-20 px-4'>
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h2 className='font-bold text-3xl'>Featured Companies</h2>
                    <p className='text-gray-600 mt-2'>Explore opportunities from top companies</p>
                </div>
                <Link to="/companies">
                    <Button variant="outline">View All Companies</Button>
                </Link>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {featuredCompanies.map((company) => (
                    <div key={company._id} className='p-5 rounded-lg shadow-md bg-white border border-gray-100 hover:shadow-lg transition-shadow'>
                        <div className='flex items-center gap-3 mb-3'>
                            <Avatar className="h-12 w-12">
                                <AvatarImage 
                                    src={company.logo || "https://via.placeholder.com/100"} 
                                    alt={company.name} 
                                />
                            </Avatar>
                            <div className='flex-1'>
                                <h3 className='font-semibold text-lg'>{company.name}</h3>
                                {company.location && (
                                    <div className='flex items-center gap-1 text-gray-500 text-sm'>
                                        <MapPin className='h-3 w-3' />
                                        <span>{company.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {company.description && (
                            <p className='text-gray-600 text-sm line-clamp-2 mb-3'>
                                {company.description}
                            </p>
                        )}
                        
                        <div className='flex items-center justify-between'>
                            <Badge variant="secondary" className="text-xs">
                                <Building2 className='h-3 w-3 mr-1' />
                                Company
                            </Badge>
                            {company.website && (
                                <a 
                                    href={company.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className='text-blue-600 hover:text-blue-700 text-sm font-medium'
                                >
                                    Visit Site
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FeaturedCompanies
