import { create } from "zustand";
import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";

// Export User interface
export interface User {
  id: string;
  regNo: string;
  role: string;
  walletAddress: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  logoutUser: () => void;
}

const userStore: StateCreator<UserStore> = (set) => ({
  user: null,
  setUser: (update) => {
    set((state) => ({
      user: typeof update === "function" ? update(state.user) : update,
    }));
  },
  logoutUser: () => {
    set(() => ({ user: null }));
  },
});

const useUser = create(persist(userStore, { name: "Auth" }));

export default useUser;