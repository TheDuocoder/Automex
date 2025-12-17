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
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
        <CardContent className="p-4 sm:p-6">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No employees found matching your search.' : 'No employees added yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1800px] mx-auto">
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
                    className="relative group rounded-[2.5rem] overflow-hidden backdrop-blur-sm employee-card"
                    style={{
                      background: 'linear-gradient(to bottom right, #ffffff 0%, rgba(243, 244, 246, 0.6) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {/* Top accent gradient bar */}
                    <div
                      className="h-1"
                      style={{
                        background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                      }}
                    ></div>

                    <div className="p-5 sm:p-8">
                      {/* Centered Profile Section */}
                      <div className="flex flex-col items-center mb-6">
                        {/* Profile Photo with Glow */}
                        <div className="relative mb-5">
                          {/* Outer glow ring */}
                          <div
                            className="absolute inset-0 rounded-full blur-2xl"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255, 81, 47, 0.4) 0%, rgba(221, 36, 118, 0.4) 50%, rgba(147, 51, 234, 0.4) 100%)',
                              transform: 'scale(1.3)',
                            }}
                          ></div>

                          {/* Glowing ring */}
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 50%, #9333ea 100%)',
                              padding: '3px',
                              transform: 'scale(1.08)',
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-white"></div>
                          </div>

                          {/* Avatar */}
                          <div
                            className="relative w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white z-10"
                            style={{
                              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            }}
                          >
                            {employee.full_name.charAt(0).toUpperCase()}
                          </div>

                          {/* Status Badge */}
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-20">
                            {employee.is_active ? (
                              <div
                                className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border-2 border-white bg-gradient-to-r from-emerald-400 to-green-500 text-white"
                                style={{
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                }}
                              >
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                Active
                              </div>
                            ) : (
                              <div
                                className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border-2 border-white bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                                style={{
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                }}
                              >
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                Inactive
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Name */}
                        <h1
                          className="text-3xl font-black text-center mb-2"
                          style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {employee.full_name.split(' ').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                          ).join(' ')}
                        </h1>

                        {/* Role and Employee Code */}
                        <div className="flex items-center gap-2 text-slate-600 font-medium mb-4">
                          {employee.position && (
                            <>
                              <span className="text-base">{employee.position}</span>
                              <span className="text-slate-400">·</span>
                            </>
                          )}
                          {employee.employee_id && (
                            <div
                              className="px-3 py-1 rounded-full text-sm font-semibold"
                              style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                              }}
                            >
                              {employee.employee_id}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Info Section */}
                      <div className="mb-6">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
                          Quick Info
                        </h2>

                        <div className="space-y-2">
                          {/* Email */}
                          <div
                            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300 hover:scale-105"
                            style={{
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex-shrink-0"
                                style={{
                                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                }}
                              >
                                <Mail className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                                  Email
                                </p>
                                <p className="text-sm font-medium text-slate-700 truncate">{employee.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Phone */}
                          {employee.phone_number && (
                            <div
                              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300 hover:scale-105"
                              style={{
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex-shrink-0"
                                  style={{
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                  }}
                                >
                                  <Phone className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                                    Phone
                                  </p>
                                  <p className="text-sm font-medium text-slate-700">{employee.phone_number}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Address */}
                          {employee.address && (
                            <div
                              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300 hover:scale-105"
                              style={{
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="p-2 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white flex-shrink-0"
                                  style={{
                                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                                  }}
                                >
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                                    Address
                                  </p>
                                  <p className="text-sm font-medium text-slate-700 line-clamp-2">{employee.address}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Badges Section */}
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                        {/* Position Badge */}
                        {employee.position && (
                          <div
                            className="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-white transition-all duration-300 hover:scale-105"
                            style={{
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                            }}
                          >
                            <Briefcase className="w-4 h-4" />
                            {employee.position}
                          </div>
                        )}

                        {/* Department Badge */}
                        {employee.department && (
                          <div
                            className="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-white transition-all duration-300 hover:scale-105"
                            style={{
                              background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)',
                            }}
                          >
                            <Building className="w-4 h-4" />
                            {employee.department}
                          </div>
                        )}

                        {/* Salary Badge */}
                        {formattedSalary && (
                          <div
                            className="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-white transition-all duration-300 hover:scale-105"
                            style={{
                              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                            }}
                          >
                            <span className="text-base">₹</span>
                            {formattedSalary.replace('₹', '')}
                          </div>
                        )}
                      </div>

                      {/* Hired Date */}
                      {hireDateFormatted && (
                        <div
                          className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50/50 mb-6"
                          style={{
                            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)',
                          }}
                        >
                          <div
                            className="p-2 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                            style={{
                              boxShadow: '0 4px 12px rgba(251, 146, 60, 0.3)',
                            }}
                          >
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                              Hired on
                            </p>
                            <p className="text-base font-bold text-slate-700">{hireDateFormatted}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-red-600 bg-white border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 hover:scale-105"
                          style={{
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                          }}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Bottom decorative gradient */}
                    <div
                      className="h-2"
                      style={{
                        background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)',
                        opacity: 0.5,
                      }}
                    ></div>
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

