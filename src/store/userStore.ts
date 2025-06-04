import { createStore } from "zustand/vanilla";

export type UserStore = {
  name: string;
};

export type UserStoreActions = {
  setName: (name: string) => void;
};

export type UserStoreState = UserStore & UserStoreActions;

export const defaultInitialState: UserStoreState = {
  name: "",
  setName: () => {},
};

export const createUserStore = (
  initialState: UserStoreState = defaultInitialState
) => {
  return createStore<UserStoreState>((set) => ({
    ...initialState,
    setName: (name: string) => set({ name }),
  }));
};
