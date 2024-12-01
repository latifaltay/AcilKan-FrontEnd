import { createContext, useState } from "react";

export interface BloodDonationContextType {
  selectedBloodRequestId: number | undefined;
  setSelectedBloodRequestId: (bloodRequestId: number | undefined) => void;
}

export const BloodDonationContext = createContext<BloodDonationContextType>({
  selectedBloodRequestId: undefined,
  setSelectedBloodRequestId: (bloodRequestId : number | undefined) => {},
});

export function BloodDonationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedBloodRequestId, _setSelectedBloodRequestId] = useState<number | undefined>();

  const setSelectedBloodRequestId = (bloodRequestId: number | undefined) => {
    _setSelectedBloodRequestId(bloodRequestId);
  };

  return (
    <BloodDonationContext.Provider
      value={{ selectedBloodRequestId, setSelectedBloodRequestId }}
    >
      {children}
    </BloodDonationContext.Provider>
  );
}
