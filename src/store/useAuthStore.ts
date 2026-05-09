// store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  role: "patient" | "doctor" | "nurse" | "hospital" | "admin"  | "super_admin";
};

type AuthState = {
  user: User | null;
  token: string | null;
  adminToken : string | null;
  isAuthenticated: boolean;

  // OTP flow
  email: string | null;
  otpStep: "idle" | "sent" | "verified";

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setAdminToken: (adminToken: string) => void;
  logout: () => void;

  setOtpEmail: (email: string) => void;
  setOtpStep: (step: AuthState["otpStep"]) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      adminToken: null,
      isAuthenticated: false,

      email: null,
      otpStep: "idle",

      isLoading: false,
      error: null,

      setUser: (user) =>
        set(() => ({
          user,
          isAuthenticated: true,
        })),

      setToken: (token) =>
        set(() => ({
          token,
        })),
      setAdminToken: (adminToken) =>
        set(() => ({
          adminToken,
        })),

      logout: () =>
        set(() => ({
          user: null,
          token: null,
          adminToken: null,
          isAuthenticated: false,
          email: null,
          otpStep: "idle",
        })),

      setOtpEmail: (email) =>
        set(() => ({
          email,
        })),

      setOtpStep: (step) =>
        set(() => ({
          otpStep: step,
        })),

      setLoading: (loading) =>
        set(() => ({
          isLoading: loading,
        })),

      setError: (error) =>
        set(() => ({
          error,
        })),
    }),
    {
      name: "auth-storage",

      // ✅ Use JSON storage (recommended)
      storage: createJSONStorage(() => localStorage),

      // // ✅ Only persist important data
      // partialize: (state) => ({
      //   user: state.user,
      //   token: state.token,
      //   isAuthenticated: state.isAuthenticated,
      //   email: state.email,
      //   otpStep: state.otpStep,
      // }),
    }
  )
);