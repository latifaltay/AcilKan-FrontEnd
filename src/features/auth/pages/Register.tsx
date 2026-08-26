import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { authService } from "../authService";
import {
  locationService,
  type City,
  type District,
} from "../../../shared/api/locationService";
import { bloodGroups } from "../../../shared/lib/bloodGroups";
import { validateEmail, validatePhone } from "../../../shared/lib/validation";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { Input } from "../../../shared/ui/Input";
import { Select } from "../../../shared/ui/Select";
import { Button } from "../../../shared/ui/Button";
import type { BloodGroupType, GenderType } from "../../../shared/types";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    identityNumber: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "" as BloodGroupType | "",
    cityId: "",
    districtId: "",
    gender: "Male" as GenderType,
    birthDate: "",
  });

  const [identityNumberError, setIdentityNumberError] = useState("");
  const [formError, setFormError] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    locationService
      .getCities()
      .then(setCities)
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  useEffect(() => {
    if (!formData.cityId) {
      setDistricts([]);
      return;
    }
    locationService
      .getDistrictsByCityId(parseInt(formData.cityId))
      .then(setDistricts)
      .catch((error) => console.error("Error fetching districts:", error));
  }, [formData.cityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("Parolalar eşleşmiyor");
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    if (!validatePhone(`0${formData.phoneNumber.replace(/^90/, "")}`)) {
      setFormError("Lütfen geçerli bir telefon numarası girin.");
      return;
    }

    if (!formData.bloodGroup) {
      setFormError("Lütfen kan grubunuzu seçin.");
      return;
    }

    setSubmitting(true);
    try {
      await authService.register({
        name: formData.name,
        surname: formData.surname,
        identityNumber: formData.identityNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        bloodGroup: formData.bloodGroup,
        cityId: parseInt(formData.cityId),
        districtId: parseInt(formData.districtId),
        gender: formData.gender,
        birthDate: formData.birthDate,
      });

      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          "Kayıt oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneChange = (rawValue: string) => {
    let value = rawValue.replace(/\D/g, "");

    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    if (value.length === 10) {
      value = "90" + value;
    } else if (value.length > 12) {
      value = value.substring(0, 12);
    }

    setFormData({ ...formData, phoneNumber: value });
  };

  const handleIdentityNumberChange = (value: string) => {
    if (!/^\d*$/.test(value)) {
      setIdentityNumberError("TC Kimlik Numarası sadece rakamlardan oluşmalıdır.");
      return;
    }
    setIdentityNumberError("");

    if (value.length > 11) return;
    setFormData({ ...formData, identityNumber: value });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-red-600">
            Kan Bağışı
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
            Yeni hesap oluşturun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                id="name"
                label="Ad"
                required
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                id="surname"
                label="Soyad"
                required
                fullWidth
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
              />

              <Input
                id="identityNumber"
                label="TC Kimlik No"
                required
                maxLength={11}
                fullWidth
                error={identityNumberError}
                value={formData.identityNumber}
                onChange={(e) => handleIdentityNumberChange(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4 items-start">
                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Doğum Tarihi
                  </label>
                  <DatePicker
                    id="birthDate"
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
                    maxDate={new Date()}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    dateFormat="yyyy-MM-dd"
                    className="mt-0 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:border-red-500 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cinsiyet
                  </label>
                  <div className="flex items-center space-x-6 py-2">
                    <label className="inline-flex items-center text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === "Male"}
                        onChange={() =>
                          setFormData({ ...formData, gender: "Male" })
                        }
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2">Erkek</span>
                    </label>
                    <label className="inline-flex items-center text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === "Female"}
                        onChange={() =>
                          setFormData({ ...formData, gender: "Female" })
                        }
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2">Kadın</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
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
                id="phoneNumber"
                label="Telefon Numarası"
                type="tel"
                required
                maxLength={12}
                fullWidth
                placeholder="05XX XXX XX XX"
                value={formData.phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />

              <Select
                id="bloodGroup"
                label="Kan Grubu"
                required
                fullWidth
                placeholder="Seçiniz"
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bloodGroup: e.target.value as BloodGroupType,
                  })
                }
                options={bloodGroups.map((group) => ({
                  value: group.id,
                  label: group.label,
                }))}
              />
            </div>

            <Select
              id="cityId"
              label="Şehir"
              required
              fullWidth
              placeholder="Şehir Seçiniz"
              value={formData.cityId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cityId: e.target.value,
                  districtId: "",
                })
              }
              options={cities.map((city) => ({
                value: city.id,
                label: city.name,
              }))}
            />

            <Select
              id="districtId"
              label="İlçe"
              required
              fullWidth
              disabled={!formData.cityId}
              placeholder="İlçe Seçiniz"
              value={formData.districtId}
              onChange={(e) =>
                setFormData({ ...formData, districtId: e.target.value })
              }
              options={districts.map((district) => ({
                value: district.id,
                label: district.name,
              }))}
            />

            <Input
              id="password"
              label="Şifre"
              type="password"
              required
              fullWidth
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Input
              id="confirmPassword"
              label="Şifre Tekrar"
              type="password"
              required
              fullWidth
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          {formError && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/30 p-2 rounded">
              {formError}
            </div>
          )}

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? "Kayıt Oluşturuluyor..." : "Kayıt Ol"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zaten hesabınız var mı?{" "}
            <button
              onClick={() => navigate("/login")}
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
