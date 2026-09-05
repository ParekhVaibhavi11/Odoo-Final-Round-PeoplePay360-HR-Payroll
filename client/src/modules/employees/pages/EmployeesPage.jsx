import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../../context/ToastContext';
import { getEmployees, createEmployee, updateEmployee } from '../../../services/employeeService';
import EmployeeKanban from '../components/EmployeeKanban';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeFormModal from '../components/EmployeeFormModal';
import { Plus, Search, Filter, ArrowUpDown, LayoutGrid, List, Info, Loader2 } from 'lucide-react';

const EmployeesPage = () => {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { showToast } = useToast();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployees({ page, limit: 8, search });
      if (res.data) {
        setEmployees(res.data.items || []);
        setPagination(res.data.pagination || null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch employees', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, showToast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSaveEmployee = async (formData) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, formData);
        showToast('Employee updated successfully', 'success');
      } else {
        await createEmployee(formData);
        showToast('New employee created successfully', 'success');
      }
      fetchEmployees();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleOpenModal = (emp = null) => {
    setSelectedEmployee(emp);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle matching Screenshots 2 & 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your organization's employees and access their HR records.
          </p>
        </div>
      </div>

      {/* Action Controls Bar matching Screenshots 2 & 3 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New
          </button>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700 shadow-sm"
            />
          </div>

          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" /> Filters
          </button>

          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <ArrowUpDown className="w-4 h-4 text-slate-400" /> Sort
          </button>
        </div>

        {/* Right View Mode Toggle (Kanban vs List) */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm self-start md:self-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'kanban'
                ? 'bg-plum-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-plum-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-plum-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-plum-700'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List
          </button>
        </div>

      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading employee records...</span>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-plum-100/60 shadow-card">
          <p className="text-slate-500 font-medium">No employee records found matching your filters.</p>
        </div>
      ) : viewMode === 'kanban' ? (
        <EmployeeKanban employees={employees} onSelectEmployee={handleOpenModal} />
      ) : (
        <EmployeeTable
          employees={employees}
          pagination={pagination}
          onPageChange={setPage}
          onSelectEmployee={handleOpenModal}
        />
      )}

      {/* Information Banner matching Screenshots 2 & 3 */}
      <div className="bg-plum-50/70 border border-plum-100 rounded-2xl p-4 flex items-center gap-3 text-xs font-medium text-plum-900 shadow-sm">
        <Info className="w-4 h-4 text-plum-700 shrink-0" />
        <span>Select an employee to view their complete HR profile, contracts, attendance, time off and allocations.</span>
      </div>

      {/* Employee Modal Drawer */}
      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEmployee}
        initialData={selectedEmployee}
      />
    </div>
  );
};

export default EmployeesPage;
