import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  Building,
  X,
  GraduationCap,
} from 'lucide-react';
import { User, FeeStatus } from '../../types';

export const StudentManager: React.FC = () => {
  const { students, fees, addStudent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FeeStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    hostelBlock: 'Aryabhata Hostel (Block B)',
    roomNo: '',
    phone: '',
  });

  const getStudentFeeStatus = (studentId?: string): FeeStatus => {
    if (!studentId) return 'pending';
    const fee = fees.find((f) => f.studentId === studentId);
    return fee ? fee.status : 'pending';
  };

  const filteredStudents = students.filter((s) => {
    const status = getStudentFeeStatus(s.studentId);
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchId = s.studentId?.toLowerCase().includes(q);
      const matchEmail = s.email.toLowerCase().includes(q);
      return matchName || matchId || matchEmail;
    }
    return true;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addStudent({
      name: formData.name,
      email: formData.email,
      studentId: formData.studentId || `STU20260${students.length + 1}`,
      hostelBlock: formData.hostelBlock,
      roomNo: formData.roomNo || '101',
      phone: formData.phone || '+91 98000 11111',
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      studentId: '',
      hostelBlock: 'Aryabhata Hostel (Block B)',
      roomNo: '',
      phone: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Student Directory</h2>
          <p className="text-xs text-slate-500">
            Registered campus hostel residents and monthly dining subscription records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      {/* Filter and search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name, roll ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Fee Status:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({students.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('under_verification')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'under_verification'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Under Verification
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Paid
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Student</th>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Hostel / Room</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">September Fee</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((s) => {
                const status = getStudentFeeStatus(s.studentId);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-slate-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-700">
                      {s.studentId}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800">{s.hostelBlock}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Room: {s.roomNo}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-mono text-[11px]">
                      {s.phone}
                    </td>
                    <td className="py-4 px-4">
                      {status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      ) : status === 'under_verification' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" /> Verification Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3" /> Pending (₹2,500)
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <span className="text-[11px] text-slate-400">Active</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                👨‍🎓
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Add New Student</h3>
                <p className="text-xs text-slate-500">Register a new hostel dining subscriber</p>
              </div>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Mehra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll / ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU202609"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rohan.mehra@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hostel Block</label>
                  <select
                    value={formData.hostelBlock}
                    onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="Aryabhata Hostel (Block B)">Aryabhata (Block B)</option>
                    <option value="Bhaskara Hostel (Block A)">Bhaskara (Block A)</option>
                    <option value="Gargi Girls Hostel (Block G)">Gargi (Block G)</option>
                    <option value="Tagore Hostel (Block C)">Tagore (Block C)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room No</label>
                  <input
                    type="text"
                    placeholder="e.g. B-205"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
