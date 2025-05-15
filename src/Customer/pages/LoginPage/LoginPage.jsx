import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../api/userService";
import { setUserAction } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { Button, Form, Input } from "antd";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (values) => {
    // Nếu password không có thì gán là chuỗi rỗng
    if (!values.password) {
      values.password = "";
    }

    loginService(values)
      .then((response) => {
        const { user, token } = response.data.content;
        console.log("User sau khi đăng nhập:", user);
        console.log("Token:", token);

        // Dispatch thông tin người dùng (tuỳ theo cấu trúc Redux, ở đây giả sử chỉ lưu user)
        dispatch(setUserAction({
          user,
          token
        }));

        // Điều hướng dựa vào role
        if (user.role?.toUpperCase() === "ADMIN") {
          console.log("Đăng nhập với quyền ADMIN ✅");
          navigate("/AdminPage");
        } else {
          console.log("Đăng nhập với quyền USER ✅");
          navigate("/");
        }

        toast.success("Đăng nhập thành công!");
      })
      .catch(() => {
        toast.error(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập!"
        );
      });
  };
  const onFinish = (values) => handleLogin(values);
  return (
    <div className="login-page">
      <div
        className="min-h-screen flex items-center justify-center bg-gray-900 p-4"
        style={{
          backgroundImage: "url('/images/background_app.jpg')",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
          {/* Form Login */}
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold text-orange-800 mb-6 text-center">
              Đăng nhập
            </h2>
            <Form
              name="loginForm"
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                email: "",
                password: "", // Mặc định password là rỗng
              }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được bỏ trống" },
                ]}
              >
                <Input className="w-full py-2 px-4 border border-gray-300 rounded-lg" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được bỏ trống" }, // Để không bắt buộc password
                ]}
              >
                <Input.Password className="w-full py-2 px-4 border border-gray-300 rounded-lg" />
              </Form.Item>

              {/* Nút Đăng nhập */}
              <Form.Item className="w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-orange-500 hover:bg-orange-700 text-white py-2 rounded-lg transition-all"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              {/* Nút Đăng ký với câu hỏi "Đã có tài khoản?" */}
              <div className="text-center mt-4">
                <Button
                  type="link"
                  onClick={() => navigate("/register")}
                  className="text-orange-500 hover:text-orange-700"
                >
                  Đã có tài khoản? Đăng ký
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
