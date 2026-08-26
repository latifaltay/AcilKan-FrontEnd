import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOT: İletişim formu için henüz bir backend endpoint'i bulunmuyor.
    toast.success("Mesajınız alındı. En kısa sürede size dönüş yapacağız.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-red-600 text-center mb-8">
            Bize Ulaşın
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* İletişim Bilgileri */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                İletişim Bilgilerimiz
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                  <Phone className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <span>0850 XXX XX XX</span>
                </div>

                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                  <Mail className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <span>iletisim@kandostum.com</span>
                </div>

                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <span>Örnek Mahallesi, Kan Bağışı Sokak No:1, İstanbul</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Çalışma Saatleri
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p>Cumartesi: 10:00 - 14:00</p>
                  <p>Pazar: Kapalı</p>
                </div>
              </div>
            </div>

            {/* İletişim Formu */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Mesaj Gönderin
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="name"
                  label="Ad Soyad"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <Input
                  id="email"
                  label="E-posta Adresi"
                  type="email"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <Input
                  id="subject"
                  label="Konu"
                  required
                  fullWidth
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" fullWidth>
                  Mesaj Gönder
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
