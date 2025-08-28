import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "./userAuthStore.js";


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false, ///------

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "Error in line 20 userchatstore fun getusers");
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
      toast.error(error.response.data.messages || "error in getmessage fun");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.messages || "error in send message fun");
      console.log(error)
      // toast.error(error.response?.data?.message || "Failed to send message");
    }
  },
//   sendMessage: async (messageData) => {
//   const { selectedUser, messages } = get();
//   try {
//     const res = await axiosInstance.post(
//       `/messages/send/${selectedUser._id}`,
//       messageData
//     );

//     // Ensure messages is always an array
//     const safeMessages = Array.isArray(messages) ? messages : [];

//     set({ messages: [...safeMessages, res.data] });
//   } catch (error) {
//     toast.error(error.response?.data?.error || "Failed to send message");
//   }
// },

  subscriberToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unSubscriberToMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage")
  },

  setSelectedUser : (selectedUser) => set({selectedUser}),

}));


// import { create } from "zustand";
// import toast from "react-hot-toast";
// import axiosInstance from "../lib/axios.js";
// import { useAuthStore } from "./userAuthStore.js";

// export const useChatStore = create((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessageLoading: false,   //------> spelling 

//   // Load contacts
//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       const me = useAuthStore.getState().authUser;
//       const list = Array.isArray(res.data) ? res.data.filter(u => u._id !== me?._id) : [];
//       set({ users: list });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to load users");
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   // Load conversation
//   getMessages: async (userId) => {
//     set({ isMessageLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: Array.isArray(res.data) ? res.data : [] });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to load messages");
//       set({ messages: [] });
//     } finally {
//       set({ isMessageLoading: false });
//     }
//   },

//   // Send a message (prevents sending to yourself)
//   sendMessage: async (messageData) => {
//     const { selectedUser } = get();
//     const { authUser } = useAuthStore.getState();

//     if (!selectedUser?._id) {
//       toast.error("Select a contact first");
//       return;
//     }
//     if (selectedUser._id === authUser?._id) {
//       toast.error("You can't send a message to yourself");
//       return;
//     }

//     try {
//       const res = await axiosInstance.post(
//         `/messages/send/${selectedUser._id}`,
//         messageData
//       );

//       set(state => ({ messages: [...state.messages, res.data] }));
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to send message");
//     }
//   },

//   // Socket subscription for incoming messages
//   subscriberToMessage: () => {
//     const socket = useAuthStore.getState().socket;
//     if (!socket) return;

//     // avoid duplicate handlers if effect re-runs
//     socket.off("newMessage");

//     socket.on("newMessage", (newMessage) => {
//       const { selectedUser } = get();
//       if (!selectedUser) return;

//       // show only messages for the currently open chat
//       const isForThisChat =
//         newMessage.senderId === selectedUser._id ||
//         newMessage.receiverId === selectedUser._id;

//       if (!isForThisChat) return;

//       set(state => ({ messages: [...state.messages, newMessage] }));
//     });
//   },

//   unSubscriberToMessage: () => {
//     const socket = useAuthStore.getState().socket;
//     socket?.off("newMessage");
//   },

//   // Select a user and immediately load messages
//   setSelectedUser: async (selectedUser) => {
//     set({ selectedUser, isMessageLoading: true });

//     if (selectedUser?._id) {
//       try {
//         const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
//         set({ messages: Array.isArray(res.data) ? res.data : [] });
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to load messages");
//         set({ messages: [] });
//       } finally {
//         set({ isMessageLoading: false });
//       }
//     } else {
//       set({ messages: [], isMessageLoading: false });
//     }
//   },
// }));
