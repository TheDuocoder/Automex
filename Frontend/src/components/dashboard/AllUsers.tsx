import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, getAllUsers } from '@/services/authService';
import { Loader2, Search, Users, Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Premium Card Styles with Multi-Layer Shadows and Hover Effects
const cardStyles = `
  .user-card {
    position: relative;
    background: #fff;
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.08),
      0 8px 20px rgba(0, 0, 0, 0.06),
      0 4px 10px rgba(0, 0, 0, 0.04),
      0 2px 4px rgba(0, 0, 0, 0.02),
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 -1px 0 rgba(0, 0, 0, 0.03) !important;
    transition:
      box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important,
      transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .user-card:hover {
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.12),
      0 12px 30px rgba(0, 0, 0, 0.10),
      0 6px 15px rgba(0, 0, 0, 0.06),
      0 3px 6px rgba(0, 0, 0, 0.03),
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 -1px 0 rgba(0, 0, 0, 0.04) !important;
    transform: translateY(-8px) !important;
  }
`;

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Don't show error toast for 401, redirect is handled by api.ts
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
        if (!errorMessage.includes('401') && !errorMessage.includes('Unauthorized')) {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.full_name?.toLowerCase().includes(lowercaseSearch) ||
      user.email.toLowerCase().includes(lowercaseSearch) ||
      user.phone_number?.toLowerCase().includes(lowercaseSearch) ||
      user.role?.name.toLowerCase().includes(lowercaseSearch)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  if (isLoading) {
    return (
      <Card className="shadow-lg border-none">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <style>{cardStyles}</style>
      <Card className="shadow-lg border-none">
        <CardHeader className="border-b" style={{ background: 'linear-gradient(90deg, #a67ba9 0%, #c8a2c8 50%, #e6b8c0 100%)' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <Users className="h-5 w-5 text-white" />
              All Users ({filteredUsers.length})
            </CardTitle>
            <div className="relative w-full md:w-80 group">
              {/* Search Icon Container with Gradient */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <div className="p-2 bg-gradient-to-r from-primary/15 to-primary/10 rounded-lg group-focus-within:from-primary/25 group-focus-within:to-primary/15 transition-all duration-300 shadow-sm">
                  <Search className="h-5 w-5 text-primary font-bold" strokeWidth={2.5} />
                </div>
              </div>

              {/* Input Field with Glassmorphism */}
              <Input
                type="text"
                placeholder="Search by name, phone no.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 pr-12 py-2.5 bg-gradient-to-r from-white/70 to-white/60 backdrop-blur-md border-2 border-gray-200/60 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-500 placeholder:font-medium transition-all duration-300 focus:border-primary/50 focus:from-white/90 focus:to-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/10 hover:border-gray-300/80 hover:shadow-md hover:shadow-primary/5"
              />

              {/* Clear Button (X) - Right Side */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <XCircle className="h-5 w-5" strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No users found matching your search.' : 'No users in the system.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                // Determine role-based border gradient
                const getRoleBorderColor = () => {
                  if (user.is_superuser) return { gradient: 'from-red-500 to-red-400', glow: 'shadow-red-500/30', ring: 'ring-red-100' };
                  if (user.role?.name === 'admin') return { gradient: 'from-orange-500 to-orange-400', glow: 'shadow-orange-500/30', ring: 'ring-orange-100' };
                  return { gradient: 'from-blue-400 to-gray-300', glow: 'shadow-blue-500/20', ring: 'ring-blue-100' };
                };

                const roleStyle = getRoleBorderColor();

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group rounded-2xl overflow-hidden cursor-pointer user-card"
                    onClick={() => navigate(`/admin/user-details/${user.id}`)}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div className="p-4 sm:p-5 space-y-4">
                      {/* Top Row: Avatar, Info, and Status Badge */}
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Avatar with Role-Based Glow Ring */}
                          <div className="flex-shrink-0 relative">
                            {/* Glow ring */}
                            <div
                              className={`absolute inset-0 rounded-full opacity-20 blur-md`}
                              style={{
                                background: `linear-gradient(135deg, ${roleStyle.gradient.split(' to ')[0].replace('from-', '')} 0%, ${roleStyle.gradient.split(' to ')[1]} 100%)`,
                                transform: 'scale(1.15)',
                              }}
                            ></div>

                            {/* Avatar Image */}
                            {user.profile_picture_url ? (
                              <img
                                src={user.profile_picture_url}
                                alt={user.full_name || 'User'}
                                className={`h-16 w-16 rounded-full object-cover border-3 border-white shadow-lg relative z-10 ring-4 ${roleStyle.ring}`}
                              />
                            ) : (
                              <div className={`h-16 w-16 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl border-3 border-white shadow-lg relative z-10 ring-4 ${user.is_superuser ? 'from-red-500 to-red-400 ring-red-100' :
                                user.role?.name === 'admin' ? 'from-orange-500 to-orange-400 ring-orange-100' :
                                  'from-blue-500 to-blue-400 ring-blue-100'
                                }`}>
                                {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* User Details */}
                          <div className="flex-1 min-w-0 pt-1">
                            {/* Name and Role Badge */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-black text-lg text-gray-900 tracking-tight">
                                {user.full_name ?
                                  user.full_name.split(' ').map(word =>
                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                  ).join(' ')
                                  : 'Unknown User'
                                }
                              </h3>

                              {/* Role Badge with Role-Based Styling */}
                              {user.is_superuser ? (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30">
                                  <Shield className="h-3.5 w-3.5" />
                                  <span>Super Admin</span>
                                </div>
                              ) : user.role?.name === 'admin' ? (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                                  <Shield className="h-3.5 w-3.5" />
                                  <span>Admin</span>
                                </div>
                              ) : (
                                <div className="px-3 py-1 rounded-full font-bold text-xs text-gray-700 bg-gray-200/70">
                                  Normal
                                </div>
                              )}
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </div>
                              {user.phone_number && (
                                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span>{user.phone_number}</span>
                                </div>
                              )}
                              <div className="text-xs text-gray-500 font-semibold opacity-60">
                                User ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Active Status Badge - Right Aligned */}
                        {user.is_active && (
                          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-white bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                            <CheckCircle className="h-4 w-4" />
                            <span>Active</span>
                          </div>
                        )}
                      </div>

                      {/* Thin Divider */}
                      <div className="h-px bg-gradient-to-r from-gray-200/0 via-gray-200/50 to-gray-200/0"></div>

                      {/* Status Badges Row */}
                      <div className="flex flex-wrap gap-2.5 items-center">
                        {!user.is_active && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30">
                            <XCircle className="h-4 w-4" />
                            <span>Inactive</span>
                          </div>
                        )}

                        {user.is_verified && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                            <CheckCircle className="h-4 w-4" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AllUsers;

