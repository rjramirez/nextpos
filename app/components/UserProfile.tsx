'use client';

import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error.message);
        } else {
          setRole(roles?.role || 'No role assigned');
        }
      }
    };

    fetchUserRole();
  }, [user]);

  if (!user) return null;

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      try {
        await signOut();
        toast.success('Logged out successfully!');
      } catch {
        toast.error('Logout failed');
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Image
        src={user.user_metadata.avatar_url || '/images/item-default.jpg'}
        alt="User Avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className="font-semibold">{user.user_metadata.full_name || user.email}</span>
      {role && (
        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">
          {role}
        </span>
      )}
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
