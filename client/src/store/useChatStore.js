import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "./userAuthStore.js";
// import { socket } from "socket.io-client";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.messages);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  // sendMessage: async (messageData) => {
  //   const { selectedUser, messages } = get();
  //   try {
  //     const res = await axiosInstance.post(
  //       `/messages/send/${selectedUser._id}`,
  //       messageData
  //     );
  //     set({ messages: [...messages, res.data] });
  //   } catch (error) {
  //     // toast.error(error.response.data.messages);
  //     console.log(error)
  //     toast.error(error.response?.data?.message || "Failed to send message");
  //   }
  // },
  sendMessage: async (messageData) => {
  const { selectedUser, messages } = get();
  try {
    const res = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      messageData
    );

    // Ensure messages is always an array
    const safeMessages = Array.isArray(messages) ? messages : [];

    set({ messages: [...safeMessages, res.data] });
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to send message");
  }
},

  subscriberToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectdUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unSubscriberToMessage: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("newMessage");
  },

  setSelectedUser: async (selectedUser) => {
  set({ selectedUser, messages: [] }); // reset old messages
  if (selectedUser) {
    try {
      const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    }
  }
},

}));
