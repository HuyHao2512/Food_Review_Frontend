import React, { useEffect, useState } from "react";
import { List, Card, Rate, Row, Col, Pagination } from "antd";

const CommentList = ({ positionId }) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (positionId) {
      // Fetch comments for this position
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
                  <p>
                    <strong>Bình luận: </strong>
                    {comment.comment}
                  </p>
                  <p>
                    <strong>Đánh giá: </strong>
                    <Rate disabled value={comment.rating} />
                  </p>
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
