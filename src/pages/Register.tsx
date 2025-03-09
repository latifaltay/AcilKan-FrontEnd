import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar } from "lucide-react";
import { toast } from "react-toastify"; // 🔥 Notify için eklendi
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
}

enum BloodGroupType {
  APositive = 1,
  ANegative = 2,
  BPositive = 3,
  BNegative = 4,
  ABPositive = 5,
  ABNegative = 6,
  OPositive = 7,
  ONegative = 8,
}

const bloodGroups = [
  { id: BloodGroupType.APositive, label: "A RH +" },
  { id: BloodGroupType.ANegative, label: "A RH -" },
  { id: BloodGroupType.BPositive, label: "B RH +" },
  { id: BloodGroupType.BNegative, label: "B RH -" },
  { id: BloodGroupType.ABPositive, label: "AB RH +" },
  { id: BloodGroupType.ABNegative, label: "AB RH -" },
  { id: BloodGroupType.OPositive, label: "0 RH +" },
  { id: BloodGroupType.ONegative, label: "0 RH -" },
];

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    tc: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    cityId: "",
    districtId: "",
    gender: true,
    birthDate: "",
  });

  const [tcNoError, setTcNoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7132/api/City/GetAllCity"
        );

        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.cityId) {
        try {
          const response = await axios.get(
            `https://localhost:7132/api/City/GetDistrictsByCityId/${formData.cityId}`
          );
          setDistricts(response.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [formData.cityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Parolalar eşleşmiyor");
      return;
    }
    setPasswordError("");

    try {
      const dataToSubmit = {
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        bloodGroup: parseInt(formData.bloodGroup),
        cityId: parseInt(formData.cityId),
        districtId: parseInt(formData.districtId),
        tc: formData.tc,
        gender: formData.gender,
        birthDate: formData.birthDate,
      };

      await axios.post(
        "https://localhost:7132/api/AppUser/CreateUser",
        dataToSubmit
      );
      // ✅ Başarı mesajı göster
      toast.success("✅ Kullanıcı başarıyla oluşturuldu!", {
        position: "top-center",
        autoClose: 3000, // 3 saniye sonra kaybolur
      });

      // ✅ 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        navigate("/login");
      }, 3000);

      navigate("/login");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const onSwitchToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-red-600">
            Kan Bağışı
          </h2>
          <p className="text-center text-gray-600 mt-2">Yeni hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ad
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Soyad
                </label>
                <input
                  id="surname"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                  value={formData.surname}
                  onChange={(e) =>
                    setFormData({ ...formData, surname: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="tc"
                  className="block text-sm font-medium text-gray-700"
                >
                  TC Kimlik No
                </label>
                <input
                  id="tc"
                  type="text"
                  required
                  maxLength={11}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                  value={formData.tc}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!/^\d*$/.test(value)) {
                      setTcNoError(
                        "TC Kimlik Numarası sadece rakamlardan oluşmalıdır."
                      );
                      return;
                    } else {
                      setTcNoError(""); // Geçerli girişte hata mesajını kaldır
                    }

                    if (value.length > 11) {
                      return; // 11 haneyi aşmasını engelle
                    }

                    setFormData({ ...formData, tc: value });
                  }}
                />
                {tcNoError && (
                  <p className="mt-1 text-sm text-red-600">{tcNoError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 items-center">
                {/* Doğum Tarihi (6 birim) */}
                <div className="col-span-6">
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Doğum Tarihi
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={
                        formData.birthDate ? new Date(formData.birthDate) : null
                      }
                      onChange={(date: Date | null) => {
                        if (date) {
                          setFormData({
                            ...formData,
                            birthDate: date.toISOString().split("T")[0],
                          });
                        }
                      }}
                      maxDate={new Date()} // Gelecekteki tarihleri engelle
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      dateFormat="yyyy-MM-dd" // YYYY-MM-DD formatında tarih göster
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Cinsiyet (6 birim) */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Cinsiyet
                  </label>
                  <div className="mt-1 flex items-center space-x-12">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === true}
                        onChange={() =>
                          setFormData({ ...formData, gender: true })
                        }
                        className="form-radio text-red-600"
                      />
                      <span className="ml-2">Erkek</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === false}
                        onChange={() =>
                          setFormData({ ...formData, gender: false })
                        }
                        className="form-radio text-red-600"
                      />
                      <span className="ml-2">Kadın</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-posta Adresi
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telefon Numarası
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  maxLength={12} // Maksimum 12 hane olmalı (90 + 10 haneli numara)
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // ✅ Sadece rakamları al
                    console.log("Girilen Telefon Numarası:", value); // ✅ Girişi kontrol et

                    if (value.startsWith("0")) {
                      value = value.substring(1); // ✅ Başta `0` varsa at
                    }

                    if (value.length === 10) {
                      value = "90" + value; // ✅ 10 haneliyse başına `90` ekle
                    } else if (value.length > 12) {
                      value = value.substring(0, 12); // ✅ 12 haneden uzun olamaz
                    }

                    console.log("Düzenlenmiş Telefon Numarası:", value); // ✅ Son hali kontrol et

                    setFormData({ ...formData, phoneNumber: value });
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kan Grubu
                </label>
                <select
                  id="bloodGroup"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                  value={formData.bloodGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodGroup: e.target.value })
                  }
                >
                  <option value="">Seçiniz</option>
                  {bloodGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="cityId"
                className="block text-sm font-medium text-gray-700"
              >
                Şehir
              </label>
              <select
                id="cityId"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                value={formData.cityId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cityId: e.target.value,
                    districtId: "",
                  })
                }
              >
                <option key="empty-city" value="">
                  Şehir Seçiniz
                </option>{" "}
                {cities.map((city, index) => (
                  <option key={`city-${city.id}-${index}`} value={city.id}>
                    {" "}
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="districtId"
                className="block text-sm font-medium text-gray-700"
              >
                İlçe
              </label>
              <select
                id="districtId"
                required
                disabled={!formData.cityId}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={formData.districtId}
                onChange={(e) => {
                  console.log("Seçilen İlçe ID (Ham Değer):", e.target.value); // ✅ Burada sayı olmalı
                  setFormData({
                    ...formData,
                    districtId: e.target.value,
                  });
                }}
              >
                <option key="empty-district" value="0">
                  {" "}
                  {/* ✅ Varsayılan olarak `0` */}
                  İlçe Seçiniz
                </option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {" "}
                    {/* ✅ `district.id` kullanıyoruz */}
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Kayıt Ol
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Giriş Yapın
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
