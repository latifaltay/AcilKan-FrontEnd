import type { BloodGroupType } from "./enums";

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

export interface AuthResponse {
  userId: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  token: AuthToken;
}

export interface MyProfileDto {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  bloodGroup: BloodGroupType;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  totalDonationCount: number;
  lastDonationDate: string | null;
  nextEligibleDonationDate: string | null;
  canDonateNow: boolean;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
}

export interface City {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  cityId: number;
}
