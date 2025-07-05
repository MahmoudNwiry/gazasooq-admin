import { create } from "zustand/react";
import axios from 'axios'

interface UserState {
    userdata: {
        firstName: string;
        lastName: string;
        id: string;
        phone: string;
        avatar: string;
        role: string;
        token: string;
    } | null;
    loading : boolean;
    isLoading : (value : boolean) => void; 
    isLoggedIn: boolean;
    setLoggedIn: (value : boolean ) => void;
    error : string | null;
    setUserData: (data: {id : string, firstName: string; lastName: string, phone: string; token: string; avatar: string, role: string }) => void;
    logout: () => void;
    fetchUserData: (api_url: string) => Promise<void | { success: boolean; errorType?: string; message?: string }>;
}

export const useUserStore = create<UserState>((set) => ({
    userdata: null,
    error: null,
    loading: false,
    isLoggedIn: false,
    setUserData: (data) => {
        set({ userdata: data, isLoggedIn: true });
    },
    logout() {
        set({ userdata: null, isLoggedIn: false });
    },
    setLoggedIn(value) {
        set({isLoggedIn : value})
    },
    isLoading : (value) => {
        set({loading : value})
    },
    fetchUserData: async (api_url) => {
        try {
            const getToken = JSON.parse(localStorage.getItem("sooq-token") as string);
            
            if(!getToken) {
                localStorage.removeItem("sooq-isLoggedIn")
                localStorage.removeItem("sooq-token")
                throw new Error("Faild to get token")

            }
            const response = await axios.get(`${api_url}/auth/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${getToken}`,
                },
            })
            

            if (response.status !== 200) {
                set({ userdata: null, isLoggedIn: false });
                throw new Error("Failed to fetch user data");
            }


            const data = {
                id: response.data.user.userId,
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                phone: response.data.user.phoneNumber,
                avatar: response.data.user.avatar,
                role: response.data.user.role,
                token: getToken as string
            };

            set({ userdata: data, isLoggedIn: true });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.status === 500) {
                    set({ error: "Network Error. Please check your connection." });
                } else if (error.response) {
                    set({ userdata: null, isLoggedIn: false });
                }
            }
        }
    }
}))
