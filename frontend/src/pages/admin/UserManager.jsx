import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { Users, Shield, Trash2, CheckCircle, UserCheck } from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      alert('Failed to update role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user account?')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user.');
      }
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="pb-6 border-b border-gray-800">
        <h1 className="font-serif-luxury text-3xl font-bold text-white">
          User <span className="gold-gradient-text">Account Management</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Review registered VIP members, assign admin privileges, and manage account security.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading User Registry...</div>
      ) : (
        <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#121212] text-xs uppercase text-[#D4AF37] border-b border-gray-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#181818] transition-colors">
                  <td className="p-4 font-semibold text-white flex items-center space-x-3">
                    <img src={u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt={u.name} className="w-8 h-8 rounded-full border border-gray-700" />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4 text-gray-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-300'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleRoleToggle(u.id, u.role)}
                      className="px-3 py-1 rounded-lg bg-[#181818] border border-gray-700 text-xs text-[#FFD700] font-semibold hover:bg-[#222]"
                    >
                      {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default UserManager;
