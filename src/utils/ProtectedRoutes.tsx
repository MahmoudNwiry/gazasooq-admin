import { Outlet, Navigate } from "react-router";
import { useUserStore } from "../store/useStore";

const ProtectedRoutes = () => {

    const { isLoggedIn, userdata } = useUserStore();



    return isLoggedIn && userdata?.role === "مالك" ? <Outlet /> : <Navigate to='/signin' />
}

export default ProtectedRoutes