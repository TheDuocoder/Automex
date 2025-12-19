import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, getAllUsers } from '@/services/authService';
import { Loader2, Search, Users, Mail, Phone, Shield, CheckCircle, XCircle, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Modern Table Styles
const tableStyles = `
  .users-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  .users-table thead {
    background: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .users-table thead th {
    padding: 16px 20px;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e5e7eb;
  }

  .users-table tbody tr {
    background: #ffffff;
    border-bottom: 1px solid #f3f4f6;
    transition: all 0.2s ease;
  }

  .users-table tbody tr:hover {
    background: linear-gradient(to right, #f9fafb 0%, #ffffff 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
  }

  .users-table tbody td {
    padding: 20px;
    font-size: 14px;
    color: #1f2937;
    vertical-align: middle;
  }

  .users-table tbody tr:last-child {
    border-bottom: none;
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    justify-content: center;
  }

  .status-active {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .status-inactive {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }
`;

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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
      setCurrentPage(1); // Reset to page 1
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
    setCurrentPage(1); // Reset to page 1 when searching
  }, [searchTerm, users]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
      <style>{tableStyles}</style>
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
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? 'No users found matching your search.' : 'No users in the system.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>User ID</span>
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center justify-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span>Name</span>
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>User Role</span>
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>Contact No</span>
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Email ID</span>
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr 
                      key={user.id}
                      onClick={() => navigate(`/admin/user-details/${user.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* User ID */}
                      <td style={{ textAlign: 'center' }}>
                        <div className="text-sm text-gray-500 font-semibold">
                          {user.id}
                        </div>
                      </td>

                      {/* Name */}
                      <td>
                        <div className="font-bold text-gray-900">
                          {user.full_name ?
                            user.full_name.split(' ').map(word =>
                              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ')
                            : 'Unknown User'
                          }
                        </div>
                      </td>

                      {/* User Role */}
                      <td style={{ textAlign: 'center' }}>
                        {user.is_superuser ? (
                          <span style={{
                            color: '#dc2626',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            Super Admin
                          </span>
                        ) : user.role?.name === 'admin' ? (
                          <span className="role-badge" style={{
                            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
                          }}>
                            <Shield className="h-3.5 w-3.5" />
                            Admin
                          </span>
                        ) : (
                          <span className="role-badge" style={{
                            background: '#f3f4f6',
                            color: '#374151'
                          }}>
                            Normal
                          </span>
                        )}
                      </td>

                      {/* Contact No */}
                      <td>
                        {user.phone_number ? (
                          <div className="text-gray-700 text-center">
                            <span>{user.phone_number}</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="text-gray-400 text-sm">—</span>
                          </div>
                        )}
                      </td>

                      {/* Email ID */}
                      <td>
                        <div className="text-gray-600 text-center">
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ textAlign: 'center' }}>
                        {user.is_active ? (
                          <span className="status-pill status-active">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="status-pill status-inactive">
                            <XCircle className="h-3.5 w-3.5" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AllUsers;