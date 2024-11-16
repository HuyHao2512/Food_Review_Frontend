import React from "react";
import { Button, Dropdown, Rate, Menu, Flex } from "antd";
import {
  StarOutlined,
  DragOutlined,
  FieldTimeOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import SearchFilter from "../Filter/SearchFilter";
const ButtonFilter = ({ onSubmit, onDistance, onTime, onAll }) => {
  const handleChangeRate = (e) => {
    onSubmit(e);
  };
  const subItems = [
    {
      key: "1-1",
      label: (
        <Button
          type="default"
          block
          onClick={() => {
            handleChangeRate(5);
          }}
        >
          <Rate disabled value={5} />
        </Button>
      ),
    },
    {
      key: "1-2",
      label: (
        <Button
          type="default"
          block
          onClick={() => {
            handleChangeRate(4);
          }}
        >
          <Rate disabled value={4} />
        </Button>
      ),
    },
    {
      key: "1-3",
      label: (
        <Button
          type="default"
          block
          onClick={() => {
            handleChangeRate(3);
          }}
        >
          <Rate disabled value={3} />
        </Button>
      ),
    },
    {
      key: "1-4",
      label: (
        <Button
          type="default"
          block
          onClick={() => {
            handleChangeRate(2);
          }}
        >
          <Rate disabled value={2} />
        </Button>
      ),
    },
    {
      key: "1-5",
      label: (
        <Button
          type="default"
          block
          onClick={() => {
            handleChangeRate(1);
          }}
        >
          <Rate disabled value={1} />
        </Button>
      ),
    },
  ];
  const items = [
    {
      key: "1",
      label: (
        <Button type="default" block>
          <StarOutlined /> Tìm kiếm theo đánh giá{" "}
        </Button>
      ),
      children: subItems.map((item) => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      )),
    },
    {
      key: "2",
      label: (
        <Button type="default" onClick={onDistance} block>
          <DragOutlined /> Tìm kiếm theo khoảng cách{" "}
        </Button>
      ),
    },
    {
      key: "3",
      label: (
        <Button type="default" block onClick={onTime}>
          <FieldTimeOutlined /> Tìm kiếm quán còn mở{" "}
        </Button>
      ),
    },
    {
      key: "4",
      label: (
        <Button type="default" block onClick={onAll}>
          <FullscreenOutlined />
          Xem tất cả các quán
        </Button>
      ),
    },
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        right: 50,
        backgroundColor: "transparent", // Nền trong suốt
        border: "none", // Không có đường viền
        zIndex: 1000, // Đảm bảo menu nằm trên bản đồ
        display: "flex",
      }}
    >
      <SearchFilter />

      <Dropdown
        overlay={
          <Menu>
            {items.map((item) =>
              item.children ? (
                <Menu.SubMenu key={item.key} title={item.label}>
                  {item.children}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              )
            )}
          </Menu>
        }
        placement="topRight"
      >
        <Button style={{ border: "1px solid gray" }}>
          Lọc
          <img
            src="./images/filter.gif"
            style={{ height: "30px" }}
            alt="Filter icon"
          />
        </Button>
      </Dropdown>
    </div>
  );
};

export default ButtonFilter;
