import React from "react";
import { Button } from "antd";
import { StarOutlined, DragOutlined } from "@ant-design/icons";
const ButtonFilter = ({ onRating, onDistance }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "70px", // Adjust this to place it below your header
        right: "15px",
        zIndex: 1000, // Higher z-index to stay above the map
      }}
    >
      <Button type="default" onClick={onRating}>
        <StarOutlined /> Tìm kiếm theo đánh giá
      </Button>
      &nbsp;&nbsp;&nbsp;
      <Button type="default" onClick={onDistance}>
        <DragOutlined /> Tìm kiếm theo khoảng cách
      </Button>
    </div>
  );
};

export default ButtonFilter;
