import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users, Plus, Search, Mail, Phone, Briefcase, Building, MapPin, DollarSign, Calendar, 
  FileText, Loader2, Edit, Trash2, CheckCircle, XCircle, UserPlus
} from 'lucide-react';

// Animated Add Employee Button Styles + Card Shadow Effects
const buttonStyles = `
  .employee-card {
    box-shadow: 
      0 20px 40px rgba(0,0,0,0.08),
      0 8px 20px rgba(0,0,0,0.06),
      0 4px 10px rgba(0,0,0,0.04),
      0 2px 4px rgba(0,0,0,0.02),
      inset 0 1px 0 rgba(255,255,255,0.8),
      inset 0 -1px 0 rgba(0,0,0,0.02);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .employee-card:hover {
    box-shadow: 
      0 30px 60px rgba(0,0,0,0.12),
      0 12px 30px rgba(0,0,0,0.10),
      0 6px 15px rgba(0,0,0,0.06),
      0 3px 6px rgba(0,0,0,0.03),
      inset 0 1px 0 rgba(255,255,255,0.8),
      inset 0 -1px 0 rgba(0,0,0,0.02);
    transform: translateY(-8px);
  }

  .add-employee-button {
    position: relative;
    width: 170px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 1px solid #34974d;
    background-color: #3aa856;
    border-radius: 6px;
    overflow: hidden;
    padding: 0 12px;
  }

  .add-employee-button,
  .add-employee-button .button-text,
  .add-employee-button .button-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .add-employee-button .button-text {
    flex: 1;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    position: relative;
    z-index: 2;
  }

  .add-employee-button .button-icon {
    position: absolute;
    right: 0;
    height: 100%;
    width: 40px;
    background-color: #34974d;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .add-employee-button .button-icon svg {
    width: 20px;
    height: 20px;
    stroke: #fff;
    stroke-width: 2.5;
  }

  .add-employee-button:hover {
    background: #34974d;
    width: 170px;
    padding: 0;
  }

  .add-employee-button:hover .button-text {
    display: none;
  }

  .add-employee-button:hover .button-icon {
    width: 170px;
    right: 0;
  }

  .add-employee-button:active .button-icon {
    background-color: #2e8644;
  }

  .add-employee-button:active {
    border: 1px solid #2e8644;
  }

  .update-employee-button {
    position: relative;
    width: 190px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 1px solid #2563eb;
    background-color: #3b82f6;
    border-radius: 6px;
    overflow: hidden;
    padding: 0 12px;
  }

  .update-employee-button,
  .update-employee-button .button-text,
  .update-employee-button .button-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .update-employee-button .button-text {
    flex: 1;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    position: relative;
    z-index: 2;
  }

  .update-employee-button .button-icon {
    position: absolute;
    right: 0;
    height: 100%;
    width: 40px;
    background-color: #1d4ed8;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .update-employee-button .button-icon svg {
    width: 20px;
    height: 20px;
    stroke: #fff;
    stroke-width: 2.5;
  }

  .update-employee-button:hover {
    background: #2563eb;
    width: 190px;
    padding: 0;
  }

  .update-employee-button:hover .button-text {
    display: none;
  }

  .update-employee-button:hover .button-icon {
    width: 190px;
    right: 0;
  }

  .update-employee-button:active .button-icon {
    background-color: #1e40af;
  }

  .update-employee-button:active {
    border: 1px solid #1e40af;
  }

  .add-employee-button:disabled,
  .update-employee-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
import { employeeService, Employee, EmployeeCreate, EmployeeUpdate } from '@/services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<EmployeeCreate>({
    full_name: '',
    email: '',
    phone_number: '',
    position: '',
    department: '',
    address: '',
    salary: undefined,
    hire_date: '',
    last_working_day: '',
    employee_id: '',
    notes: '',
    is_active: true,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = employees.filter(emp =>
      emp.full_name?.toLowerCase().includes(lowercaseSearch) ||
      emp.email.toLowerCase().includes(lowercaseSearch) ||
      emp.phone_number?.toLowerCase().includes(lowercaseSearch) ||
      emp.position?.toLowerCase().includes(lowercaseSearch) ||
      emp.department?.toLowerCase().includes(lowercaseSearch) ||
      emp.employee_id?.toLowerCase().includes(lowercaseSearch)
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await employeeService.getAll();
      if (response.error) {
        // If 401, api.ts will handle redirect, just return early
        if (response.status === 401) {
          return;
        }
        throw new Error(response.error);
      }
      if (response.data) {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Don't show error toast for 401, redirect is handled by api.ts
      if (error instanceof Error && !error.message.includes('401')) {
        toast.error(error.message || 'Failed to fetch employees');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Clean form data: convert empty strings to undefined
      const cleanedData: EmployeeCreate = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number?.trim() || undefined,
        position: formData.position?.trim() || undefined,
        department: formData.department?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        salary: formData.salary || undefined,
        hire_date: formData.hire_date || undefined,
        last_working_day: formData.last_working_day || undefined,
        employee_id: formData.employee_id?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        is_active: formData.is_active ?? true,
      };
      
      const response = await employeeService.create(cleanedData);
      if (response.error) {
        // If 401, api.ts will handle redirect, just return early
        if (response.status === 401) {
          return;
        }
        throw new Error(response.error);
      }
      if (response.data) {
        toast.success('Employee added successfully');
        setIsAddOpen(false);
        resetForm();
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      // Don't show error toast for 401, redirect is handled by api.ts
      if (error instanceof Error && !error.message.includes('401')) {
        toast.error(error.message || 'Failed to add employee');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      full_name: employee.full_name,
      email: employee.email,
      phone_number: employee.phone_number || '',
      position: employee.position || '',
      department: employee.department || '',
      address: employee.address || '',
      salary: employee.salary,
      hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : '',
      last_working_day: employee.last_working_day ? employee.last_working_day.split('T')[0] : '',
      employee_id: employee.employee_id || '',
      notes: employee.notes || '',
      is_active: employee.is_active,
    });
    setIsEditOpen(true);
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setIsSubmitting(true);
    try {
      // Clean form data: convert empty strings to undefined
      const updateData: EmployeeUpdate = {
        full_name: formData.full_name.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone_number: formData.phone_number?.trim() || undefined,
        position: formData.position?.trim() || undefined,
        department: formData.department?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        salary: formData.salary || undefined,
        hire_date: formData.hire_date || undefined,
        last_working_day: formData.last_working_day || undefined,
        employee_id: formData.employee_id?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        is_active: formData.is_active,
      };
      
      const response = await employeeService.update(editingEmployee.id, updateData);
      if (response.error) {
        // If 401, api.ts will handle redirect, just return early
        if (response.status === 401) {
          return;
        }
        throw new Error(response.error);
      }
      if (response.data) {
        toast.success('Employee updated successfully');
        setIsEditOpen(false);
        setEditingEmployee(null);
        resetForm();
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      // Don't show error toast for 401, redirect is handled by api.ts
      if (error instanceof Error && !error.message.includes('401')) {
        toast.error(error.message || 'Failed to update employee');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const response = await employeeService.delete(id);
      if (response.error) {
        // If 401, api.ts will handle redirect, just return early
        if (response.status === 401) {
          return;
        }
        throw new Error(response.error);
      }
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      // Don't show error toast for 401, redirect is handled by api.ts
      if (error instanceof Error && !error.message.includes('401')) {
        toast.error(error.message || 'Failed to delete employee');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      position: '',
      department: '',
      address: '',
      salary: undefined,
      hire_date: '',
      last_working_day: '',
      employee_id: '',
      notes: '',
      is_active: true,
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddOpen(true);
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
      <style>{buttonStyles}</style>
      <Card className="shadow-lg border-none">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              Employees ({filteredEmployees.length})
            </CardTitle>
            <div className="flex gap-2">
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
                  placeholder="Search by name, email, phone..."
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
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <style>{buttonStyles}</style>
                <DialogTrigger asChild>
                  <button 
                    onClick={openAddModal}
                    className="add-employee-button"
                    type="button"
                    title="Add new employee"
                  >
                    <span className="button-text">Add Employee</span>
                    <div className="button-icon">
                      <Plus strokeWidth={2.5} />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] rounded-2xl p-0 overflow-hidden flex flex-col shadow-2xl">
                  {/* Header Section */}
                  <DialogHeader className="px-8 pt-8 pb-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                      Add New Employee
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 mt-1.5">
                      Enter the employee's details below. Fields marked with <span className="text-red-500">*</span> are required.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Form Content - Scrollable */}
                  <form onSubmit={handleAddEmployee} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                      <div className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="full_name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                Full Name
                                <span className="text-red-500 text-base leading-none">*</span>
                              </Label>
                              <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                                className="h-11 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                placeholder="Enter full name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                Email
                                <span className="text-red-500 text-base leading-none">*</span>
                              </Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  required
                                  className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                  placeholder="employee@example.com"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                                Phone Number
                              </Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="phone_number"
                                  value={formData.phone_number}
                                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                  className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                  placeholder="+91 9876543210"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="employee_id" className="text-sm font-medium text-gray-700">
                                Employee ID
                              </Label>
                              <Input
                                id="employee_id"
                                value={formData.employee_id}
                                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                className="h-11 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                placeholder="EMP-12345"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Professional Information Section */}
                        <div className="space-y-4 pt-2">
                          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Professional Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                                Position
                              </Label>
                              <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="position"
                                  value={formData.position}
                                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                  placeholder="e.g., Mechanic, Manager"
                                  className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                                Department
                              </Label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="department"
                                  value={formData.department}
                                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                  placeholder="e.g., Service, Sales"
                                  className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                                Salary
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-sm">₹</span>
                                <Input
                                  id="salary"
                                  type="number"
                                  value={formData.salary || ''}
                                  onChange={(e) => setFormData({ ...formData, salary: e.target.value ? parseFloat(e.target.value) : undefined })}
                                  min="0"
                                  step="0.01"
                                  className="h-11 pl-8 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                  placeholder="0.00"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Enter annual salary in Indian Rupees</p>
                            </div>
                          </div>
                        </div>

                        {/* Employment Dates Section */}
                        <div className="space-y-4 pt-2">
                          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Employment Dates
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="hire_date" className="text-sm font-medium text-gray-700">
                                Hire Date
                              </Label>
                              <div className="relative">
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <Input
                                  id="hire_date"
                                  type="date"
                                  value={formData.hire_date}
                                  onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                                  className="h-11 pr-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="last_working_day" className="text-sm font-medium text-gray-700">
                                Last Working Day <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                              </Label>
                              <div className="relative">
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <Input
                                  id="last_working_day"
                                  type="date"
                                  value={formData.last_working_day}
                                  onChange={(e) => setFormData({ ...formData, last_working_day: e.target.value })}
                                  className="h-11 pr-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information Section */}
                        <div className="space-y-4 pt-2">
                          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Additional Information
                          </h3>
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                                Address
                              </Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Textarea
                                  id="address"
                                  value={formData.address}
                                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                  rows={3}
                                  className="pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg resize-none"
                                  placeholder="Enter complete address"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                                Notes
                              </Label>
                              <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Textarea
                                  id="notes"
                                  value={formData.notes}
                                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                  rows={3}
                                  className="pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg resize-none"
                                  placeholder="Add any additional notes or remarks"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Section */}
                        <div className="pt-2 pb-2">
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                              type="checkbox"
                              id="is_active"
                              checked={formData.is_active}
                              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors"
                            />
                            <Label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                              Active Employee
                            </Label>
                            <Badge variant={formData.is_active ? "default" : "outline"} className="ml-auto">
                              {formData.is_active ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sticky Footer */}
                    <DialogFooter className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 z-10">
                      <div className="flex items-center justify-end gap-3 w-full">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsAddOpen(false)}
                          className="h-11 px-6 text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                        >
                          Cancel
                        </Button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="add-employee-button"
                          style={{ width: '170px', height: '44px' }}
                          title="Save employee"
                        >
                          <span className="button-text">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <UserPlus className="inline mr-2 h-4 w-4" />
                                Save
                              </>
                            )}
                          </span>
                          <div className="button-icon">
                            <Plus strokeWidth={2.5} />
                          </div>
                        </button>
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No employees found matching your search.' : 'No employees added yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => {
                // Format salary in INR with /- notation
                const formattedSalary = employee.salary 
                  ? `₹${Math.round(employee.salary).toLocaleString('en-IN')}/-`
                  : null;

                // Format hire date
                const hireDateFormatted = employee.hire_date
                  ? new Date(employee.hire_date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : null;

                return (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative group rounded-3xl overflow-hidden backdrop-blur-sm employee-card"
                    style={{
                      background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div className="p-6 space-y-4">
                      {/* Employee Avatar and Name Section */}
                      <div className="flex items-start gap-4">
                        {/* Avatar with Gradient Ring and Active Status */}
                        <div className="flex-shrink-0 relative">
                          {/* Outer gradient ring with glow */}
                          <div 
                            className="absolute inset-0 rounded-full blur-lg opacity-40"
                            style={{
                              background: 'linear-gradient(135deg, #ff4d4f, #ff7a7a)',
                              transform: 'scale(1.3)',
                            }}
                          ></div>
                          
                          {/* Gradient border ring */}
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #ff4d4f, #ff7a7a)',
                              padding: '3px',
                              boxShadow: '0 0 0 4px rgba(255,77,79,0.15)',
                            }}
                          >
                            {/* Inner white ring */}
                            <div 
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: '#fff',
                                margin: '3px',
                              }}
                            ></div>
                          </div>

                          {/* Avatar */}
                          <div 
                            className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-2xl relative z-10 border-2 border-white shadow-lg"
                            style={{
                              background: 'radial-gradient(circle at top, #ff8fa3, #f06292)',
                              boxShadow: '0 12px 30px rgba(240,98,146,0.45)',
                            }}
                          >
                            {employee.full_name.charAt(0).toUpperCase()}
                          </div>

                          {/* Floating Active Check - Green badge on bottom-right */}
                          {employee.is_active && (
                            <div 
                              className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg border-3 border-white flex items-center justify-center"
                              style={{
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.5)',
                                width: '28px',
                                height: '28px',
                              }}
                            >
                              <CheckCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
                            </div>
                          )}
                        </div>

                        {/* Name and Status with Better Hierarchy */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="mb-2">
                            <h3 className="font-extrabold text-gray-900 text-lg leading-tight tracking-tight">
                              {employee.full_name.split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </h3>
                          </div>
                          {/* ID and Status Badges on Same Line */}
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            {employee.employee_id && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs text-white" style={{
                                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                height: '28px',
                              }}>
                                <FileText className="h-3.5 w-3.5" />
                                <span>{employee.employee_id}</span>
                              </div>
                            )}
                            {employee.is_active ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs text-white" style={{
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                height: '28px',
                              }}>
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs text-white" style={{
                                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                height: '28px',
                              }}>
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Inactive</span>
                              </div>
                            )}
                          </div>
                          {employee.position && (
                            <p className="text-sm text-gray-500 font-medium letter-spacing-0.3">@{employee.position}</p>
                          )}
                        </div>
                      </div>

                      {/* Contact Information with Enhanced Icons */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-sm p-3 rounded-2xl" style={{
                          background: '#f8fafc',
                        }}>
                          <div className="p-2.5 rounded-xl flex-shrink-0" style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
                          }}>
                            <Mail className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="truncate text-gray-700">{employee.email}</span>
                        </div>
                        {employee.phone_number && (
                          <div className="flex items-center gap-3 text-sm p-3 rounded-2xl" style={{
                            background: '#f8fafc',
                          }}>
                            <div className="p-2.5 rounded-xl flex-shrink-0" style={{
                              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
                            }}>
                              <Phone className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-gray-700">{employee.phone_number}</span>
                          </div>
                        )}
                      </div>

                      {/* Department, Position and Salary Badges with Gradients */}
                      <div className="space-y-3 pt-1">
                        {/* Position, Department, and Salary Badges - Same Line */}
                        <div className="flex flex-wrap gap-2">
                          {employee.position && (
                            <div 
                              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-white"
                              style={{
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                boxShadow: '0 6px 16px rgba(59, 130, 246, 0.35)',
                                height: '32px',
                              }}
                            >
                              <Briefcase className="h-4 w-4" />
                              {employee.position}
                            </div>
                          )}
                          {employee.department && (
                            <div 
                              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-white"
                              style={{
                                background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
                                boxShadow: '0 6px 16px rgba(168, 85, 247, 0.35)',
                                height: '32px',
                              }}
                            >
                              <Building className="h-4 w-4" />
                              {employee.department}
                            </div>
                          )}
                          {formattedSalary && (
                            <div 
                              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-white"
                              style={{
                                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                boxShadow: '0 6px 16px rgba(245, 158, 11, 0.35)',
                                height: '32px',
                              }}
                            >
                              <span className="text-sm font-extrabold">₹</span>
                              {formattedSalary.replace('₹', '')}
                            </div>
                          )}
                        </div>

                        {/* Address - Full Width Badge */}
                        {employee.address && (
                          <div 
                            className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm text-white"
                            style={{
                              background: 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)',
                              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                            }}
                          >
                            <div className="p-2 rounded-lg flex-shrink-0" style={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              backdropFilter: 'blur(10px)',
                            }}>
                              <MapPin className="h-4 w-4" />
                            </div>
                            <span className="truncate text-xs">{employee.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Hire Date and Last Working Day */}
                      {(hireDateFormatted || employee.last_working_day) && (
                        <div className="space-y-2 text-sm">
                          {hireDateFormatted && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg" style={{
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
                              }}>
                                <Calendar className="h-4 w-4 text-amber-600" />
                              </div>
                              <span className="text-gray-600 font-medium">Hired: <span className="text-gray-700 font-semibold">{hireDateFormatted}</span></span>
                            </div>
                          )}
                          {employee.last_working_day && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg" style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
                              }}>
                                <Calendar className="h-4 w-4 text-red-600" />
                              </div>
                              <span className="text-gray-600 font-medium">Last Day: <span className="text-gray-700 font-semibold">{new Date(employee.last_working_day).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}</span></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer with Edit and Delete Buttons */}
                    <div 
                      className="px-6 py-3 flex gap-3 justify-between border-t"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
                        borderTopColor: 'rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:translateY-[-2px] hover:shadow-lg font-semibold text-sm border-2"
                        style={{
                          background: 'transparent',
                          color: '#EF4444',
                          borderColor: '#EF4444',
                        }}
                        title="Delete Employee"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:translateY-[-2px] font-semibold text-sm text-white"
                        style={{
                          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                        }}
                        title="Edit Employee"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] rounded-2xl p-0 overflow-hidden flex flex-col shadow-2xl">
          {/* Header Section */}
          <DialogHeader className="px-8 pt-8 pb-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
              Edit Employee
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-1.5">
              Update the employee's details below. Fields marked with <span className="text-red-500">*</span> are required.
            </DialogDescription>
          </DialogHeader>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleUpdateEmployee} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-full_name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Full Name
                        <span className="text-red-500 text-base leading-none">*</span>
                      </Label>
                      <Input
                        id="edit-full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                        className="h-11 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Email
                        <span className="text-red-500 text-base leading-none">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                          placeholder="employee@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone_number" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-phone_number"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-employee_id" className="text-sm font-medium text-gray-700">
                        Employee ID
                      </Label>
                      <Input
                        id="edit-employee_id"
                        value={formData.employee_id}
                        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                        className="h-11 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                        placeholder="EMP-12345"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-position" className="text-sm font-medium text-gray-700">
                        Position
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-position"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          placeholder="e.g., Mechanic, Manager"
                          className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-department" className="text-sm font-medium text-gray-700">
                        Department
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="edit-department"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          placeholder="e.g., Service, Sales"
                          className="h-11 pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-salary" className="text-sm font-medium text-gray-700">
                        Salary
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-sm">₹</span>
                        <Input
                          id="edit-salary"
                          type="number"
                          value={formData.salary || ''}
                          onChange={(e) => setFormData({ ...formData, salary: e.target.value ? parseFloat(e.target.value) : undefined })}
                          min="0"
                          step="0.01"
                          className="h-11 pl-8 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enter annual salary in Indian Rupees</p>
                    </div>
                  </div>
                </div>

                {/* Employment Dates Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Employment Dates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-hire_date" className="text-sm font-medium text-gray-700">
                        Hire Date
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Input
                          id="edit-hire_date"
                          type="date"
                          value={formData.hire_date}
                          onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                          className="h-11 pr-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-last_working_day" className="text-sm font-medium text-gray-700">
                        Last Working Day <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Input
                          id="edit-last_working_day"
                          type="date"
                          value={formData.last_working_day}
                          onChange={(e) => setFormData({ ...formData, last_working_day: e.target.value })}
                          className="h-11 pr-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="edit-address" className="text-sm font-medium text-gray-700">
                        Address
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="edit-address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows={3}
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg resize-none"
                          placeholder="Enter complete address"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-notes" className="text-sm font-medium text-gray-700">
                        Notes
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="edit-notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={3}
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg resize-none"
                          placeholder="Add any additional notes or remarks"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="pt-2 pb-2">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="edit-is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors"
                    />
                    <Label htmlFor="edit-is_active" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                      Active Employee
                    </Label>
                    <Badge variant={formData.is_active ? "default" : "outline"} className="ml-auto">
                      {formData.is_active ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <DialogFooter className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 z-10">
              <div className="flex items-center justify-end gap-3 w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditOpen(false)}
                  className="h-11 px-6 text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                >
                  Cancel
                </Button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="update-employee-button"
                  style={{ width: '190px', height: '44px' }}
                  title="Update employee"
                >
                  <span className="button-text">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="inline mr-2 h-4 w-4" />
                        Update
                      </>
                    )}
                  </span>
                  <div className="button-icon">
                    <Plus strokeWidth={2.5} />
                  </div>
                </button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Employees;

