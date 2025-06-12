import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginService } from "../../api/userService";
import { setUserAction } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { Button, Form, Input } from "antd";
import loginAnimation from "../../../assets/login_animation.json";
import Lottie from "lottie-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user: userFromRedux } = useSelector((state) => state.userSlice);
  const [form] = Form.useForm();

  // 1. Redirect nếu đã đăng nhập
  useEffect(() => {
    if (userFromRedux) {
      const role = userFromRedux.user?.role || userFromRedux.role;
      const from = location.state?.from || "/";

      if (role?.toUpperCase() === "ADMIN") {
        // Nếu là ADMIN thì luôn chuyển về AdminPage
        navigate("/AdminPage", { replace: true });
      } else {
        // Nếu không phải ADMIN thì xử lý theo from cũ
        if (from === "/login" || from === "/dangky") {
          navigate("/", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    }
  }, [userFromRedux, navigate, location.state]);

  // 2. Tự động điền email/password nếu vừa đăng ký
  useEffect(() => {
    const recent = localStorage.getItem("RECENT_REGISTER");
    if (recent) {
      try {
        const { email, password } = JSON.parse(recent);
        form.setFieldsValue({ email, password });
        localStorage.removeItem("RECENT_REGISTER");
      } catch (e) {
        console.error("Lỗi parse RECENT_REGISTER:", e);
      }
    }
  }, [form]);

  // 3. Xử lý đăng nhập
  const handleLogin = async (values) => {
    try {
      const responseDataContent = await loginService(values);
      if (responseDataContent) {
        dispatch(setUserAction(responseDataContent));
        toast.success("Đăng nhập thành công!");
        // Không cần gọi navigate ở đây nữa, useEffect sẽ lo redirect
      } else {
        toast.error("Đăng nhập thất bại: Không có dữ liệu trả về.");
      }
    } catch (error) {
      console.error("Lỗi trong handleLogin:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Sai email hoặc mật khẩu."
      );
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/background_login.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Lớp phủ đen mờ */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Nội dung form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
          {/* Bên trái: ảnh minh hoạ (tuỳ chọn) */}
          <div className="hidden md:flex w-full md:w-1/2 bg-white justify-center items-center p-6">
            <Lottie
              animationData={loginAnimation}
              loop
              className="w-full h-full max-w-md"
            />
          </div>

          {/* Bên phải: Form đăng nhập */}
          <div className="w-full md:w-1/2 p-8 md:p-10">
            <h2 className="text-3xl font-bold text-red-500 mb-6 text-center">
              Chào mừng trở lại!
            </h2>

            <Form
              name="loginForm"
              layout="vertical"
              onFinish={handleLogin}
              initialValues={{ email: "", password: "" }}
              requiredMark={false}
            >
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700">Email</span>
                }
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập Email" }]}
              >
                <Input
                  className="py-2 px-4 border border-gray-300 rounded-md focus:border-red-500 focus:ring-red-500"
                  placeholder="you@example.com"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-semibold text-gray-700">Mật khẩu</span>
                }
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password
                  className="py-2 px-4 border border-gray-300 rounded-md focus:border-red-500 focus:ring-red-500"
                  placeholder="••••••••"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-red-500 hover:bg-red-600 transition-colors duration-200 font-semibold py-2 rounded-md"
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-4 text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                onClick={() => navigate("/dangky")}
                className="text-red-500 hover:underline font-semibold"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
