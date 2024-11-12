import react from "react";
import { Button, Input, List, Modal } from "antd";
import { useState } from "react";
const TimeFilter = ({ open, onCancel, onSubmit }) => {
  const [time, setTime] = useState("");
  console.log({ open });

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };
  const handleTimeSubmit = () => {
    onSubmit(time);
  };
  return (
    <div>
      <Modal title="Nhập khoản" open={open} onCancel={onCancel} footer={null}>
        <Input
          placeholder="Nhập thời gian"
          value={time}
          onChange={handleTimeChange}
          type="time"
        />
        <Button
          type="primary"
          style={{ marginTop: "10px" }}
          block
          onClick={handleTimeSubmit}
        >
          Tìm kiếm
        </Button>
      </Modal>
    </div>
  );
};
export default TimeFilter;
