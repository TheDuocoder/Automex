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
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
            </Button>

            {/* Profile Header Card */}
            <Card className="shadow-lg border-none overflow-hidden">
                <div className="bg-primary/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        {user.profile_picture_url ? (
                            <img
                                src={user.profile_picture_url}
                                alt={user.full_name || 'User'}
                                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
                                {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className={`absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                            {user.is_active ? <CheckCircle className="h-3 w-3 text-white" /> : <XCircle className="h-3 w-3 text-white" />}
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                            <h1 className="text-2xl font-bold text-gray-900">{user.full_name || 'Unknown User'}</h1>
                            <Badge variant={user.is_superuser || user.role?.name === 'admin' ? "destructive" : "secondary"}>
                                {user.role?.name || (user.is_superuser ? 'Super Admin' : 'User')}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 text-sm">
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                {user.email}
                            </div>
                            {user.phone_number && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4" />
                                    {user.phone_number}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Shield className="h-4 w-4" />
                                User ID: {user.id}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="cars" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100/80 p-1 rounded-xl">
                    <TabsTrigger value="cars" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300 font-medium">
                        Cars
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300 font-medium">
                        Service History
                    </TabsTrigger>
                    <TabsTrigger value="pickups" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300 font-medium">
                        Pickup Requests
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="cars" className="mt-0 focus-visible:ring-0">
                    <MyCars userId={parseInt(userId!)} />
                </TabsContent>
                <TabsContent value="history" className="mt-0 focus-visible:ring-0">
                    <ServiceHistory userId={parseInt(userId!)} />
                </TabsContent>
                <TabsContent value="pickups" className="mt-0 focus-visible:ring-0">
                    <SchedulePickUp userId={parseInt(userId!)} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserDetails;
