import React, { useEffect, useState } from "react";
import { List, Card, Rate, Row, Col, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const CommentList = ({ positionId }) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
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
          message.success("Xóa bình luận thành công");
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    }
  }, [positionId]);
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
                    <p>
                      <strong>{comment.user.name}</strong>
                    </p>
                    <p>
                      <Rate disabled value={comment.rating} />
                    </p>
                    <p> {comment.comment}</p>
                    {comment.user.email === localStorage.getItem("email") && (
                      <Button type="primary" danger>
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
