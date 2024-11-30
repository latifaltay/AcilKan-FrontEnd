import { createContext, useState } from "react";

export interface BloodDonationContextType {
  selectedBloodRequestId: number | undefined;
  setSelectedBloodRequestId: (bloodRequestId: number) => void;
}

export const BloodDonationContext = createContext<BloodDonationContextType>({
  selectedBloodRequestId: undefined,
  setSelectedBloodRequestId: (bloodRequestId : number) => {},
});

export function BloodDonationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedBloodRequestId, _setSelectedBloodRequestId] = useState<number | undefined>();

  const setSelectedBloodRequestId = (bloodRequestId: number) => {
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
