import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { Sliders, Plus, Trash2, Pencil, Loader2, ArrowUp, ArrowDown, X } from 'lucide-react';

const StructuresRulesPage = () => {
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [structureModal, setStructureModal] = useState(false);
  const [ruleModal, setRuleModal] = useState(false);

  const [structForm, setStructForm] = useState({ name: '', code: '', description: '' });
  const [ruleForm, setRuleForm] = useState({
    name: '',
    code: '',
    category: 'ALLOWANCE',
    sequence: 10,
    computation_type: 'PERCENTAGE',
    amount_fixed: 0,
    percentage_rate: 10,
    percentage_base_code: 'BASIC',
    formula_script: '',
  });

  const { showToast } = useToast();

  const fetchStructures = async () => {
    setLoading(true);
    try {
      const res = await api.get('/salary-structures');
      if (res.data?.items) {
        setStructures(res.data.items);
        if (res.data.items.length > 0 && !selectedStructure) {
          setSelectedStructure(res.data.items[0]);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch salary structures', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRules = useCallback(async (structureId) => {
    try {
      const res = await api.get(`/salary-rules/structure/${structureId}`);
      if (res.data) setRules(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch rules', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    fetchStructures();
  }, []);

  useEffect(() => {
    if (selectedStructure) {
      fetchRules(selectedStructure.id);
    }
  }, [selectedStructure, fetchRules]);

  const handleSaveStructure = async (e) => {
    e.preventDefault();
    try {
      await api.post('/salary-structures', structForm);
      showToast('Salary structure created!', 'success');
      setStructureModal(false);
      setStructForm({ name: '', code: '', description: '' });
      fetchStructures();
    } catch (err) {
      showToast(err.message || 'Failed to create structure', 'error');
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    if (!selectedStructure) return;
    try {
      await api.post('/salary-rules', {
        ...ruleForm,
        structure_id: selectedStructure.id,
      });
      showToast('Salary rule created!', 'success');
      setRuleModal(false);
      setRuleForm({
        name: '',
        code: '',
        category: 'ALLOWANCE',
        sequence: 10,
        computation_type: 'PERCENTAGE',
        amount_fixed: 0,
        percentage_rate: 10,
        percentage_base_code: 'BASIC',
        formula_script: '',
      });
      fetchRules(selectedStructure.id);
    } catch (err) {
      showToast(err.message || 'Failed to create salary rule', 'error');
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Delete this salary rule?')) return;
    try {
      await api.delete(`/salary-rules/${ruleId}`);
      showToast('Salary rule deleted', 'success');
      fetchRules(selectedStructure.id);
    } catch (err) {
      showToast(err.message || 'Failed to delete rule', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Salary Structures & Rules</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Define sequenced rules for calculating Basic, Allowances, Gross, Deductions, and Net salary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStructureModal(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-slate-400" /> New Structure
          </button>
          <button
            onClick={() => setRuleModal(true)}
            disabled={!selectedStructure}
            className="px-5 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Salary Rule
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Structures List Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 shadow-card border border-plum-100/60 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase px-3 py-2">Structures ({structures.length})</h3>
            <div className="space-y-1">
              {structures.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStructure(s)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between ${
                    selectedStructure?.id === s.id
                      ? 'bg-plum-700 text-white font-bold shadow-md'
                      : 'hover:bg-plum-50 text-slate-700 font-semibold'
                  }`}
                >
                  <div>
                    <div className="text-sm">{s.name}</div>
                    <div className={`text-xs ${selectedStructure?.id === s.id ? 'text-plum-200' : 'text-slate-400'}`}>
                      Code: {s.code} • {s.rule_count || 0} Rules
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rules Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">
                Rule Sequence for {selectedStructure?.name || 'Selected Structure'}
              </h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                  <th className="py-3.5 px-6">Seq</th>
                  <th className="py-3.5 px-6">Rule Name</th>
                  <th className="py-3.5 px-6">Code</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Computation</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-plum-50/40">
                    <td className="py-3.5 px-6 font-bold text-slate-400">{r.sequence}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">{r.name}</td>
                    <td className="py-3.5 px-6 font-mono text-xs text-plum-800 font-bold">{r.code}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        r.category === 'BASIC' ? 'bg-blue-50 text-blue-700' :
                        r.category === 'ALLOWANCE' ? 'bg-emerald-50 text-emerald-700' :
                        r.category === 'DEDUCTION' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-600">
                      {r.computation_type === 'FIXED' ? `$${r.amount_fixed}` :
                       r.computation_type === 'PERCENTAGE' ? `${r.percentage_rate}% of ${r.percentage_base_code || 'BASIC'}` : 'Formula'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button onClick={() => handleDeleteRule(r.id)} className="p-1 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Structure Modal */}
      {structureModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">New Salary Structure</h3>
            <form onSubmit={handleSaveStructure} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Structure Name</label>
                <input
                  type="text"
                  required
                  value={structForm.name}
                  onChange={(e) => setStructForm({ ...structForm, name: e.target.value })}
                  placeholder="e.g. Regular Monthly Salary"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Structure Code</label>
                <input
                  type="text"
                  required
                  value={structForm.code}
                  onChange={(e) => setStructForm({ ...structForm, code: e.target.value.toUpperCase() })}
                  placeholder="REG_MONTHLY"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setStructureModal(false)} className="px-4 py-2 border rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-plum-700 text-white rounded-xl text-sm font-semibold">Save Structure</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rule Modal */}
      {ruleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Add Salary Computation Rule</h3>
            <form onSubmit={handleSaveRule} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Rule Name</label>
                  <input
                    type="text"
                    required
                    value={ruleForm.name}
                    onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                    placeholder="House Rent Allowance"
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Rule Code</label>
                  <input
                    type="text"
                    required
                    value={ruleForm.code}
                    onChange={(e) => setRuleForm({ ...ruleForm, code: e.target.value.toUpperCase() })}
                    placeholder="HRA"
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={ruleForm.category}
                    onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  >
                    <option value="BASIC">BASIC</option>
                    <option value="ALLOWANCE">ALLOWANCE</option>
                    <option value="GROSS">GROSS</option>
                    <option value="DEDUCTION">DEDUCTION</option>
                    <option value="NET">NET</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Sequence #</label>
                  <input
                    type="number"
                    required
                    value={ruleForm.sequence}
                    onChange={(e) => setRuleForm({ ...ruleForm, sequence: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Computation</label>
                  <select
                    value={ruleForm.computation_type}
                    onChange={(e) => setRuleForm({ ...ruleForm, computation_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  >
                    <option value="FIXED">FIXED</option>
                    <option value="PERCENTAGE">PERCENTAGE</option>
                    <option value="FORMULA">FORMULA</option>
                  </select>
                </div>

                {ruleForm.computation_type === 'FIXED' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Fixed Amount ($)</label>
                    <input
                      type="number"
                      value={ruleForm.amount_fixed}
                      onChange={(e) => setRuleForm({ ...ruleForm, amount_fixed: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                    />
                  </div>
                ) : ruleForm.computation_type === 'PERCENTAGE' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Rate %</label>
                    <input
                      type="number"
                      value={ruleForm.percentage_rate}
                      onChange={(e) => setRuleForm({ ...ruleForm, percentage_rate: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setRuleModal(false)} className="px-4 py-2 border rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-plum-700 text-white rounded-xl text-sm font-semibold">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructuresRulesPage;
