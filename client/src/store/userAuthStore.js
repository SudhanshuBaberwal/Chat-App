import { create } from "zustand";
import axiosInstanace from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isUpdateingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstanace.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstanace.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigninUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstanace.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in Successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstanace.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disConnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdateingProfile: true });
    try {
      const res = await axiosInstanace.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile update successfully");
    } catch (error) {
      console.log("Error in update profile", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdateingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL , {
        query : {
            userId : authUser._id,
        }
    });
    socket.connect();
    set({socket : socket})

    socket.on("getOnlineUsers" , (userIds) => {
        set({onlineUsers : userIds})
    })
  },
  disConnectSocket: () => {
     if(get().socket?.connected) get().socket.disconnect();
  },
}));
