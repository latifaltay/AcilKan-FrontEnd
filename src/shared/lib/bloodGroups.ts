import type { BloodGroupType } from "../types";

export const bloodGroups: { id: BloodGroupType; label: string }[] = [
  { id: "APositive", label: "A RH +" },
  { id: "ANegative", label: "A RH -" },
  { id: "BPositive", label: "B RH +" },
  { id: "BNegative", label: "B RH -" },
  { id: "ABPositive", label: "AB RH +" },
  { id: "ABNegative", label: "AB RH -" },
  { id: "OPositive", label: "0 RH +" },
  { id: "ONegative", label: "0 RH -" },
];

const LABEL_BY_ID: Record<BloodGroupType, string> = bloodGroups.reduce(
  (acc, group) => ({ ...acc, [group.id]: group.label }),
  {} as Record<BloodGroupType, string>
);

export function getBloodGroupLabel(bloodGroup: BloodGroupType): string {
  return LABEL_BY_ID[bloodGroup] ?? bloodGroup;
}
