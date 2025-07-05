import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useEffect, useState } from "react";
import { useUserStore } from "./store/useStore";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Shops from "./pages/Shops";
import AddShop from "./pages/Shops/AddShop";
import SubscriptionPlansPage from "./pages/SubscriptionPlans";
import AddSubsriptionPlan from "./pages/SubscriptionPlans/AddSubsriptionPlan";
import EditPlan from "./pages/SubscriptionPlans/EditPlan";
import ShopCategories from "./pages/ShopCategories";
import ProductsCategories from "./pages/ProductCategories";
import ShopDetails from "./pages/Shops/ShopDetails";

export default function App() {
  const {isLoading, loading, fetchUserData, logout } = useUserStore(); 
  const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => {
    const IsLoggedInCheck = localStorage.getItem('sooq-isLoggedIn') || false;
    if(!IsLoggedInCheck) {
      logout();
      localStorage.setItem("sooq-isLoggedIn", JSON.stringify(false))
    } else {
       isLoading(true);
        fetchUserData('http://localhost:5000/api')
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
    return <div>Loading...</div>
  }

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes >
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<AppLayout />} >
              <Route index path="/" element={<Home />} />

              <Route path="/shops" element={<Outlet />}>
                <Route index element={<Shops />} />
                <Route path="add" element={<AddShop />} />
                <Route path=":shopId" element={<ShopDetails />} />
              </Route>

              <Route path="/subscription-plans">
                <Route index element={<SubscriptionPlansPage />} />
                <Route path="add" element={<AddSubsriptionPlan />} />
                <Route path="edit/:spid" element={<EditPlan />} />
              </Route>

              <Route path="/shop-category" element={<ShopCategories />} />
              <Route path="/products-category" element={<ProductsCategories />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
