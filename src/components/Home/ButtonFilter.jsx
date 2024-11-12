import React from "react";
import { Button, Dropdown } from "antd";
import { StarOutlined, DragOutlined, FilterOutlined } from "@ant-design/icons";

const ButtonFilter = ({ onRating, onDistance }) => {
  const items = [
    {
      key: "1",
      label: (
        <Button type="default" onClick={onRating} block>
          <StarOutlined /> Tìm kiếm theo đánh giá{" "}
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="default" onClick={onDistance} block>
          <DragOutlined /> Tìm kiếm theo khoảng cách{" "}
        </Button>
      ),
    },
  ];
  return (
    // <div
    //   style={{
    //     position: "absolute",
    //     top: "70px", // Adjust this to place it below your header
    //     right: "15px",
    //     zIndex: 1000, // Higher z-index to stay above the map
    //   }}
    // >
    //   <Button type="default" onClick={onRating}>
    //     <StarOutlined /> Tìm kiếm theo đánh giá
    //   </Button>
    //   &nbsp;&nbsp;&nbsp;
    //   <Button type="default" onClick={onDistance}>
    //     <DragOutlined /> Tìm kiếm theo khoảng cách
    //   </Button>
    // </div>
    <div
      style={{
        position: "absolute",
        top: 70,
        right: 50,
        backgroundColor: "transparent", // Nền trong suốt
        border: "none", // Không có đường viền
        zIndex: 1000, // Đảm bảo menu nằm trên bản đồ
      }}
    >
      <Dropdown
        menu={{
          items,
        }}
        placement="topRight"
      >
        <Button style={{ border: "1px solid gray" }}>
          Lọc
          <img src="./images/filter.gif" style={{ height: "30px" }} />
        </Button>
      </Dropdown>
    </div>
  );
};

export default ButtonFilter;
