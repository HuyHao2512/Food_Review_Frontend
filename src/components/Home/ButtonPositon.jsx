import React from "react";
import { Button } from "antd";
import { PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
const ButtonPositon = ({ onAddLocation, onShowList }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "70px", // Adjust this to place it below your header
        right: "15px",
        zIndex: 1000, // Higher z-index to stay above the map
      }}
    >
      <Button type="default" onClick={onAddLocation}>
        <PlusOutlined /> Thêm địa điểm
      </Button>
      &nbsp;&nbsp;&nbsp;
      <Button type="default" onClick={onShowList}>
        <UnorderedListOutlined /> Danh sách địa điểm
      </Button>
    </div>
  );
};

export default ButtonPositon;
