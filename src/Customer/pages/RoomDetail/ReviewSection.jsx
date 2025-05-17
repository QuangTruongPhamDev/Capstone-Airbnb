import { StarFilled } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  Pagination,
  Rate,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { commentService } from "../../api/commentService";

const { TextArea } = Input;
export default function ReviewSection({ comments = [], reviewInfo, roomId }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const userSlice = useSelector((state) => state.userSlice);
  const currentUser = userSlice.user || null;

  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [allComments, setAllComments] = useState(comments);
  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 4;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = allComments.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  useEffect(() => {
    setAllComments(comments);
  }, [comments]);

  const fetchComments = async () => {
    try {
      const res = await commentService.getCommentsByRoomId(roomId);
      const newComments = res.data?.content?.data || res.data?.content || [];
      setAllComments(newComments);
    } catch (err) {
      console.error("Lỗi khi lấy lại bình luận:", err);
    }
  };

  const handlePostComment = async (values) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để viết bình luận.");
      navigate("/dangnhap", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    setSubmittingComment(true);
    setCommentError(null);

    try {
      const payload = {
        id: 0,
        maPhong: parseInt(roomId),
        maNguoiBinhLuan: currentUser.id,
        ngayBinhLuan: new Date().toISOString(),
        noiDung: values.noiDung.trim(),
        saoBinhLuan: Math.round(values.saoBinhLuan), // ✅ làm tròn để đảm bảo là integer
      };

      console.log("Payload gửi đi:", payload);

      await commentService.postComment(payload);

      alert("Gửi bình luận thành công!");
      form.resetFields();
      fetchComments();
    } catch (err) {
      console.error("Lỗi gửi bình luận:", err);
      setCommentError(
        err.response?.data?.message || err.message || "Không thể gửi bình luận."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  const paginate = (page) => setCurrentPage(page);

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      <div className="flex items-center mb-6">
        <StarFilled className="text-xl sm:text-2xl text-red-500 mr-2" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {reviewInfo.score?.toFixed(1) || "Mới"} · {reviewInfo.count || 0} đánh
          giá
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {currentReviews.length > 0 ? (
          currentReviews.map((comment) => (
            <div key={comment.id} className="mb-4">
              <div className="flex items-center mb-2">
                <Avatar
                  src={comment.avatar || "/images/default-avatar.png"}
                  size={40}
                  className="mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {comment.tenNguoiBinhLuan || "Ẩn danh"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {comment.ngayBinhLuan
                      ? new Date(comment.ngayBinhLuan).toLocaleDateString(
                          "vi-VN",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Không rõ ngày"}
                  </p>
                </div>
              </div>
              {typeof comment.saoBinhLuan === "number" && (
                <Rate
                  disabled
                  defaultValue={comment.saoBinhLuan}
                  className="text-sm mb-1"
                />
              )}
              <p className="text-gray-700 leading-relaxed text-sm">
                {comment.noiDung || "Không có nội dung bình luận."}
              </p>
            </div>
          ))
        ) : (
          <p className="md:col-span-2 text-gray-600">
            Chưa có bình luận nào cho phòng này.
          </p>
        )}
      </div>

      {allComments.length > reviewsPerPage && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={currentPage}
            total={allComments.length}
            pageSize={reviewsPerPage}
            onChange={paginate}
          />
        </div>
      )}

      <Divider />
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Để lại đánh giá của bạn
      </h3>
      {currentUser ? (
        <Form form={form} layout="vertical" onFinish={handlePostComment}>
          <Form.Item
            name="saoBinhLuan"
            label="Đánh giá của bạn"
            rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
          >
            <Rate allowHalf={false} defaultValue={0} />
          </Form.Item>
          <Form.Item
            name="noiDung"
            label="Bình luận"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung bình luận!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ cảm nghĩ của bạn về chỗ ở này..."
            />
          </Form.Item>
          {commentError && (
            <Alert
              message={commentError}
              type="error"
              showIcon
              className="mb-3"
            />
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submittingComment}
              className="!bg-red-500 hover:!bg-red-600"
            >
              Gửi bình luận
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="p-4 border rounded-md bg-gray-50 text-center">
          <p className="text-gray-600">
            <Link
              to="/dangnhap"
              state={{ from: location.pathname + location.search }}
              className="font-semibold text-red-500 hover:underline"
            >
              Đăng nhập
            </Link>{" "}
            để viết bình luận và chia sẻ trải nghiệm của bạn.
          </p>
        </div>
      )}
    </section>
  );
}
