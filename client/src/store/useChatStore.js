import {create} from "zustand"
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js"

export const useChatStore = create((set) => ({
    messages : [],
    users : [],
    selectdUser : null,
    isUsersLoading : false,
    isMessageLoading : false,

    getUsers : async () => {
        set({isUsersLoading : true})
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users : res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading : false})
        }
    },
    getMessages : async(userId) => {
        set({isMessageLoading : true})
        try{
            const res = await axiosInstance.get(`/message/${userId}`)
            set({message : res.data})
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isMessageLoading : false})
        }
    },

    sendMessage : async (messageData) => {
        const {selectdUser , messages} = get()
        try{
            const res = await axiosInstance.post(`/messages/send/${selectdUser._id}` , messageData)
            set({messages : [...messages , res.data]})
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    setSelectedUser : (selectdUser) => set({selectdUser}),
}))