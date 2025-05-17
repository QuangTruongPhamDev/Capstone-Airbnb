import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../api/userService";
import { setUserAction } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { Button, Form, Input } from "antd";
import loginAnimation from "../../../assets/login_animation.json";
import Lottie from "lottie-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: userFromRedux } = useSelector((state) => state.userSlice); // Đổi tên để rõ ràng
  const [form] = Form.useForm();

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

  const handleLogin = async (values) => {
    // values từ Form, ví dụ { email, password }
    try {
      // 1. Gọi loginService (đã sửa, chỉ trả về response.data.content)
      const responseDataContent = await loginService(values); // responseDataContent LÀ dữ liệu user + token
      console.log("responseDataContent:", responseDataContent);
      // 2. Dispatch setUserAction với toàn bộ dữ liệu nhận được
      // userSlice.setUserAction sẽ tự xử lý cấu trúc của responseDataContent
      if (responseDataContent) {
        dispatch(setUserAction(responseDataContent));
        toast.success("Đăng nhập thành công!");

        // 3. Xử lý điều hướng dựa trên role từ responseDataContent
        // Bạn cần xác định chính xác API trả về role ở đâu trong responseDataContent
        // Ví dụ 1: Nếu responseDataContent là { user: { id, role,... }, token: "..." }
        let userRole = responseDataContent.user?.role;

        // Ví dụ 2: Nếu responseDataContent là { id, role, ..., accessToken: "..." }
        if (!userRole && responseDataContent.role) {
          userRole = responseDataContent.role;
        }
        // Ví dụ 3: Nếu responseDataContent là { id, quyen, ..., accessToken: "..." } (tên key là 'quyen')
        // if (!userRole && responseDataContent.quyen) {
        //   userRole = responseDataContent.quyen;
        // }

        if (userRole?.toUpperCase() === "ADMIN") {
          navigate("/AdminPage");
        } else {
          navigate("/");
        }
      } else {
        // Trường hợp loginService không throw error mà trả về null/undefined (ít khả thi)
        toast.error("Đăng nhập thất bại: Không có dữ liệu trả về.");
      }
    } catch (error) {
      // Lỗi được ném từ loginService (bao gồm lỗi mạng, lỗi API 4xx, 5xx)
      console.error("Lỗi trong handleLogin:", error);
      // error.response.data.message là thông báo lỗi từ API (ví dụ: "Email hoặc mật khẩu không đúng")
      // error.message là thông báo lỗi chung (ví dụ: "Network Error")
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
