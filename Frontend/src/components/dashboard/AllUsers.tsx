import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, getAllUsers } from '@/services/authService';
import { Loader2, Search, Users, Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AllUsers = () => {
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
      <Card className="shadow-lg border-none">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              All Users ({filteredUsers.length})
            </CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, phone, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No users found matching your search.' : 'No users in the system.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {user.profile_picture_url ? (
                          <img
                            src={user.profile_picture_url}
                            alt={user.full_name || 'User'}
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-gray-200">
                            {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* User Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {user.full_name ? 
                              user.full_name.split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ') 
                              : 'Unknown User'
                            }
                          </h3>
                          {user.is_superuser && (
                            <Badge variant="destructive" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Super Admin
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone_number && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                              <span>{user.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Role Badges */}
                    <div className="flex flex-wrap gap-2 items-center justify-end">
                      {/* Role Badge */}
                      {user.role && (
                        <Badge 
                          variant={
                            user.role.name === 'super' || user.role.name === 'admin' 
                              ? 'default' 
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1)}
                        </Badge>
                      )}

                      {/* Active Status */}
                      {user.is_active ? (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-700 bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs border-red-500 text-red-700 bg-red-50">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}

                      {/* Verified Status */}
                      {user.is_verified && (
                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-700 bg-blue-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* User ID (for admins) */}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">User ID: {user.id}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AllUsers;

