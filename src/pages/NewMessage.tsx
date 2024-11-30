import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { chatService } from '../services/chatService';
import { BloodDonationContext } from '../context/BloodDonationContext';

export default function NewMessage() {
  // const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [recipientInfo, setRecipientInfo] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const toUserId = searchParams.get('toUserId');
  // const bloodRequestId = searchParams.get('requesterUserId');
  const {selectedBloodRequestId} = useContext(BloodDonationContext)

  console.log("TTTTTTTTTTTTTTTT : " , selectedBloodRequestId)

  // useEffect(() => {
  //   const fetchRecipientInfo = async () => {
  //     if (!bloodRequestId) {
  //       setError('Alıcı bilgisi bulunamadı');
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`https://localhost:7132/api/User/GetUserById/${bloodRequestId}`, {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //         }
  //       });

  //       if (!response.ok) throw new Error('Kullanıcı bilgileri alınamadı');

  //       const data = await response.json();
  //       setRecipientInfo({
  //         id: bloodRequestId,
  //         name: data.fullName || 'İsimsiz Kullanıcı'
  //       });
  //     } catch (err) {
  //       setError('Kullanıcı bilgileri yüklenirken bir hata oluştu');
  //       console.error('Error fetching recipient info:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRecipientInfo();
  // }, [toUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || ! selectedBloodRequestId) return;

    // try {
    //   await chatService.sendMessage({
    //     toUserId: selectedBloodRequestId,
    //     content: message
    //   });
    //   navigate('/messages');
    // } catch (error) {
    //   console.error('Error sending message:', error);
    //   setError('Mesaj gönderilirken bir hata oluştu');
    // }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center text-red-600 dark:text-red-400">
              {error}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/messages')}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Mesajlara Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/messages')}
                className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Yeni Mesaj
                </h2>
                <h1>
                  selected User Id : 
                </h1>
                <p>
                  
                  {selectedBloodRequestId}

                </p>
                {recipientInfo && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Alıcı: {recipientInfo.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="p-4">
            <div className="mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white resize-none"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Gönder</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}