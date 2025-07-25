import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import Profile from "./pages/Profile";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop, LoadingScreen } from "./components/common";
import Home from "./pages/Dashboard/Home";
import { useEffect, useState } from "react";
import { useUserStore } from "./store/useStore";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Shops from "./pages/Shops/Shops";
import AddShop from "./pages/Shops/AddShop";
import EditShop from "./pages/Shops/EditShop";
import SubscriptionPlansPage from "./pages/SubscriptionPlans";
import AddSubsriptionPlan from "./pages/SubscriptionPlans/AddSubsriptionPlan";
import EditPlan from "./pages/SubscriptionPlans/EditPlan";
import ShopCategories from "./pages/ShopCategories";
import ProductsCategories from "./pages/ProductCategory/ProductCategories";
import ProductsCategoriesDetails from "./pages/ProductCategory/ProductCategoriesDetails";
import ShopDetails from "./pages/Shops/ShopDetails";
import Users from "./pages/Users/Users";
import UserDetails from "./pages/Users/UserDetails";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";
import UsersDashboard from "./pages/Users/UsersDashboard";
import Products from "./pages/Products/Products";
import AddProduct from "./pages/Products/AddProduct";
import EditProduct from "./pages/Products/EditProduct";
import ProductDetails from "./pages/Products/ProductDetails";
import { Toaster, resolveValue } from 'react-hot-toast';

import { MdError } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegMehBlank } from "react-icons/fa";


export default function App() {
  const {isLoading, fetchUserData, logout } = useUserStore(); 
  const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => {
    const IsLoggedInCheck = localStorage.getItem('sooq-isLoggedIn') || false;
    if(!IsLoggedInCheck) {
      logout();
      localStorage.setItem("sooq-isLoggedIn", JSON.stringify(false))
    } else {
       isLoading(true);
        fetchUserData()
          .catch(() => {
            localStorage.removeItem("sooq-isLoggedIn");
            localStorage.removeItem("sooq-token");
          })
          .finally(() => {
            isLoading(false);
            setCheckingAuth(false)
          })
    }
  }, [])

  
  if (checkingAuth) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Router>
        <ScrollToTop />
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                zIndex: 99999,
              },
            }}
            containerStyle={{
              zIndex: 99999,
            }}
          >
            {(t) => (
                <div
                  className="py-4 px-8 rounded-2xl bg-gray-200 shadow-lg dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-700 flex items-center justify-between gap-2"
                  style={{ zIndex: 99999 }}
                >
                  {t.type === 'error' && <MdError className="text-error-500" size={28} />}
                  {t.type === 'success' && <FaCircleCheck className="text-success-500" size={28} />}
                  {t.type === 'blank' && <FaRegMehBlank className="text-gray-500" size={28} />}
                  {t.type === 'loading' && <AiOutlineLoading3Quarters className="text-gray-500 animate-spin" size={28} />}
                  <span>{resolveValue(t.message, t)}</span>
                </div>
            )}
          </Toaster>
        <Routes >
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<AppLayout />} >
              <Route index path="/" element={<Home />} />

              <Route path="/shops" element={<Outlet />}>
                <Route index element={<Shops />} />
                <Route path="add" element={<AddShop />} />
                <Route path="edit/:shopId" element={<EditShop />} />
                <Route path=":shopId" element={<ShopDetails />} />
              </Route>

              <Route path="/subscription-plans">
                <Route index element={<SubscriptionPlansPage />} />
                <Route path="add" element={<AddSubsriptionPlan />} />
                <Route path="edit/:spid" element={<EditPlan />} />
              </Route>

              <Route path="/shop-category" element={<ShopCategories />} />
              <Route path="/products-category" element={<Outlet />}>
                <Route index element={<ProductsCategories />} />
                <Route path=":categoryId" element={<ProductsCategoriesDetails />} />
              </Route>

              <Route path="/users" element={<Outlet />}>
                <Route index element={<Users />} />
                <Route path="dashboard" element={<UsersDashboard />} />
                <Route path="add" element={<AddUser />} />
                <Route path=":id" element={<UserDetails />} />
                <Route path=":id/edit" element={<EditUser />} />
              </Route>

              <Route path="/products" element={<Outlet />}>
                <Route index element={<Products />} />
                <Route path="add" element={<AddProduct />} />
                <Route path="edit/:productId" element={<EditProduct />} />
                <Route path=":productId" element={<ProductDetails />} />
              </Route>

              {/* Others Page */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/blank" element={<Blank />} />
              

            </Route>
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
