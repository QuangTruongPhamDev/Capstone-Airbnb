import {
  Alert,
  Avatar,
  Button,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Radio,
  Spin,
  Upload,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userService } from "../../api/userService";
import { CameraOutlined, CheckCircleFilled } from "@ant-design/icons";
import RoomCard from "../RoomListPage/RoomCard";
import dayjs from "dayjs";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUserFromStore = useSelector((state) => state.userSlice.user);
  console.log("Redux userSlice:", currentUserFromStore);

  const [profileData, setProfileData] = useState(null);
  const [bookedRooms, setBookedRooms] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [avatarFileList, setAvatarFileList] = useState([]);

  const fetchBookedRoomsWithDetails = useCallback(
    async (userId) => {
      setLoadingRooms(true);
      try {
        const res = await userService.getBookedRoomsByUser(userId);
        // Đảm bảo bookings là một mảng trước khi map
        const bookings = Array.isArray(res.data?.content)
          ? res.data.content
          : Array.isArray(res.data)
          ? res.data
          : [];

        if (bookings.length === 0) {
          setBookedRooms([]);
          // setLoadingRooms(false); // finally sẽ xử lý
          return; // Không cần return ở đây nếu finally xử lý setLoadingRooms
        }

        const fetchRoomDetailsPromises = bookings.map(async (booking) => {
          try {
            const resRoom = await userService.getRoomById(booking.maPhong);
            // Tạo một ID duy nhất cho key của React, ví dụ từ ID của booking nếu có
            // Hoặc kết hợp mã phòng và ngày đặt để tăng tính duy nhất
            const uniqueKey =
              booking.id ||
              `booking-<span class="math-inline">\{booking\.maPhong\}\-</span>{new Date(booking.ngayDen).getTime()}`;
            return {
              ...resRoom.data.content,
              ...booking,
              uniqueBookingId: uniqueKey,
              id: booking.id || booking.maPhong,
            }; // Đảm bảo 'id' cho RoomCard
          } catch (err) {
            console.warn(
              `Không thể lấy thông tin phòng ${booking.maPhong}:`,
              err
            );
            return null;
          }
        });
        const resolvedRooms = await Promise.all(fetchRoomDetailsPromises);
        setBookedRooms(resolvedRooms.filter((room) => room !== null));
      } catch (err) {
        console.error("Lỗi tải phòng đã đặt:", err);
        setBookedRooms([]); // Reset về mảng rỗng nếu có lỗi
      } finally {
        setLoadingRooms(false); // Luôn đặt setLoadingRooms(false) ở finally
      }
    },
    [setLoadingRooms, setBookedRooms]
  ); // userService là import nên ổn định, không cần thêm vào đây

  useEffect(() => {
    const userId = currentUserFromStore?.id; // Lấy userId từ Redux store
    const searchParams = new URLSearchParams(location.search);
    const needsRefresh = searchParams.get("refresh") === "1";

    if (userId && needsRefresh) {
      console.log(
        "UserProfilePage: Phát hiện 'refresh=1', đang tải lại danh sách phòng..."
      ); // Dòng log để kiểm tra
      fetchBookedRoomsWithDetails(userId);

      // Tạo một đối tượng URLSearchParams mới từ location.search hiện tại
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete("refresh"); // Xóa query param 'refresh'

      // Điều hướng để cập nhật URL, xóa query param 'refresh'
      // Hành động này sẽ không gây reload toàn trang nhưng sẽ cập nhật thanh địa chỉ
      // và cho phép useEffect này chạy lại nếu location.search thay đổi vì lý do khác.
      navigate(
        {
          pathname: location.pathname,
          search: newSearchParams.toString(), // Chuyển URLSearchParams thành chuỗi query
        },
        { replace: true, state: location.state } // replace: true để không thêm vào history
        // state: location.state để giữ lại state hiện tại nếu có
      );
    }
  }, [
    location.search,
    currentUserFromStore,
    navigate,
    fetchBookedRoomsWithDetails,
    dispatch,
  ]);

  useEffect(() => {
    if (!currentUserFromStore || !currentUserFromStore.id) {
      setError("Vui lòng đăng nhập để xem thông tin cá nhân.");
      setLoadingProfile(false);
      setLoadingRooms(false);
      // Cân nhắc navigate("/dangnhap"); nếu muốn tự động chuyển hướng
      return;
    }

    const userId = currentUserFromStore.id;
    setLoadingProfile(true);
    userService
      .getUserDetails(userId)
      .then((res) => {
        if (res.data?.content) {
          setProfileData(res.data.content);
          form.setFieldsValue({
            name: res.data.content.name,
            email: res.data.content.email,
            phone: res.data.content.phone,
            birthday: res.data.content.birthday
              ? dayjs(res.data.content.birthday)
              : null,
            gender: res.data.content.gender,
          });
        } else {
          setError("Không thể tải thông tin người dùng.");
        }
      })
      .catch((err) => {
        console.error("Lỗi tải thông tin người dùng:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Lỗi tải thông tin người dùng."
        );
      })
      .finally(() => setLoadingProfile(false));

    // Tải danh sách phòng đã đặt ban đầu
    fetchBookedRoomsWithDetails(userId);
  }, [currentUserFromStore, form, fetchBookedRoomsWithDetails]);

  const handleUpdateProfile = (values) => {
    const userId = profileData?.id || currentUserFromStore.user?.id;
    if (!userId) {
      alert("Không tìm thấy ID người dùng để cập nhật.");
      return;
    }
    const updatedData = {
      ...values,
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
      gender: values.gender === undefined ? profileData.gender : values.gender,
    };
    userService
      .updateUserDetails(userId, updatedData)
      .then((res) => {
        alert("Cập nhật thông tin thành công!");
        setProfileData((prev) => ({ ...prev, ...res.data?.content }));
        setIsEditModalVisible(false);
      })
      .catch((err) => {
        console.error("Lỗi cập nhật thông tin:", err);
        alert(err.response?.data?.message || "Cập nhật thất bại.");
      });
  };

  const handleUploadAvatar = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("formFile", file);

    userService
      .uploadAvatar(formData)
      .then((res) => {
        if (res.data && res.data.content && res.data.content.avatar) {
          setProfileData((prev) => ({
            ...prev,
            avatar: res.data.content.avatar,
          }));
          alert("Cập nhật ảnh đại diện thành công!");
          setAvatarFileList([]);
          setIsAvatarModalVisible(false);
          if (onSuccess) onSuccess(res.data, file);
        } else {
          throw new Error("API không trả về đường dẫn avatar mới.");
        }
      })
      .catch((err) => {
        console.error("Lỗi upload avatar:", err);
        alert(err.response?.data?.message || "Upload ảnh thất bại.");
        if (onError) onError(err);
      });
  };

  if (loadingProfile && !profileData) {
    return (
      <div className="container mx-auto min-h-screen flex justify-center items-center pt-20">
        <Spin tip="Đang tải thông tin người dùng..." size="large" />
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="container mx-auto min-h-screen flex flex-col justify-center items-center pt-20 px-4">
        <Alert message="Lỗi" description={error} type="error" showIcon />
        <Link
          to="/"
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Về Trang Chủ
        </Link>
      </div>
    );
  }

  if (!profileData && !loadingProfile) {
    return (
      <div className="container mx-auto min-h-screen flex flex-col justify-center items-center pt-20 px-4">
        <p className="text-xl text-gray-600 mb-4">
          Không thể tải thông tin người dùng hoặc bạn cần đăng nhập.
        </p>
        <Button type="primary" onClick={() => navigate("/dangnhap")}>
          Đến trang đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner trên cùng */}
      <div className="bg-gray-800 text-white py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">
            THÔNG TIN NGƯỜI DÙNG {profileData?.name?.toUpperCase() || ""}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cột Sidebar Trái */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                <Avatar
                  src={profileData?.avatar || "/images/default-avatar.png"}
                  size={128}
                  className="border-4 border-white shadow-md"
                />
                <Button
                  icon={<CameraOutlined />}
                  shape="circle"
                  className="absolute bottom-1 right-1 bg-white !border-gray-300 hover:!bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsAvatarModalVisible(true)}
                />
              </div>
              <Button
                type="text"
                onClick={() => setIsAvatarModalVisible(true)}
                className="text-sm text-blue-600 hover:underline mb-4"
              >
                Cập nhật ảnh
              </Button>

              <div className="text-left space-y-3">
                {profileData?.name && (
                  <h2 className="text-xl font-semibold text-gray-800">
                    {profileData.name}
                  </h2>
                )}

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Xác minh danh tính
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Xác minh danh tính của bạn với huy hiệu xác minh danh tính.
                  </p>
                  <Button className="w-full border-gray-800 text-gray-800 hover:!bg-gray-100">
                    Nhận huy hiệu
                  </Button>
                </div>

                {profileData && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {profileData.name || "Người dùng"} đã xác nhận
                    </h3>
                    {profileData.email && (
                      <p className="text-sm text-green-600 flex items-center">
                        <CheckCircleFilled className="mr-1.5" /> Địa chỉ email
                      </p>
                    )}
                    {/* Thêm các thông tin đã xác nhận khác nếu có */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột Nội dung Chính */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Xin chào, tôi là {profileData?.name || "Người dùng"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Bắt đầu tham gia vào{" "}
                    {profileData?.joinDate
                      ? dayjs(profileData.joinDate).format("YYYY")
                      : "năm nay"}
                  </p>{" "}
                  {/* Cần joinDate từ API */}
                </div>
                <Button
                  type="default"
                  onClick={() => setIsEditModalVisible(true)}
                  className="font-semibold border-gray-800 text-gray-800 hover:!bg-gray-100"
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </div>

              <Divider />

              {/* Phần Phòng đã thuê */}
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
                Phòng đã thuê
              </h3>
              {loadingRooms && (
                <div className="text-center py-4">
                  <Spin />
                </div>
              )}
              {!loadingRooms && bookedRooms.length === 0 && (
                <Empty description="Bạn chưa thuê phòng nào." />
              )}
              {!loadingRooms && bookedRooms.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {bookedRooms.map((booking) => (
                    // API /api/dat-phong/lay-theo-nguoi-dung/{MaNguoiDung} trả về thông tin đặt phòng,
                    // nó có thể không chứa đầy đủ thông tin của một "RoomCard" (ví dụ tiện nghi).
                    // Bạn có thể cần fetch chi tiết phòng cho mỗi booking hoặc điều chỉnh RoomCardPlaceholder.
                    // Hoặc, nếu API trả về đủ thông tin phòng trong booking, bạn có thể dùng RoomCard.
                    <RoomCard
                      key={booking.uniqueBookingId || booking.id}
                      room={booking}
                    /> // Giả sử booking object có hinhAnh, tenPhong
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Chỉnh sửa thông tin cá nhân */}
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null} // Bỏ footer mặc định để dùng nút submit của Form
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={{
            // Set giá trị ban đầu cho form từ profileData
            name: profileData?.name,
            email: profileData?.email, // Email thường không cho sửa
            phone: profileData?.phone,
            birthday: profileData?.birthday
              ? dayjs(profileData.birthday)
              : null,
            gender:
              profileData?.gender === true
                ? "true"
                : profileData?.gender === false
                ? "false"
                : undefined, // Chuyển boolean sang string cho Radio.Group
          }}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled /> {/* Email thường không cho phép sửa */}
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="birthday" label="Ngày sinh">
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Radio.Group>
              <Radio value={"true"}>Nam</Radio>
              <Radio value={"false"}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full !bg-red-500 hover:!bg-red-600"
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Cập nhật Avatar */}
      <Modal
        title="Cập nhật ảnh đại diện"
        open={isAvatarModalVisible}
        onCancel={() => setIsAvatarModalVisible(false)}
        footer={null} // Tự custom footer hoặc không cần nếu Upload tự xử lý
      >
        <Upload
          name="avatar" // Tên này có thể không quan trọng bằng tên trong formData.append
          listType="picture-card" // Kiểu hiển thị
          fileList={avatarFileList}
          customRequest={handleUploadAvatar} // Sử dụng customRequest để gọi API của bạn
          beforeUpload={(file) => {
            const isJpgOrPng =
              file.type === "image/jpeg" || file.type === "image/png";
            if (!isJpgOrPng) {
              message.error("Bạn chỉ có thể upload file JPG/PNG!");
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error("Hình ảnh phải nhỏ hơn 2MB!");
            }
            return isJpgOrPng && isLt2M; // Chỉ upload nếu đúng định dạng và kích thước
          }}
          onChange={({ fileList: newFileList }) => {
            setAvatarFileList(newFileList.slice(-1)); // Chỉ giữ lại file cuối cùng
          }}
          onRemove={() => setAvatarFileList([])} // Xóa file khỏi list
          className="flex justify-center"
        >
          {avatarFileList.length < 1 && "+ Tải lên"}
        </Upload>
        <p className="text-xs text-gray-500 text-center mt-2">
          Nhấn vào ảnh để chọn hoặc kéo thả file. Chỉ chấp nhận JPG/PNG, tối đa
          2MB.
        </p>
        {/* Không cần nút submit riêng nếu Upload có cơ chế tự submit hoặc customRequest tự xử lý */}
      </Modal>
    </div>
  );
}
