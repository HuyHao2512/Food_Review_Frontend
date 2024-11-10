import React from "react";
import { Modal } from "antd";

const InfoModal = ({ visible, onClose, food }) => {
  return (
    <Modal title={food.name} open={visible} onCancel={onClose} footer={null}>
      <p>
        <strong>Địa chỉ:</strong> {food.address}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {food.phone}
      </p>
      <p>
        <strong>Thời gian mở cửa:</strong> {food.open}
      </p>
      <p>
        <strong>Thời gian đóng cửa:</strong> {food.close}
      </p>
      <p>
        <strong>Ưu điểm:</strong> {food.advantage}
      </p>
      <p>
        <strong>Hạn chế:</strong> {food.disadvantage}
      </p>
      <p>
        <strong>Đánh giá:</strong> {food.rate}
      </p>
      {food.images && (
        <img src={food.images} alt={food.name} style={{ width: "100%" }} />
      )}
    </Modal>
  );
};

export default InfoModal;
