import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPublicCompanies = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchAllCompanies = async () => {
            try {
                // Call the new public endpoint that doesn't require authentication
                const res = await axios.get(`${COMPANY_API_END_POINT}/all`);
                
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log('Error fetching companies:', error);
            }
        }
        
        fetchAllCompanies();
    }, [dispatch])
}

export default useGetAllPublicCompanies
