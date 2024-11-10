import React, { useState } from "react";
import { Button, Rate, Input, message } from "antd";
const { TextArea } = Input;

const Comment = ({ idComment }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleComment = () => {
    const closeLoading = message.loading("Đang thêm bình luận...", 0);
    fetch("http://localhost:8080/api/comment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        comment: comment,
        rating: rating,
        positionId: idComment,
      }),
    })
      .then((response) => response.json()) // Parse JSON directly
      .then((data) => {
        if (data.success) {
          console.log("Thêm bình luận thành công:", data);
          closeLoading();
          message.success("Thêm bình luận thành công");
        } else {
          throw new Error(data.message || "Không thể thêm bình luận");
        }
      })
      .catch((error) => {
        closeLoading();
        console.error("Lỗi:", error);
        message.error("Không thể thêm bình luận");
      });
  };

  return (
    <div>
      <h3>Thêm bình luận</h3>
      <TextArea
        placeholder="Nhập bình luận..."
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <br />
      <Rate value={rating} onChange={(value) => setRating(value)} />
      <br />
      <Button
        type="primary"
        style={{ marginTop: "10px" }}
        onClick={handleComment}
      >
        Gửi bình luận
      </Button>
      <hr />
    </div>
  );
};

export default Comment;
