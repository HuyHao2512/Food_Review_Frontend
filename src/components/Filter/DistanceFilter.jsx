import React, { useState } from "react";
import { Button, Modal, Input, List, message } from "antd";

const DistanceFilter = ({ open, onCancel, onDistance }) => {
  const [distance, setDistance] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [position, setPosition] = useState(null);

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  const handleDistanceFilter = () => {
    if (!distance) {
      message.error("Vui lòng nhập khoảng cách.");
      return;
    }
    onDistance(distance);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ latitude, longitude });

          // Construct the query parameter URL with latitude, longitude, and distance
          fetch(
            `http://localhost:8080/api/filter/by-distance?lat=${latitude}&lon=${longitude}&distance=${distance}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              console.log("Kết quả lọc theo khoảng cách:", data);
              setFilteredData(data.data); // Assuming data.data contains the array of filtered data
            })
            .catch((error) => {
              console.error("Lỗi:", error);
            });
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
      {filteredData.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <img
            src="public/images/not-found.png"
            alt="No data"
            style={{ width: "200px" }}
          />
          <p>Không có quán gần bạn trong khoảng cách này</p>
        </div>
      ) : (
        <List
          style={{ marginTop: 16 }}
          dataSource={filteredData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name} // Adjust this based on your data structure
                description={item.address} // Adjust this based on your data structure
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default DistanceFilter;
