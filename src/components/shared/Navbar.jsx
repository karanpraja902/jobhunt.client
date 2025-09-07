import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Shield, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const logoutHandler = async () => {
        try {
            // Close the dialog
            setShowLogoutDialog(false);
            
            // Show loading state with admin-specific message
            const loadingMessage = user?.role === 'recruiter' 
                ? "Admin logging out..." 
                : "Logging out...";
            toast.loading(loadingMessage);
            
            const res = await axios.get(`${process.env.VITE_API_BASE_URL}/user/logout`, { withCredentials: true });
            
            if (res.data.success) {
                // Clear user from Redux store
                dispatch(setUser(null));
                
                // Clear any stored data
                localStorage.clear();
                sessionStorage.clear();
                
                // Navigate based on user role
                if (user?.role === 'recruiter') {
                    // For admin users, navigate to admin login or home
                    navigate("/");
                } else {
                    // For regular users, navigate to home
                    navigate("/");
                }
                
                // Show success message with role-specific text
                const successMessage = user?.role === 'recruiter' 
                    ? "Admin logged out successfully" 
                    : "Logged out successfully";
                toast.success(successMessage);
            } else {
                toast.error(res.data.message || "Logout failed");
            }
        } catch (error) {
            console.log(error);
            
            // Even if API call fails, clear local data
            dispatch(setUser(null));
            localStorage.clear();
            sessionStorage.clear();
            navigate("/");
            
            // Show appropriate error message
            const errorMessage = error.response?.data?.message || "Logout failed. Please try again.";
            toast.error(errorMessage);
        }
    }
    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Hunt</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/realtime-jobs" className="flex items-center gap-1">
                                        Live Jobs <span className="text-xs bg-green-500 text-white px-1 rounded">NEW</span>
                                    </Link></li>
                                    <li><Link to="/companies">Companies</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='flex items-center gap-3'>
                                {/* Direct Logout Button - Visible on Navbar */}
                                <Button 
                                    onClick={() => setShowLogoutDialog(true)}
                                    variant="outline"
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-400 hover:border-red-500 font-medium transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">{user?.role === 'recruiter' ? 'Admin Logout' : 'Logout'}</span>
                                    <span className="sm:hidden">Logout</span>
                                </Button>
                                
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <div className='flex items-center gap-2'>
                                                    <h4 className='font-medium'>{user?.fullname}</h4>
                                                    {user?.role === 'recruiter' && (
                                                        <Shield className="h-4 w-4 text-blue-600" title="Admin" />
                                                    )}
                                                </div>
                                                <p className='text-sm text-muted-foreground'>
                                                    {user?.profile?.bio || (user?.role === 'recruiter' ? 'Administrator' : 'User')}
                                                </p>
                                                {user?.role === 'recruiter' && (
                                                    <p className='text-xs text-blue-600 font-medium'>Admin Panel Access</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {/* Student Profile Link */}
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-full items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors'>
                                                        <User2 className="h-4 w-4 text-blue-500" />
                                                        <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                            <Link to="/profile">View Profile</Link>
                                                        </Button>
                                                    </div>
                                                )
                                            }

                                            {/* Admin Dashboard Link */}
                                            {
                                                user && user.role === 'recruiter' && (
                                                    <div className='flex w-full items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors'>
                                                        <Settings className="h-4 w-4 text-purple-500" />
                                                        <Button variant="ghost" className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                                            <Link to="/admin/companies">Admin Dashboard</Link>
                                                        </Button>
                                                    </div>
                                                )
                                            }

                                            {/* Logout Button - Enhanced for Admin */}
                                            <div className={`flex w-full items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors ${
                                                user?.role === 'recruiter' ? 'border-t border-gray-200 pt-3 mt-2' : ''
                                            }`}>
                                                <LogOut className={`h-4 w-4 ${user?.role === 'recruiter' ? 'text-red-600' : 'text-red-500'}`} />
                                                <Button 
                                                    onClick={() => setShowLogoutDialog(true)} 
                                                    variant="ghost" 
                                                    className={`w-full justify-start ${
                                                        user?.role === 'recruiter' 
                                                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50 font-medium' 
                                                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                                    }`}
                                                >
                                                    {user?.role === 'recruiter' ? 'Admin Logout' : 'Logout'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            </div>
                        )
                    }

                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {user?.role === 'recruiter' && <Shield className="h-5 w-5 text-blue-600" />}
                            {user?.role === 'recruiter' ? 'Confirm Admin Logout' : 'Confirm Logout'}
                        </DialogTitle>
                        <DialogDescription>
                            {user?.role === 'recruiter' 
                                ? 'Are you sure you want to logout from the admin panel? You will need to login again to access administrative features.'
                                : 'Are you sure you want to logout? You will need to login again to access your account.'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowLogoutDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={logoutHandler}
                            className={`${user?.role === 'recruiter' ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            {user?.role === 'recruiter' ? 'Admin Logout' : 'Logout'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Navbar