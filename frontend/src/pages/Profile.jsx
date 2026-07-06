import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';
import { updateProfile } from '../services/userService';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email });
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await updateProfile(data);
      if (response.data.success) {
        dispatch(setUser(response.data.data.user));
        toast.success('Profile updated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button className="absolute inset-0 rounded-full bg-[var(--overlay)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera size={20} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-[var(--text-secondary)]">{user?.email}</p>
          <p className="text-xs text-[var(--text-secondary)] capitalize mt-1">{user?.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-3 bg-[var(--bg-highlight)] border border-transparent rounded-md focus:outline-none focus:border-[var(--border-hover)] transition"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 bg-[var(--bg-highlight)] border border-transparent rounded-md focus:outline-none focus:border-[var(--border-hover)] transition"
            disabled
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
