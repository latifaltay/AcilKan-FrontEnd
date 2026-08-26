import React, { useEffect, useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { accountService } from "../../../shared/api/accountService";
import { locationService, type City, type District } from "../../../shared/api/locationService";
import { useAuth } from "../../auth/AuthContext";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { getBloodGroupLabel } from "../../../shared/lib/bloodGroups";
import { formatDate } from "../../../shared/lib/date";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { Select } from "../../../shared/ui/Select";
import { PhoneVerification } from "../components/PhoneVerification";
import type { MyProfileDto } from "../../../shared/types";

export function AccountSettings() {
  const { setTokens, logout } = useAuth();
  const [profile, setProfile] = useState<MyProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [addressForm, setAddressForm] = useState({ cityId: "", districtId: "" });
  const [editingAddress, setEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailChangeStep, setEmailChangeStep] = useState<"idle" | "requested">("idle");
  const [emailChangeCode, setEmailChangeCode] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await accountService.getMe();
      setProfile(data);
      setAddressForm({
        cityId: String(data.cityId),
        districtId: String(data.districtId),
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Profil bilgileri yüklenemedi."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    locationService.getCities().then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    if (!addressForm.cityId) {
      setDistricts([]);
      return;
    }
    locationService
      .getDistrictsByCityId(parseInt(addressForm.cityId))
      .then(setDistricts)
      .catch(console.error);
  }, [addressForm.cityId]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.cityId || !addressForm.districtId) return;

    setSavingAddress(true);
    try {
      const token = await accountService.updateAddress(
        parseInt(addressForm.cityId),
        parseInt(addressForm.districtId)
      );
      setTokens(token);
      toast.success("Adresiniz güncellendi.");
      setEditingAddress(false);
      loadProfile();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Adres güncellenemedi."));
    } finally {
      setSavingAddress(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Yeni parolalar eşleşmiyor.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Yeni parola en az 6 karakter olmalıdır.");
      return;
    }

    setChangingPassword(true);
    try {
      await accountService.changePassword(
        passwords.currentPassword,
        passwords.newPassword,
        passwords.confirmPassword
      );
      toast.success("Parola başarıyla güncellendi.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Parola güncellenemedi."));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setChangingEmail(true);
    try {
      await accountService.requestEmailChange(newEmail);
      toast.success("Yeni e-posta adresinize bir doğrulama kodu gönderildi.");
      setEmailChangeStep("requested");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "E-posta değişikliği başlatılamadı."));
    } finally {
      setChangingEmail(false);
    }
  };

  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailChangeCode) return;

    setChangingEmail(true);
    try {
      await accountService.confirmEmailChange(emailChangeCode);
      toast.success("E-posta adresiniz güncellendi.");
      setEmailChangeStep("idle");
      setNewEmail("");
      setEmailChangeCode("");
      loadProfile();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Kod doğrulanamadı."));
    } finally {
      setChangingEmail(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      toast.error("Hesap silmek için mevcut parolanızı girin.");
      return;
    }
    if (!confirmDelete) {
      toast.error("Hesap silme işlemini onaylamanız gerekir.");
      return;
    }

    setDeletingAccount(true);
    try {
      await accountService.deleteAccount(deletePassword);
      toast.success("Hesabınız silindi.");
      await logout();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Hesap silinemedi."));
      setDeletingAccount(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-3 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-20 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hesap Ayarları
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Hesap bilgilerinizi güncelleyin ve güvenlik ayarlarınızı yönetin.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ad Soyad
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {profile.name} {profile.surname}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kan Grubu
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {getBloodGroupLabel(profile.bloodGroup)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Toplam Bağış
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {profile.totalDonationCount}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Yeni Bağış Yapabilme Durumu
              </label>
              <p className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white">
                {profile.canDonateNow ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    Şu an bağış yapabilirsiniz
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    {profile.nextEligibleDonationDate
                      ? `${formatDate(profile.nextEligibleDonationDate)} sonrası uygun`
                      : "Şu an uygun değil"}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Adres */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Adres
              </h3>
              <button
                type="button"
                onClick={() => setEditingAddress((prev) => !prev)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                {editingAddress ? "Vazgeç" : "Düzenle"}
              </button>
            </div>
            {editingAddress ? (
              <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Şehir"
                  fullWidth
                  required
                  placeholder="Şehir Seçiniz"
                  value={addressForm.cityId}
                  onChange={(e) =>
                    setAddressForm({ cityId: e.target.value, districtId: "" })
                  }
                  options={cities.map((city) => ({ value: city.id, label: city.name }))}
                />
                <Select
                  label="İlçe"
                  fullWidth
                  required
                  disabled={!addressForm.cityId}
                  placeholder="İlçe Seçiniz"
                  value={addressForm.districtId}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, districtId: e.target.value })
                  }
                  options={districts.map((district) => ({
                    value: district.id,
                    label: district.name,
                  }))}
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" loading={savingAddress}>
                    Adresi Kaydet
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-900 dark:text-white">
                {profile.districtName}, {profile.cityName}
              </p>
            )}
          </div>

          {/* E-posta */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              E-posta
            </h3>
            <p className="text-gray-900 dark:text-white mb-1">{profile.email}</p>
            <p className="text-sm mb-4">
              {profile.emailConfirmed ? (
                <span className="text-green-600 dark:text-green-400">Doğrulanmış</span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">Doğrulanmamış</span>
              )}
            </p>

            {emailChangeStep === "idle" ? (
              <form onSubmit={handleRequestEmailChange} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  fullWidth
                  placeholder="Yeni e-posta adresi"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Button type="submit" loading={changingEmail}>
                  E-postayı Değiştir
                </Button>
              </form>
            ) : (
              <form onSubmit={handleConfirmEmailChange} className="flex flex-col sm:flex-row gap-3">
                <Input
                  fullWidth
                  maxLength={6}
                  placeholder="Doğrulama kodu"
                  value={emailChangeCode}
                  onChange={(e) => setEmailChangeCode(e.target.value.replace(/\D/g, ""))}
                />
                <Button type="submit" loading={changingEmail}>
                  Kodu Onayla
                </Button>
              </form>
            )}
          </div>

          {/* Telefon */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Telefon Numarası
            </h3>
            <p className="text-gray-900 dark:text-white mb-3">{profile.phoneNumber}</p>
            <PhoneVerification
              isVerified={profile.phoneNumberConfirmed}
              onVerified={loadProfile}
            />
          </div>
        </div>

        {/* Parola Değiştir */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Parola Değiştir
            </h3>

            {(
              [
                { key: "current", label: "Mevcut Parola", field: "currentPassword" },
                { key: "new", label: "Yeni Parola", field: "newPassword" },
                { key: "confirm", label: "Yeni Parola (Tekrar)", field: "confirmPassword" },
              ] as const
            ).map(({ key, label, field }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPasswords[key] ? "text" : "password"}
                    value={passwords[field]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [field]: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        [key]: !showPasswords[key],
                      })
                    }
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    {showPasswords[key] ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button type="submit" loading={changingPassword}>
                Parolayı Değiştir
              </Button>
            </div>
          </form>
        </div>

        {/* Hesap Sil */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleDeleteAccount} className="p-6 space-y-4">
            <h3 className="text-lg font-medium text-red-700 dark:text-red-400">
              Hesabımı Sil
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hesabınız soft-delete edilir; aynı e-posta veya TC ile yeniden kayıt
              olabilirsiniz. Aktif talep ve teklifleriniz iptal edilir.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mevcut Parola
              </label>
              <div className="mt-1 relative">
                <input
                  type={showDeletePassword ? "text" : "password"}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showDeletePassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500"
              />
              Hesabımı kalıcı olarak silmek istediğimi onaylıyorum
            </label>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="outline"
                loading={deletingAccount}
                disabled={!deletePassword || !confirmDelete}
              >
                Hesabımı Sil
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
