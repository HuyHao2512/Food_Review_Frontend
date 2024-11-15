import react from "react";
import { Button, Input, Modal } from "antd";
import { useState, useEffect } from "react";
const TimeFilter = ({ open, onCancel, onSubmit }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setTime(currentTime);
  }, []);

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };
  const handleTimeSubmit = () => {
    onSubmit(time);
  };
  return (
    <div>
      <Modal
        title="Tìm quán ăn còn mở"
        open={open}
        onCancel={onCancel}
        footer={null}
      >
        <Input
          placeholder="Nhập thời gian"
          value={time}
          onChange={handleTimeChange}
          type="time"
          disabled
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
