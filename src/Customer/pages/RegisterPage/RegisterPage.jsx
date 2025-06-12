import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerService } from "../../api/userService";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import toast from "react-hot-toast";
import "./registerpage.css";
import dayjs from "dayjs";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const payload = {
        id: 0,
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        birthday: values.birthday.format("YYYY-MM-DD"),
        gender: values.gender === "male",
        role: "USER", // Mặc định là USER
      };

      const res = await registerService(payload);
      toast.success("Đăng ký thành công!");

      const tempLoginInfo = {
        email: values.email,
        password: values.password,
      };
      localStorage.setItem("RECENT_REGISTER", JSON.stringify(tempLoginInfo));

      navigate("/dangnhap");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!"
      );
    }
  };

  useEffect(() => {
    document.title = "Đăng ký tài khoản";
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-start px-4 py-10 pt-20"
      style={{
        backgroundImage: "url('/images/image_register.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 bg-opacity-60 z-0"></div>

      <div className="relative z-10 max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-red-500">
          Đăng ký tài khoản
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ gender: "male" }}
          labelAlign="left"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Họ tên</span>}
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="font-semibold text-gray-700">Email</span>}
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className="font-semibold text-gray-700">Mật khẩu</span>
            }
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span className="font-semibold text-gray-700">Số điện thoại</span>
            }
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="birthday"
            label={
              <span className="font-semibold text-gray-700">Ngày sinh</span>
            }
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label={
              <span className="font-semibold text-gray-700">Giới tính</span>
            }
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Xoá mục role ở đây */}

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className="w-full bg-red-600 hover:bg-red-700 border-red-600"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="text-center">
            <Button
              type="link"
              onClick={() => navigate("/dangnhap")}
              className="text-red-600 hover:underline"
            >
              Đã có tài khoản? Đăng nhập
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
