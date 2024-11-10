import React, { useState } from "react";
import { Rate, Modal, Select, message, Button, List } from "antd";

const RatingFilter = ({ open, onCancel }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const handleRatingChange = (value) => {
    setSelectedRating(value);
  };

  const handleRatingFilter = () => {
    if (selectedRating) {
      console.log("Đánh giá đã chọn:", selectedRating);
    } else {
      message.error("Chưa chọn đánh giá");
      return;
    }

    // Construct the query parameter URL with the selected rating
    fetch(`http://localhost:8080/api/filter/by-star?star=${selectedRating}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Lọc theo đánh giá:", data);
        setFilteredData(data.data); // Assuming data.data contains the array of filtered data
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  };

  return (
    <Modal title="Đánh giá" open={open} onCancel={onCancel} footer={null}>
      <Select
        value={selectedRating}
        onChange={handleRatingChange}
        placeholder="Chọn đánh giá"
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Select.Option value={5}>
          <Rate disabled value={5} />
        </Select.Option>
        <Select.Option value={4}>
          <Rate disabled value={4} />
        </Select.Option>
        <Select.Option value={3}>
          <Rate disabled value={3} />
        </Select.Option>
        <Select.Option value={2}>
          <Rate disabled value={2} />
        </Select.Option>
        <Select.Option value={1}>
          <Rate disabled value={1} />
        </Select.Option>
      </Select>
      <Button type="primary" onClick={handleRatingFilter} block>
        Lọc
      </Button>
      <List
        style={{ marginTop: 16 }}
        dataSource={filteredData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.name} // Adjust this based on your data structure
              description={item.address} // Adjust this based on your data structure
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default RatingFilter;
