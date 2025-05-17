import { https } from "./config";

export const commentService = {
  getCommentsByRoomId: (roomId) => {
    return https.get(`/api/binh-luan/lay-binh-luan-theo-phong/${roomId}`);
  },

  postComment: (commentData) => {
    console.log("[commentService] Posting new comment:", commentData);
    return https.post(`/api/binh-luan`, commentData);
  },

  deleteComment: (commentId) => {
    console.log(`[commentService] Deleting comment ID: ${commentId}`);
    return https.delete(`/api/binh-luan/${commentId}`);
  },

  updateComment: (commentId, updatedCommentData) => {
    console.log(
      `[commentService] Updating comment ID: ${commentId} with data:`,
      updatedCommentData
    );
    return https.put(`/api/binh-luan/${commentId}`, updatedCommentData);
  },
};
