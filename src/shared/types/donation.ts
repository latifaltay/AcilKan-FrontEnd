import type {
  BloodDonationStatus,
  BloodGroupType,
  BloodRequestStatus,
} from "./enums";

export interface Hospital {
  id: number;
  name: string;
  districtId: number;
}

export interface BloodRequestDto {
  id: string;
  requesterId: string;
  patientName: string;
  patientSurname: string;
  bloodGroup: BloodGroupType;
  requiredUnits: number;
  fulfilledUnits: number;
  /** Accepted (rezerve / yolda) ünite sayısı. */
  reservedUnits: number;
  isDonorCompatibilityRequired: boolean;
  isHospitalSpecific: boolean;
  hospitalId: number;
  hospitalName: string | null;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  requestDate: string;
  status: BloodRequestStatus;
}

export interface CreatedDonationOfferResult {
  id: string;
  status: BloodDonationStatus;
  offeredDate: string;
  isOnWaitlist: boolean;
}

export interface GeneratedConfirmationCodeResult {
  bloodDonationId: string;
  confirmationCode: string;
  expiresAt: string;
}

export interface ConfirmedBloodDonationResult {
  bloodDonationId: string;
  confirmedAt: string;
  isBloodRequestFulfilled: boolean;
}

/** Bağışçının kendi tekliflerini gördüğü satır — onay kodu içermez. */
export interface MyDonationOfferDto {
  id: string;
  bloodRequestId: string;
  patientName: string;
  patientSurname: string;
  hospitalName: string | null;
  status: BloodDonationStatus;
  offeredDate: string;
  confirmationCodeExpiresAt: string | null;
  confirmedAt: string | null;
  isOnWaitlist: boolean;
}

/** Talep sahibinin kendi talebine gelen teklifleri — onay kodu içerir. */
export interface BloodDonationOfferDto {
  id: string;
  bloodRequestId: string;
  donorId: string;
  donorName: string;
  donorSurname: string;
  donorBloodGroup: BloodGroupType;
  status: BloodDonationStatus;
  offeredDate: string;
  confirmationCode: string | null;
  confirmationCodeExpiresAt: string | null;
  confirmedAt: string | null;
  isOnWaitlist: boolean;
}

export interface ReceivedDonationItemDto {
  id: string;
  bloodRequestId: string;
  donorId: string;
  donorName: string;
  donorSurname: string;
  patientName: string;
  patientSurname: string;
  bloodGroup: BloodGroupType;
  confirmedAt: string;
}

export interface DashboardSummaryDto {
  totalDonationCount: number;
  lastDonationDate: string | null;
  nextEligibleDonationDate: string | null;
  canDonateNow: boolean;
}
