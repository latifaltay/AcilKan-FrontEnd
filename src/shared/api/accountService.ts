import { identityApi } from "./httpClient";
import { unwrap, unwrapMessage, type ApiSuccess } from "./envelope";
import type { AuthToken, MyProfileDto } from "../types";

export const accountService = {
  async getMe(): Promise<MyProfileDto> {
    return unwrap(
      identityApi.get<ApiSuccess<MyProfileDto>>("/Account/me")
    );
  },

  async confirmEmail(email: string, code: string): Promise<string> {
    return unwrapMessage(
      identityApi.post("/Account/email/confirm", { email, code })
    );
  },

  async resendEmailConfirmation(email: string): Promise<string> {
    return unwrapMessage(
      identityApi.post("/Account/email/resend-confirmation", { email })
    );
  },

  async forgotPassword(email: string): Promise<string> {
    return unwrapMessage(
      identityApi.post("/Account/password/forgot", { email })
    );
  },

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<string> {
    return unwrapMessage(
      identityApi.post("/Account/password/reset", {
        email,
        code,
        newPassword,
        confirmNewPassword,
      })
    );
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<string> {
    return unwrapMessage(
      identityApi.post("/Account/password/change", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
    );
  },

  async requestEmailChange(newEmail: string): Promise<string> {
    return unwrapMessage(
      identityApi.post("/Account/email/change/request", { newEmail })
    );
  },

  async confirmEmailChange(code: string): Promise<string> {
    return unwrapMessage(
      identityApi.post("/Account/email/change/confirm", { code })
    );
  },

  async confirmPhone(idToken: string): Promise<string> {
    return unwrapMessage(
      identityApi.post("/Account/phone/confirm", { idToken })
    );
  },

  /** Adres güncellemesi JWT cityId claim'ini yeniler; yeni TokenResponse döner. */
  async updateAddress(cityId: number, districtId: number): Promise<AuthToken> {
    return unwrap(
      identityApi.put<ApiSuccess<AuthToken>>("/Account/address", {
        cityId,
        districtId,
      })
    );
  },

  async deleteAccount(currentPassword: string): Promise<string> {
    return unwrapMessage(
      identityApi.delete("/Account", { data: { currentPassword } })
    );
  },
};
