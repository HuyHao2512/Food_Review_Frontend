import React from "react";
import { Modal, List, Button } from "antd";
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
              <Button onClick={() => onViewInfo(item)}>Xem thông tin</Button>
              <Button
                onClick={() => onUpdate(item.id)}
                style={{ marginLeft: "10px" }}
              >
                Cập nhật
              </Button>
              <Button
                onClick={() => onDelete(item.id)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Xóa
              </Button>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ListPosition;
