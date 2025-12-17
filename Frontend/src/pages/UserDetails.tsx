import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, User } from "@/services/authService";
import { Loader2, ArrowLeft, Mail, Phone, Shield, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import MyCars from "@/components/dashboard/MyCars";
import ServiceHistory from "@/components/dashboard/ServiceHistory";
import SchedulePickUp from "@/components/dashboard/SchedulePickUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Premium Styling
const premiumStyles = `
  @keyframes underline-grow {
    from { width: 0; }
    to { width: 100%; }
  }

  .tab-trigger {
    position: relative;
    transition: all 0.3s ease;
  }

  .tab-trigger::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    width: 0;
    height: 2.5px;
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    border-radius: 2px;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  [data-state="active"].tab-trigger::after {
    width: 80%;
    animation: underline-grow 0.3s ease-out;
  }

  .profile-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .gradient-strip {
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  }

  .back-button {
    background-color: #000000;
    border: none;
    width: 11rem;
    border-radius: 1rem;
    height: 3.5rem;
    position: relative;
    color: #ffffff;
    font-size: 1.125rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .back-button-icon-container {
    background-color: #4ade80;
    border-radius: 0.75rem;
    height: 3rem;
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0.25rem;
    top: 0.25rem;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
  }

  .back-button:hover .back-button-icon-container {
    width: calc(100% - 0.5rem);
  }

  .back-button-icon-container svg {
    height: 1.5625rem;
    width: 1.5625rem;
  }

  .back-button-text {
    position: relative;
    z-index: 1;
    transform: translateX(0.5rem);
  }
`;

const UserDetails = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            try {
                const userData = await getUserById(parseInt(userId));
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
                toast.error("Failed to fetch user details");
                // Don't auto redirect, let them see error
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <p className="text-xl font-semibold text-gray-700">User not found</p>
                <Button onClick={() => navigate(-1)} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-7xl">
            <style>{premiumStyles}</style>

            <button
                onClick={() => navigate(-1)}
                className="back-button mb-6"
            >
                <div className="back-button-icon-container">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1024 1024"
                        height="25px"
                        width="25px"
                    >
                        <path
                            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                            fill="#000000"
                        ></path>
                        <path
                            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                            fill="#000000"
                        ></path>
                    </svg>
                </div>
                <p className="back-button-text">Back</p>
            </button>

            {/* Premium Glassmorphic Profile Card */}
            <Card className="profile-card border-none overflow-hidden" style={{
                boxShadow: '0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
                borderRadius: '16px',
            }}>
                {/* Gradient Highlight Strip */}
                <div className="gradient-strip"></div>

                <div className="p-4 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    {/* Enhanced Profile Photo */}
                    <div className="relative flex-shrink-0">
                        {/* Subtle Glow Ring */}
                        <div
                            className="absolute inset-0 rounded-full opacity-25 blur-lg"
                            style={{
                                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                                transform: 'scale(1.2)',
                            }}
                        ></div>

                        {user.profile_picture_url ? (
                            <img
                                src={user.profile_picture_url}
                                alt={user.full_name || 'User'}
                                className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                                style={{
                                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2), 0 8px 20px rgba(0, 0, 0, 0.1)',
                                }}
                            />
                        ) : (
                            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-lg relative z-10" style={{
                                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2), 0 8px 20px rgba(0, 0, 0, 0.1)',
                            }}>
                                {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* Larger Verified Tick */}
                        <div className={`absolute bottom-0 right-0 h-8 w-8 rounded-full border-3 border-white flex items-center justify-center z-20 ${user.is_active ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'}`}>
                            {user.is_active ? <CheckCircle className="h-5 w-5 text-white" /> : <XCircle className="h-5 w-5 text-white" />}
                        </div>
                    </div>

                    {/* Enhanced User Info */}
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                {user.full_name || 'Unknown User'}
                            </h1>
                            {user.is_superuser || user.role?.name === 'admin' ? (
                                <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/30">
                                    <Shield className="h-4 w-4" />
                                    {user.role?.name || (user.is_superuser ? 'Super Admin' : 'Admin')}
                                </div>
                            ) : (
                                <Badge className="px-3 py-1 rounded-full font-semibold text-sm bg-gray-200 text-gray-800">
                                    {user.role?.name || 'User'}
                                </Badge>
                            )}
                        </div>

                        {/* Premium Member Sublabel */}
                        <p className="text-sm text-gray-500 font-semibold tracking-wide">
                            Premium Member • Member Since 2021
                        </p>

                        {/* Enhanced Contact Info with Better Icon Alignment */}
                        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            {user.phone_number && (
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="text-sm">{user.phone_number}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm">User ID: {user.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Premium Tabs Section */}
            <Tabs defaultValue="cars" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8 bg-transparent p-0 gap-4 sm:gap-8 border-b border-gray-200 h-auto">
                    <TabsTrigger
                        value="cars"
                        className="tab-trigger rounded-none py-3 px-0 font-bold text-base data-[state=active]:text-primary data-[state=inactive]:text-gray-500 hover:text-primary/80 transition-colors"
                        style={{ background: 'transparent', border: 'none' }}
                    >
                        Cars
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="tab-trigger rounded-none py-3 px-0 font-bold text-base data-[state=active]:text-primary data-[state=inactive]:text-gray-500 hover:text-primary/80 transition-colors"
                        style={{ background: 'transparent', border: 'none' }}
                    >
                        Service History
                    </TabsTrigger>
                    <TabsTrigger
                        value="pickups"
                        className="tab-trigger rounded-none py-3 px-0 font-bold text-base data-[state=active]:text-primary data-[state=inactive]:text-gray-500 hover:text-primary/80 transition-colors"
                        style={{ background: 'transparent', border: 'none' }}
                    >
                        Pickup Requests
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="cars" className="mt-0 focus-visible:ring-0 animate-in fade-in duration-300">
                    <MyCars userId={parseInt(userId!)} />
                </TabsContent>
                <TabsContent value="history" className="mt-0 focus-visible:ring-0 animate-in fade-in duration-300">
                    <ServiceHistory userId={parseInt(userId!)} />
                </TabsContent>
                <TabsContent value="pickups" className="mt-0 focus-visible:ring-0 animate-in fade-in duration-300">
                    <SchedulePickUp userId={parseInt(userId!)} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserDetails;
