import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { changePassword } from '../services/userService';

export default function Settings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await changePassword(data);
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <KeyRound size={20} /> Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                {...register('currentPassword', { required: 'Required' })}
                className="w-full px-4 py-3 bg-[var(--bg-highlight)] border border-transparent rounded-md focus:outline-none focus:border-[var(--border-hover)] transition pr-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-red-400 text-sm mt-1">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                {...register('newPassword', { required: 'Required', minLength: { value: 6, message: 'At least 6 characters' } })}
                className="w-full px-4 py-3 bg-[var(--bg-highlight)] border border-transparent rounded-md focus:outline-none focus:border-[var(--border-hover)] transition pr-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </section>
    </div>
  );
}
