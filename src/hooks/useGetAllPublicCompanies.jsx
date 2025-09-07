import { setCompanies } from '@/redux/companySlice'
import { VITE_API_BASE_URL } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPublicCompanies = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchAllCompanies = async () => {
            try {
                // Call the new public endpoint that doesn't require authentication
                const res = await axios.get(`${VITE_API_BASE_URL}/company/all`);
                
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
