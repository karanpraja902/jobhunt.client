import { setAllAppliedJobs } from "@/redux/jobSlice";

import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { API_BASE_URL } from './config/api.config';

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/application/get`, {withCredentials:true});
                console.log(res.data);
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    },[])
};
export default useGetAppliedJobs;