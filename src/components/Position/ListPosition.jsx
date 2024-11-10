import React from "react";
import { Modal, List, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
const ListPosition = ({
  isVisible,
  onClose,
  locations,
  onViewInfo,
  onUpdate,
  onDelete,
}) => {
  return (
    <div>
      <Modal
        open={isVisible}
        onCancel={onClose}
        title="Danh sách địa điểm"
        footer={null}
        style={{ minHeight: "400px" }} // Đặt chiều cao tối thiểu cho Modal
        bodyStyle={{ minHeight: "500px" }}
      >
        <List
          dataSource={locations}
          pagination={{
            pageSize: 6, // Số lượng phần tử hiển thị trên mỗi trang
            align: "center",
            position: "bottom",
          }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.name} description={item.address} />
              <Button onClick={() => onViewInfo(item)}>
                <InfoCircleOutlined />
              </Button>
              <Button
                onClick={() => onUpdate(item.id, item.lat, item.lon)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "orange",
                  color: "white",
                }}
              >
                <EditOutlined />
              </Button>
              <Button
                onClick={() => onDelete(item.id)}
                style={{
                  marginLeft: "10px",
                }}
                type="primary"
                danger
              >
                <DeleteOutlined />
              </Button>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ListPosition;
