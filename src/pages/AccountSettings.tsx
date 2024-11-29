import React, { useState } from 'react';
import { Eye, EyeOff, Edit2, X } from 'lucide-react';
import { Toast } from '../components/common/Toast';

export function AccountSettings() {
  const [editableFields, setEditableFields] = useState({
    email: false,
    phone: false,
    address: false
  });

  const [formData, setFormData] = useState({
    email: 'user@example.com',
    phone: '0532 XXX XX XX',
    address: 'Kadıköy, İstanbul',
    name: 'Yağız Demiray',
    bloodType: 'A+'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Değişiklikler başarıyla kaydedildi.', 'success');
    setEditableFields({
      email: false,
      phone: false,
      address: false
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('Yeni parolalar eşleşmiyor.', 'error');
      return;
    }
    if (passwords.newPassword.length < 6) {
      showToast('Yeni parola en az 6 karakter olmalıdır.', 'error');
      return;
    }
    showToast('Parola başarıyla güncellendi.', 'success');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-20">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hesap Ayarları</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Hesap bilgilerinizi güncelleyin ve güvenlik ayarlarınızı yönetin.
          </p>
        </div>

        {/* Profile Settings */}
        <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ad Soyad
            </label>
            <p className="mt-1 text-gray-900 dark:text-white">{formData.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kan Grubu
            </label>
            <p className="mt-1 text-gray-900 dark:text-white">{formData.bloodType}</p>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                E-posta
              </label>
              <button
                type="button"
                onClick={() => setEditableFields({ ...editableFields, email: !editableFields.email })}
                className="text-red-600 hover:text-red-700"
              >
                {editableFields.email ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </button>
            </div>
            {editableFields.email ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            ) : (
              <p className="mt-1 text-gray-900 dark:text-white">{formData.email}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefon
              </label>
              <button
                type="button"
                onClick={() => setEditableFields({ ...editableFields, phone: !editableFields.phone })}
                className="text-red-600 hover:text-red-700"
              >
                {editableFields.phone ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </button>
            </div>
            {editableFields.phone ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            ) : (
              <p className="mt-1 text-gray-900 dark:text-white">{formData.phone}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adres
              </label>
              <button
                type="button"
                onClick={() => setEditableFields({ ...editableFields, address: !editableFields.address })}
                className="text-red-600 hover:text-red-700"
              >
                {editableFields.address ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </button>
            </div>
            {editableFields.address ? (
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            ) : (
              <p className="mt-1 text-gray-900 dark:text-white">{formData.address}</p>
            )}
          </div>

          {(editableFields.email || editableFields.phone || editableFields.address) && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          )}
        </form>

        {/* Password Change */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Parola Değiştir</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mevcut Parola
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Yeni Parola
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Yeni Parola (Tekrar)
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Parolayı Değiştir
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}