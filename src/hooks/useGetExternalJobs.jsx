import axios from 'axios';
import { useEffect, useState } from 'react';

const EXTERNAL_JOBS_API = 'http://localhost:5000/api/v1/external-jobs';

const useGetExternalJobs = (type = 'trending') => {
    const [externalJobs, setExternalJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExternalJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let endpoint = `${EXTERNAL_JOBS_API}/trending`;
                
                if (type === 'search') {
                    endpoint = `${EXTERNAL_JOBS_API}/search`;
                } else if (type === 'external') {
                    endpoint = `${EXTERNAL_JOBS_API}/external`;
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
