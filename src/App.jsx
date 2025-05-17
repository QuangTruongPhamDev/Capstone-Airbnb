import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "animate.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./Admin/pages/AdminPage/AdminPage";
import Template_admin from "./Admin/template_admin/template_admin";
import LocationPage from "./Admin/pages/LocationPage/LocationPage";
import ReservationPage from "./Admin/pages/ReservationPage/ReservationPage";
import UserPage from "./Admin/pages/UserPage/UserPage";
import { Toaster } from "react-hot-toast";
import Template from "./Customer/template/Template";
import HomePage from "./Customer/pages/HomePage/HomePage";
import LoginPage from "./Customer/pages/LoginPage/LoginPage";
import RegisterPage from "./Customer/pages/RegisterPage/RegisterPage";
import RoomListPage from "./Customer/pages/RoomListPage/RoomListPage";
import RoomDetailPage from "./Customer/pages/RoomDetail/RoomDetailPage";
import Loading from "./Customer/components/Loading/Loading";
import NotFoundPage from "./Customer/pages/NotFoundPage/NotFoundPage";
import UserProfilePage from "./Customer/pages/Profile/UserProfilePage";
import { useDispatch } from "react-redux";
import { getStoredUser } from "./utils/LocalStorageHelper";
import { setUserAction } from "./Customer/redux/userSlice";

function App() {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Thêm state này

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && storedUser.token) {
      dispatch(
        setUserAction({
          token: storedUser.token,
          user: storedUser,
        })
      );
    }
    setIsAuthChecked(true); // Sau khi kiểm tra xong thì cho phép render app
  }, []);

  if (!isAuthChecked) return null; // hoặc có thể hiển thị spinner Loading ở đây
  return (
    <div>
      <Loading />
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Template content={<HomePage />} />} />
          <Route
            path="/dangnhap"
            element={
              <Template content={<LoginPage />} forceWhiteHeader={true} />
            }
          />
          <Route
            path="/dangky"
            element={
              <Template content={<RegisterPage />} forceWhiteHeader={true} />
            }
          />
          <Route
            path="/rooms/:locationSlug" // Nhận locationSlug làm path param
            element={<Template content={<RoomListPage />} />}
          />
          <Route
            path="/room-detail/:roomId"
            element={
              <Template content={<RoomDetailPage />} forceWhiteHeader={true} />
            }
          />
          <Route
            path="/profile"
            element={<Template content={<UserProfilePage />} />}
          />
          <Route
            path="/UserPage"
            element={<Template_admin content={<UserPage />} />}
          />
          <Route
            path="/LocationPage"
            element={<Template_admin content={<LocationPage />} />}
          />
          <Route
            path="/AdminPage"
            element={<Template_admin content={<AdminPage />} />}
          />
          <Route
            path="/ReservationPage"
            element={<Template_admin content={<ReservationPage />} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
