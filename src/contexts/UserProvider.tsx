import { createContext, useState } from "react";
import type { ReactNode } from "react";

export type UserContextType = {
  userId: number;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
};

export const UserContext = createContext<UserContextType>({
  userId: 1,
  setUserId: () => {},
});

function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number>(1);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
