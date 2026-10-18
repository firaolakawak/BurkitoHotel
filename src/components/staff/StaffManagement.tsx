import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { Employee, StaffDepartment, StaffStatus } from '../../types/index.ts';
import { StaffMetricsBar } from './StaffMetricsBar.tsx';
import { EmployeeDetailCard } from './EmployeeDetailCard.tsx';
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  Network,
  Download,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Users,
  Building,
  GraduationCap,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const {
    employees,
    selectedEmployee,
    setSelectedEmployee,
    setIsAddStaffOpen,
    updateEmployeeStatus,
    addToast
  } = useHotel();

  // Sub Tabs
  const [subTab, setSubTab] = useState<
    'OVERVIEW' | 'EMPLOYEES' | 'DEPARTMENTS' | 'ATTENDANCE' | 'LEAVE' | 'PERFORMANCE' | 'TRAINING' | 'ORG_CHART'
  >('OVERVIEW');

  // View Mode: Table vs Cards vs Org Chart
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS' | 'ORG_CHART'>('TABLE');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<StaffDepartment | 'ALL'>('ALL');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<StaffStatus | 'ALL'>('ALL');

  // Checkbox selection state
  const [selectedIds, setSelectedIds] = useState<string[]>(['emp-1']);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (departmentFilter !== 'ALL' && emp.department !== departmentFilter) return false;
      if (statusFilter !== 'ALL' && emp.status !== statusFilter) return false;
      if (positionFilter !== 'ALL' && !emp.position.toLowerCase().includes(positionFilter.toLowerCase())) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesId = emp.employeeId.toLowerCase().includes(q);
        const matchesDept = emp.department.toLowerCase().includes(q);
        const matchesPos = emp.position.toLowerCase().includes(q);
        const matchesEmail = emp.email.toLowerCase().includes(q);
        return matchesName || matchesId || matchesDept || matchesPos || matchesEmail;
      }
      return true;
    });
  }, [employees, departmentFilter, statusFilter, positionFilter, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredEmployees.map(e => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Staff Directory Exported',
      message: `Exported directory of ${employees.length} employees to CSV.`
    });
  };

  const getStatusBadgeStyle = (status: StaffStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
      case 'On Leave':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'Suspended':
      default:
        return 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECDD3]';
    }
  };

  return (
    <div className="space-y-5">
      
      {/* 1. Page Header matching attached screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your team, roles, schedules, and performance</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* More Actions Dropdown Button */}
          <button
            onClick={() => addToast({ type: 'info', title: 'Staff Actions', message: 'Batch actions: Send announcements, export rosters, or sync biometric turnstiles.' })}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
          >
            <span>More Actions</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* + Add Staff Primary Blue Button */}
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs with blue underline */}
      <div className="border-b border-slate-200 flex space-x-6 text-xs font-semibold overflow-x-auto scrollbar-none">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'EMPLOYEES', label: 'Employees' },
          { id: 'DEPARTMENTS', label: 'Departments' },
          { id: 'ATTENDANCE', label: 'Attendance' },
          { id: 'LEAVE', label: 'Leave Management' },
          { id: 'PERFORMANCE', label: 'Performance' },
          { id: 'TRAINING', label: 'Training' },
          { id: 'ORG_CHART', label: 'Organization Chart' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`py-3 transition-colors relative whitespace-nowrap ${
              subTab === tab.id
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {subTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 3. 5 KPI Metric Cards */}
      <StaffMetricsBar />

      {/* 4. Filter & Controls Bar matching attached screenshot */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Search + Department + Position + Status + More Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          
          {/* Search employees */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Department dropdown */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="Management">Management</option>
              <option value="Front Office">Front Office</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Maintenance">Maintenance</option>
              <option value="F&B">F&B</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="IT">IT</option>
              <option value="Security">Security</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Position dropdown */}
          <div className="relative">
            <select
              value={positionFilter}
              onChange={e => setPositionFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Positions</option>
              <option value="Manager">Managers & Executives</option>
              <option value="Supervisor">Supervisors</option>
              <option value="Receptionist">Receptionists</option>
              <option value="Attendant">Attendants</option>
              <option value="Technician">Technicians</option>
              <option value="Officer">Security Officers</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* More Filters button */}
          <button
            onClick={() => {
              setDepartmentFilter('ALL');
              setStatusFilter('ALL');
              setPositionFilter('ALL');
              setSearchQuery('');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>More Filters</span>
          </button>

        </div>

        {/* Right: View Toggles (Table / Cards / Org Chart) + Export button */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto">
          
          {/* Segmented View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 text-xs">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                viewMode === 'TABLE'
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                viewMode === 'CARDS'
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('ORG_CHART')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                viewMode === 'ORG_CHART'
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Org Chart
            </button>
          </div>

          {/* Export Dropdown Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

        </div>

      </div>

      {/* 5. Main Workspace Layout */}
      {viewMode === 'TABLE' && subTab === 'OVERVIEW' && (
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          
          {/* Left / Middle: Employee Table */}
          <div className="flex-1 w-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                
                {/* Table Header */}
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200 select-none">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0}
                        onChange={e => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3">Work Type</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredEmployees.map(emp => {
                    const isSelected = selectedEmployee?.id === emp.id;
                    const isChecked = selectedIds.includes(emp.id);

                    return (
                      <tr
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center" onClick={e => handleToggleSelect(emp.id, e)}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Employee Avatar + Name + Joined Date */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                              <img
                                src={emp.avatar}
                                alt={emp.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{emp.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Joined {emp.joinDate}</div>
                            </div>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="py-3 px-3 font-mono font-medium text-slate-500 text-[11px]">
                          {emp.employeeId}
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {emp.department}
                        </td>

                        {/* Position */}
                        <td className="py-3 px-4 text-slate-700">
                          {emp.position}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(emp.status)}`}>
                            {emp.status}
                          </span>
                        </td>

                        {/* Work Type */}
                        <td className="py-3 px-3 text-slate-600">
                          {emp.workType}
                        </td>

                        {/* Phone */}
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {emp.phone}
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 text-blue-600 font-medium">
                          {emp.email}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              const nextStatus = emp.status === 'Active' ? 'On Leave' : emp.status === 'On Leave' ? 'Suspended' : 'Active';
                              updateEmployeeStatus(emp.id, nextStatus as any);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            title="Toggle Status"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>

          {/* Right: Employee Profile Card matching screenshot */}
          {selectedEmployee && (
            <EmployeeDetailCard
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
            />
          )}

        </div>
      )}

      {/* Cards View Mode */}
      {(viewMode === 'CARDS' || subTab === 'EMPLOYEES') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map(emp => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                    <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(emp.status)}`}>
                    {emp.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                  <div className="text-xs text-slate-500 font-medium">{emp.position}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{emp.employeeId} • {emp.department}</div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Joined {emp.joinDate}</span>
                <span className="font-semibold text-blue-600 hover:text-blue-800">View Profile →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Departments View */}
      {subTab === 'DEPARTMENTS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Management', head: 'Sarah Khan', count: 8, budget: 'AED 120,000' },
            { name: 'Front Office', head: 'Ahmed Al Mansoori', count: 24, budget: 'AED 180,000' },
            { name: 'Housekeeping', head: 'Maria Garcia', count: 38, budget: 'AED 240,000' },
            { name: 'Maintenance', head: 'James Wilson', count: 14, budget: 'AED 130,000' },
            { name: 'F&B', head: 'David Chen', count: 28, budget: 'AED 210,000' },
            { name: 'Sales & Marketing', head: 'Lisa Brown', count: 6, budget: 'AED 90,000' },
            { name: 'IT & Systems', head: 'Robert Kim', count: 4, budget: 'AED 65,000' },
            { name: 'Security', head: 'Mohammed Rashed', count: 4, budget: 'AED 45,000' },
          ].map(dept => (
            <div key={dept.name} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{dept.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                  {dept.count} Staff
                </span>
              </div>
              <div className="text-xs text-slate-500">Department Head: <strong className="text-slate-800">{dept.head}</strong></div>
              <div className="text-[11px] text-slate-400">Monthly Budget: {dept.budget}</div>
            </div>
          ))}
        </div>
      )}

      {/* Org Chart View */}
      {(viewMode === 'ORG_CHART' || subTab === 'ORG_CHART') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 overflow-x-auto">
          <div className="text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 mx-auto shadow-md">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80" alt="John Matthews" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-2">John Matthews</h4>
            <p className="text-xs text-blue-600 font-semibold">General Manager</p>
          </div>

          <div className="w-0.5 h-6 bg-slate-200 mx-auto" />

          {/* Hotel Manager */}
          <div className="text-center max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 mx-auto shadow-md">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" alt="Sarah Khan" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1.5">Sarah Khan</h4>
            <p className="text-xs text-emerald-600 font-semibold">Hotel Manager</p>
          </div>

          <div className="w-0.5 h-6 bg-slate-200 mx-auto" />

          {/* Department Heads Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {employees.filter(e => e.position.includes('Manager') || e.position.includes('Supervisor')).slice(0, 4).map(e => (
              <div key={e.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full overflow-hidden mx-auto border border-slate-200">
                  <img src={e.avatar} alt={e.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1">{e.name}</div>
                <div className="text-[10px] text-slate-500">{e.position}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance View */}
      {subTab === 'ATTENDANCE' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today's Shift Attendance</h3>
              <p className="text-xs text-slate-500">Live biometric and RFID keycard turnstile clock-ins for Tue, 14 Oct 2025</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              92 On Duty (73%)
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {employees.map(emp => (
              <div key={emp.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full overflow-hidden">
                    <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{emp.name}</span>
                    <span className="text-slate-400 ml-2 font-mono text-[11px]">{emp.department}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-500">{emp.shift || 'Morning Shift'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(emp.status)}`}>
                    {emp.todayAttendance?.status || emp.status}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] w-16 text-right">
                    {emp.todayAttendance?.time || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Management View */}
      {subTab === 'LEAVE' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Leave Requests & Approvals</h3>
              <p className="text-xs text-slate-500">8 staff members currently on approved annual or medical leave</p>
            </div>
            <button
              onClick={() => addToast({ type: 'info', title: 'Leave Application', message: 'Opening HR leave request portal' })}
              className="px-3.5 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-semibold"
            >
              + Apply Leave
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Fatima Ali', role: 'Receptionist', dates: '14 Oct - 18 Oct 2025', type: 'Annual Leave', status: 'Approved' },
              { name: 'Mohammed Rashed', role: 'Security Officer', dates: '12 Oct - 16 Oct 2025', type: 'Administrative Review', status: 'Suspended' },
              { name: 'Carlos Mendez', role: 'Sous Chef', dates: '15 Oct - 20 Oct 2025', type: 'Annual Vacation', status: 'Approved' },
            ].map((req, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{req.name} ({req.role})</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{req.dates} • {req.type}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training View */}
      {subTab === 'TRAINING' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hospitality Training & Compliance</h3>
              <p className="text-xs text-slate-500">14 certifications due for renewal in Q4 2025</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              14 Modules Due
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Fire Safety & Evacuation', enrolled: 18, due: '20 Oct 2025', rate: '85%' },
              { title: 'HACCP & Food Hygiene', enrolled: 28, due: '25 Oct 2025', rate: '92%' },
              { title: 'Luxury Guest Etiquette', enrolled: 42, due: '30 Oct 2025', rate: '96%' }
            ].map(m => (
              <div key={m.title} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900">{m.title}</div>
                <div className="text-slate-500 text-[11px]">{m.enrolled} staff enrolled • Due: {m.due}</div>
                <div className="text-emerald-600 font-bold font-mono">Completion: {m.rate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
