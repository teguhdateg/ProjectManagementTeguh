import { createUserStore, UserStoreState } from "@/store/userStore";
import { createContext, use, useContext, useRef } from "react";
import { useStore } from "zustand";

export type UserStoreApi = ReturnType<typeof createUserStore>;
export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined
);

export interface UserProviderProps {
  children: React.ReactNode;
}

export const UserStoreProvider = ({ children }: UserProviderProps) => {
  const userStoreRef = useRef<UserStoreApi>(createUserStore());
  if (userStoreRef.current === undefined) {
    userStoreRef.current = createUserStore();
  }
  return (
    <UserStoreContext.Provider value={userStoreRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (state: UserStoreState) => T): T => {
  const userStoreContext = useContext(UserStoreContext);
  if (!userStoreContext) {
    throw new Error("useUserStore must be used within a UserStoreProvider.");
  }
  return useStore(userStoreContext, selector);
};
