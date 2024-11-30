import React from 'react';
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  recipient: string;
  subject: string;
  message: string;
}

const NewMessageForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // API'ye mesaj gönderme işlemi
    console.log('Mesaj gönderiliyor:', formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Yeni Mesaj</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Alıcı:</label>
        <input
          type="text"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Konu:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex-grow mb-4">
        <label className="block mb-2">Mesaj:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full h-[200px] p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Gönder
      </button>
    </form>
  );
};

export default NewMessageForm; 