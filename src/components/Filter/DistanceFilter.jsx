import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";

const DistanceFilter = ({ open, onCancel, onSubmit }) => {
  const [distance, setDistance] = useState(0);
  const [position, setPosition] = useState(null);

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };
  const handleDistanceFilter = () => {
    if (!distance) {
      message.error("Vui lòng nhập khoảng cách.");
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ latitude, longitude });
          onSubmit({ latitude, longitude, distance });
        },
        (err) => {
          console.error(err);
          message.error("Không thể lấy vị trí của bạn.");
        }
      );
    } else {
      message.error("Geolocation không được hỗ trợ trên trình duyệt của bạn.");
    }
  };

  return (
    <Modal
      title="Nhập khoảng cách bạn muốn tìm kiếm (km)"
      open={open}
      onCancel={onCancel}
      onDistance={() => setDistance(distance)}
      footer={null}
    >
      <Input
        placeholder="Nhập khoảng cách"
        value={distance}
        onChange={handleDistanceChange}
        type="number"
        min="0"
      />
      <Button
        type="primary"
        style={{ marginTop: "10px" }}
        block
        onClick={handleDistanceFilter}
      >
        Tìm kiếm
      </Button>
    </Modal>
  );
};

export default DistanceFilter;
