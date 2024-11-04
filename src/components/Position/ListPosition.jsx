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
      >
        <List
          dataSource={locations}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.name} description={item.address} />
              <Button onClick={() => onViewInfo(item)}>
                <InfoCircleOutlined />
              </Button>
              <Button
                onClick={() => onUpdate(item.id)}
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
