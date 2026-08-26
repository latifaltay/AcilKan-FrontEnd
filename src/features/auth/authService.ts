import { identityApi } from "../../shared/api/httpClient";
import { unwrap, unwrapMessage, type ApiSuccess } from "../../shared/api/envelope";
import type { AuthResponse, BloodGroupType, GenderType } from "../../shared/types";

export interface RegisterPayload {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  identityNumber: string;
  bloodGroup: BloodGroupType;
  birthDate: string;
  gender: GenderType;
  cityId: number;
  districtId: number;
  password: string;
  confirmPassword: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return unwrap(
      identityApi.post<ApiSuccess<AuthResponse>>("/Auth/register", payload)
    );
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return unwrap(
      identityApi.post<ApiSuccess<AuthResponse>>("/Auth/login", {
        email,
        password,
      })
    );
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    return unwrap(
      identityApi.post<ApiSuccess<AuthResponse>>("/Auth/refresh", {
        refreshToken,
      })
    );
  },

  async logout(): Promise<string> {
    return unwrapMessage(identityApi.post("/Auth/logout"));
  },
};
