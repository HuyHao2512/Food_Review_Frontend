import React, { useEffect, useState } from "react";
import { List, Card, Rate, Row, Col, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const CommentList = ({ positionId, setFetchComments }) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    fetchComments();
    setFetchComments(() => fetchComments); // Truyền hàm lên component cha
  }, [positionId]);

  const fetchComments = () => {
    if (positionId) {
      fetch(`http://localhost:8080/api/comment/${positionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setComments(data.data); // Assuming data.data contains the array of comments
          } else {
            console.error("Failed to fetch comments:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    }
  };

  const handleDelete = (id) => {
    console.log({ id });
    if (id) {
      fetch(`http://localhost:8080/api/comment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((response) => {
          console.log({ response });
          if (!response.ok) {
            // Kiểm tra nếu phản hồi không thành công và ném lỗi để `catch` bắt được
            throw new Error("Bạn không thể xóa bình luận");
          }
          return response.json();
        })
        .then((data) => {
          console.log({ data });
          message.success(data.message);
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== id)
          );
        })
        .catch((error) => {
          // In ra chi tiết lỗi để debug dễ dàng hơn
          console.error("Error during deletion:", error);
          message.error(`Lỗi: ${error.message || "Xóa bình luận thất bại"}`);
        });
    }
  };

  return (
    <div>
      <h3>Bình luận:</h3>
      <List
        dataSource={comments}
        pagination={{
          pageSize: 4, // Số lượng phần tử hiển thị trên mỗi trang
          align: "center",
          position: "bottom",
        }}
        renderItem={(comment) => (
          <List.Item key={comment.id}>
            <Card
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <div
                    style={{
                      width: "250px",
                      maxHeight: "200px", // Giới hạn chiều cao
                      overflowY: "auto", // Thêm thanh cuộn dọc
                      wordWrap: "break-word", // Tự xuống dòng
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>{comment.user.name}</strong>
                      <p>{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                    <p>
                      <Rate disabled value={comment.rating} />
                    </p>
                    <p> {comment.comment}</p>
                    {comment.user.email === localStorage.getItem("email") && (
                      <Button
                        type="primary"
                        danger
                        onClick={() => handleDelete(comment.id)}
                      >
                        <DeleteOutlined />
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentList;
