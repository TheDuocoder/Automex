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
      <Card className="shadow-lg border-none">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              Employees ({filteredEmployees.length})
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddModal} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Employee
                  </Button>
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
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Add Employee
                            </>
                          )}
                        </Button>
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
                // Convert salary to Indian Rupees (assuming salary is in USD, 1 USD = 83 INR)
                const salaryInRupees = employee.salary ? Math.round(employee.salary * 83) : null;
                const formattedSalary = salaryInRupees 
                  ? `₹${salaryInRupees.toLocaleString('en-IN')}/year`
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
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group"
                    style={{
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    {/* Edit and Delete Buttons - Top Right */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors shadow-sm"
                        title="Edit Employee"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors shadow-sm"
                        title="Delete Employee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Employee Avatar and Name Section */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div 
                          className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8E9B 100%)',
                          }}
                        >
                          {employee.full_name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Name and Status */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            {employee.full_name.split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ')}
                          </h3>
                          {employee.is_active ? (
                            <Badge className="text-xs px-2.5 py-1 bg-green-500 text-white border-0 shadow-sm">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="text-xs px-2.5 py-1 bg-red-500 text-white border-0 shadow-sm">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2.5 text-sm text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      {employee.phone_number && (
                        <div className="flex items-center gap-2.5 text-sm text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{employee.phone_number}</span>
                        </div>
                      )}
                    </div>

                    {/* Department and Team Tags */}
                    {(employee.position || employee.department) && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {employee.position && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-3 py-1.5 border-blue-200 bg-blue-50 text-blue-700 font-medium"
                          >
                            <Briefcase className="h-3 w-3 mr-1.5" />
                            {employee.position}
                          </Badge>
                        )}
                        {employee.department && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-3 py-1.5 border-purple-200 bg-purple-50 text-purple-700 font-medium"
                          >
                            <Building className="h-3 w-3 mr-1.5" />
                            {employee.department}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Salary - Highlighted Green Badge */}
                    {formattedSalary && (
                      <div className="mb-4">
                        <div 
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-base text-white shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          }}
                        >
                          <DollarSign className="h-4 w-4" />
                          <span>{formattedSalary}</span>
                        </div>
                      </div>
                    )}

                    {/* Hire Date */}
                    {hireDateFormatted && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600 mb-4">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">Hired: {hireDateFormatted}</span>
                      </div>
                    )}

                    {/* Last Working Day */}
                    {employee.last_working_day && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600 mb-4">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">Last Working Day: {new Date(employee.last_working_day).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</span>
                      </div>
                    )}

                    {/* Employee ID - Bottom */}
                    {employee.employee_id && (
                      <div className="pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">Employee ID: <span className="text-gray-700">{employee.employee_id}</span></span>
                      </div>
                    )}
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
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Update Employee
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Employees;

