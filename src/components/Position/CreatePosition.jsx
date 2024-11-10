import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

const LocationMarker = ({ setLat, setLon }) => {
  const [positionAdd, setPositionAdd] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const roundedLat = parseFloat(lat.toFixed(6)); // Làm tròn đến 6 chữ số thập phân
      const roundedLng = parseFloat(lng.toFixed(6)); // Làm tròn đến 6 chữ số thập phân
      setPositionAdd(e.latlng); // Cập nhật vị trí của Marker
      setLat(roundedLat); // Cập nhật vĩ độ vào state của CreatePosition
      setLon(roundedLng); // Cập nhật kinh độ vào state của CreatePosition
      if (map && map.getZoom) {
        map.flyTo([roundedLat, roundedLng], map.getZoom()); // Zoom vào vị trí đã chọn
      }
    },
  });

  return positionAdd === null ? null : (
    <Marker position={positionAdd}>
      <Popup>
        Kinh độ: {positionAdd.lng.toFixed(5)} <br />
        Vĩ độ: {positionAdd.lat.toFixed(5)}
      </Popup>
    </Marker>
  );
};

const CreatePosition = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState(null);
  const [lat, setLat] = useState(null); // State lưu vĩ độ
  const [lon, setLon] = useState(null); // State lưu kinh độ

  const handleImageChange = (info) => {
    setImages(info.file);
  };

  const onFinishCreate = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("lon", lon); // Gửi kinh độ từ state
    formData.append("lat", lat); // Gửi vĩ độ từ state
    formData.append("address", values.address);
    formData.append("phone", values.phone);
    formData.append("open", values.open);
    formData.append("close", values.close);
    formData.append("advantage", values.advantage);
    formData.append("disadvantage", values.disadvantage);
    formData.append("file", images);
    const loadingMessage = message.loading("Đang thêm địa điểm...", 0);
    fetch("http://localhost:8080/api/geo/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        loadingMessage();
        message.success("Thêm địa điểm thành công");
      })
      .catch((error) => {
        loadingMessage();
        message.error("Thêm địa điểm không thành công");
      });
  };
  console.log("Vĩ độ:", lat);
  console.log("Kinh độ:", lon);
  return (
    <Modal title="Thêm vị trí" open={open} onCancel={onCancel} footer={null}>
      <Form form={form} onFinish={onFinishCreate}>
        <Form.Item
          name="name"
          label="Tên địa điểm"
          rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa Chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="open"
          label="Thời Gian Mở Cửa"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian mở cửa!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="close"
          label="Thời Gian Đóng Cửa"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian đóng cửa!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="advantage"
          label="Ưu điểm"
          rules={[{ required: true, message: "Vui lòng nhập ưu điểm!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="disadvantage"
          label="Hạn chế"
          rules={[{ required: true, message: "Vui lòng nhập hạn chế!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="images"
          label="Hình ảnh"
          rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Thêm ảnh bìa</Button>
          </Upload>
        </Form.Item>

        {/* Bản đồ để chọn vị trí */}
        <div style={{ height: "300px", marginBottom: "16px" }}>
          <MapContainer
            center={[10.5199938, 105.3233821]}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker setLat={setLat} setLon={setLon} />
          </MapContainer>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePosition;
