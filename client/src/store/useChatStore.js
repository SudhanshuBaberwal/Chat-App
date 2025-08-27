import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { io } from "socket.io-client";

export const useChatStore = create((set, get) => ({
  messages: [],
  selectedUser: null,
  socket: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchMessages: async (userId) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data }); // ✅ backend returns array now
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },

  sendMessage: async (receiverId, text, image) => {
    try {
      const res = await axiosInstance.post(`/messages/send/${receiverId}`, {
        text,
        image,
      });

      // ✅ Add message to local state
      set((state) => ({
        messages: [...state.messages, res.data],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  connectSocket: (userId) => {
    const socket = io("http://localhost:3000", {
      query: { userId },
    });

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      // ✅ Fix typo: selectedUser not selectdUser
      if (
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id)
      ) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
    });

    set({ socket });
  },
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
//   isMessageLoading: false,

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },
//   getMessages: async (userId) => {
//     set({ isMessageLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error.response.data.messages);
//     } finally {
//       set({ isMessageLoading: false });
//     }
//   },

//   // sendMessage: async (messageData) => {
//   //   const { selectedUser, messages } = get();
//   //   try {
//   //     const res = await axiosInstance.post(
//   //       `/messages/send/${selectedUser._id}`,
//   //       messageData
//   //     );
//   //     set({ messages: [...messages, res.data] });
//   //   } catch (error) {
//   //     // toast.error(error.response.data.messages);
//   //     console.log(error)
//   //     toast.error(error.response?.data?.message || "Failed to send message");
//   //   }
//   // },
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

//   subscriberToMessage: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;
//     const socket = useAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {
//       if (newMessage.senderId !== selectedUser._id) return;
//       set({ messages: [...get().messages, newMessage] });
//     });
//   },

//   unSubscriberToMessage: () => {
//     const socket = useAuthStore.getState().socket;

//     socket.off("newMessage");
//   },

//   setSelectedUser: async (selectedUser) => {
//   set({ selectedUser, messages: [] }); // reset old messages
//   if (selectedUser) {
//     try {
//       const res = await axiosInstance.get(`/messages/${selectedUser._id}`);
//       set({ messages: res.data });
//     } catch (error) {
//       // toast.error(error.response?.data?.message || "Failed to load messages");
//       toast.error(error.response?.data?.message || "Failed to load users");
//     }
//   }
// },

// }));
