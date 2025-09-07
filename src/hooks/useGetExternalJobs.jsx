import axios from 'axios';
import { useEffect, useState } from 'react';
import { VITE_API_BASE_URL } from '@/utils/constant';



const useGetExternalJobs = (type = 'trending') => {
    const [externalJobs, setExternalJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExternalJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let endpoint = `${VITE_API_BASE_URL}/external-jobs/trending`;
                
                if (type === 'search') {
                    endpoint = `${VITE_API_BASE_URL}/external-jobs/search`;
                } else if (type === 'external') {
                    endpoint = `${VITE_API_BASE_URL}/external-jobs/external`;
                }
                
                const res = await axios.get(endpoint);
                
                if (res.data.success) {
                    setExternalJobs(res.data.jobs);
                }
            } catch (error) {
                console.error('Error fetching external jobs:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExternalJobs();
    }, [type]);

    return { externalJobs, loading, error };
};

export default useGetExternalJobs;
