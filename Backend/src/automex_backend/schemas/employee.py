"""
Employee schemas for API validation
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator, model_validator


class EmployeeRead(BaseModel):
    """Schema for reading employee data"""
    id: int
    full_name: str
    email: str
    phone_number: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    address: Optional[str] = None
    salary: Optional[float] = None
    hire_date: Optional[datetime] = None
    last_working_day: Optional[datetime] = None
    employee_id: Optional[str] = None
    notes: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    created_by_user_id: int
    
    model_config = ConfigDict(from_attributes=True)


class EmployeeCreate(BaseModel):
    """Schema for creating a new employee"""
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone_number: Optional[str] = Field(None, max_length=20)
    position: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None
    salary: Optional[float] = Field(None, ge=0)
    hire_date: Optional[datetime] = None
    last_working_day: Optional[datetime] = None
    employee_id: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None
    is_active: bool = True

    @model_validator(mode='before')
    @classmethod
    def convert_empty_strings_to_none(cls, data):
        """Convert empty strings to None for optional fields and parse dates"""
        if isinstance(data, dict):
            # Fields that should be None if empty string
            optional_string_fields = [
                'phone_number', 'position', 'department', 'address', 
                'employee_id', 'notes'
            ]
            for field in optional_string_fields:
                if field in data and data[field] == '':
                    data[field] = None
            
            # Handle date fields - convert empty strings to None
            # Pydantic will automatically parse valid ISO date strings (YYYY-MM-DD format)
            date_fields = ['hire_date', 'last_working_day']
            for field in date_fields:
                if field in data:
                    if data[field] == '' or data[field] is None:
                        data[field] = None
            
            # Handle salary - convert empty string to None
            if 'salary' in data:
                if data['salary'] == '':
                    data['salary'] = None
                elif isinstance(data['salary'], str):
                    try:
                        data['salary'] = float(data['salary'])
                    except (ValueError, TypeError):
                        data['salary'] = None
        
        return data


class EmployeeUpdate(BaseModel):
    """Schema for updating employee data"""
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, max_length=20)
    position: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None
    salary: Optional[float] = Field(None, ge=0)
    hire_date: Optional[datetime] = None
    last_working_day: Optional[datetime] = None
    employee_id: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None
    is_active: Optional[bool] = None

    @model_validator(mode='before')
    @classmethod
    def convert_empty_strings_to_none(cls, data):
        """Convert empty strings to None for optional fields and parse dates"""
        if isinstance(data, dict):
            # Fields that should be None if empty string
            optional_string_fields = [
                'phone_number', 'position', 'department', 'address', 
                'employee_id', 'notes', 'full_name'
            ]
            for field in optional_string_fields:
                if field in data and data[field] == '':
                    data[field] = None
            
            # Handle date fields - convert empty strings to None
            # Pydantic will automatically parse valid ISO date strings (YYYY-MM-DD format)
            date_fields = ['hire_date', 'last_working_day']
            for field in date_fields:
                if field in data:
                    if data[field] == '' or data[field] is None:
                        data[field] = None
            
            # Handle salary - convert empty string to None
            if 'salary' in data:
                if data['salary'] == '':
                    data['salary'] = None
                elif isinstance(data['salary'], str):
                    try:
                        data['salary'] = float(data['salary'])
                    except (ValueError, TypeError):
                        data['salary'] = None
        
        return data

