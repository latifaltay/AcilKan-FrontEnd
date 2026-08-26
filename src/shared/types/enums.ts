// Backend enum'ları JSON'da string olarak gider (JsonStringEnumConverter).

export type BloodGroupType =
  | "APositive"
  | "ANegative"
  | "BPositive"
  | "BNegative"
  | "ABPositive"
  | "ABNegative"
  | "OPositive"
  | "ONegative";

export type GenderType = "Male" | "Female";

export type NotificationType =
  | "NewDonationOffer"
  | "DonationOfferAccepted"
  | "DonationOfferRejected"
  | "DonationOfferCancelled"
  | "DonationConfirmed"
  | "NewChatMessage"
  | "NewBloodRequestNearby"
  | "WaitlistClosedRequestFulfilled"
  | "MedicalRejectByDonor"
  | "BloodRequestCancelled"
  | "OfferSlaExpired"
  | "BloodRequestExpired";

export type DevicePlatform = "Android" | "iOS" | "Web";

export type BloodDonationStatus =
  | "Pending"
  | "Accepted"
  | "Confirmed"
  | "Rejected"
  | "Cancelled"
  | "Expired";

export type BloodRequestStatus =
  | "Open"
  | "InProgress"
  | "Fulfilled"
  | "Cancelled"
  | "Expired";
