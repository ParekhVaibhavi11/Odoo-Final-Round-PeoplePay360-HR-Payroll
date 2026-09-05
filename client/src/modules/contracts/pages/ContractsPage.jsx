import React, { useState, useEffect } from 'react';
import { getContracts, createContract, updateContract, deleteContract } from '../../../services/contractService';
import { getEmployees } from '../../../services/employeeService';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { Plus, Loader2, Pencil, Trash2, X } from 'lucide-react';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
    wage: '',
    salary_structure_id: '',
    department: 'Engineering',
    job_position: 'Developer',
    status: 'ACTIVE',
  });

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, eRes, sRes] = await Promise.all([
        getContracts({ limit: 50 }),
        getEmployees({ limit: 100 }),
        api.get('/salary-structures'),
      ]);
      if (cRes.data?.items) setContracts(cRes.data.items);
      if (eRes.data?.items) setEmployees(eRes.data.items);
      if (sRes.data?.items) setStructures(sRes.data.items);
    } catch (err) {
      showToast(err.message || 'Failed to fetch contracts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (contract = null) => {
    setSelectedContract(contract);
    if (contract) {
      setFormData({
        employee_id: contract.employee_id || '',
        start_date: contract.start_date ? contract.start_date.split('T')[0] : '',
        end_date: contract.end_date ? contract.end_date.split('T')[0] : '',
        wage: contract.wage || '',
        salary_structure_id: contract.salary_structure_id || '',
        department: contract.department || 'Engineering',
        job_position: contract.job_position || 'Developer',
        status: contract.status || 'ACTIVE',
      });
    } else {
      setFormData({
        employee_id: '',
        start_date: '',
        end_date: '',
        wage: '',
        salary_structure_id: '',
        department: 'Engineering',
        job_position: 'Developer',
        status: 'ACTIVE',
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedContract) {
        await updateContract(selectedContract.id, formData);
        showToast('Contract updated successfully', 'success');
      } else {
        await createContract(formData);
        showToast('New contract created successfully', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to save contract', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) return;
    try {
      await deleteContract(id);
      showToast('Contract deleted successfully', 'success');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to delete contract', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contracts</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track historical employee contracts and manage period wage terms.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading contracts...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Salary Structure</th>
                  <th className="py-4 px-6">Wage ($)</th>
                  <th className="py-4 px-6">Start Date</th>
                  <th className="py-4 px-6">End Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-plum-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {c.first_name} {c.last_name}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{c.department}</td>
                    <td className="py-4 px-6 font-semibold text-plum-800">{c.structure_name || 'Standard'}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold">${parseFloat(c.wage).toLocaleString()}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{new Date(c.start_date).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{c.end_date ? new Date(c.end_date).toLocaleDateString() : 'Indefinite'}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(c)}
                          className="p-1.5 text-slate-400 hover:text-plum-700 hover:bg-plum-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for creating/editing contract */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800">{selectedContract ? 'Edit Contract' : 'New Employment Contract'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Employee</label>
                <select
                  required
                  disabled={!!selectedContract}
                  value={formData.employee_id}
                  onChange={(e) => {
                    const emp = employees.find(empItem => empItem.id === parseInt(e.target.value, 10));
                    setFormData({
                      ...formData,
                      employee_id: e.target.value,
                      department: emp ? emp.department : formData.department,
                      job_position: emp ? emp.job_position : formData.job_position,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm"
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Assigned Salary Structure</label>
                <select
                  value={formData.salary_structure_id}
                  onChange={(e) => setFormData({ ...formData, salary_structure_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm"
                >
                  <option value="">Select Structure</option>
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Monthly Wage ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.wage}
                    onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-xl text-sm font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-plum-700 text-white rounded-xl text-sm font-semibold">
                  {selectedContract ? 'Update Contract' : 'Save Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;
