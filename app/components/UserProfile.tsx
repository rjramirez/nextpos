'use client';

import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      try {
        await signOut();
        toast.success('Logged out successfully!');
      } catch (error) {
        toast.error('Logout failed');
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <img
        src={user.user_metadata.avatar_url || '/default-avatar.png'}
        alt="User Avatar"
        className="w-10 h-10 rounded-full"
      />
      <span className="font-semibold">{user.user_metadata.full_name || user.email}</span>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
