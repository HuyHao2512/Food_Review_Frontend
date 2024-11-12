import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Upload, TimePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import moment from "moment";

const LocationMarker = ({ setLat, setLon }) => {
  const [positionAdd, setPositionAdd] = useState(null);
  const map = useMap(); // Lấy bản đồ hiện tại

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const roundedLat = parseFloat(lat.toFixed(6));
      const roundedLng = parseFloat(lng.toFixed(6));
      setPositionAdd(e.latlng);
      setLat(roundedLat);
      setLon(roundedLng);
      map.flyTo([roundedLat, roundedLng], map.getZoom()); // Zoom vào vị trí đã chọn
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
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const handleImageChange = (info) => {
    setImages(info.file);
  };

  const onFinishCreate = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("lon", lon);
    formData.append("lat", lat);
    formData.append("address", values.address);
    formData.append("phone", values.phone);

    // Định dạng thời gian mở và đóng cửa
    formData.append("open", moment(values.open).format("HH:mm"));
    formData.append("close", moment(values.close).format("HH:mm"));

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
      .then(() => {
        loadingMessage();
        message.success("Thêm địa điểm thành công");
        window.location.reload(); // Load lại trang để hiển thị địa điểm mới
        form.resetFields(); // Reset lại form
        onCancel(); // Đóng modal
      })
      .catch(() => {
        loadingMessage();
        message.error("Thêm địa điểm không thành công");
      });
  };

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
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          name="close"
          label="Thời Gian Đóng Cửa"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian đóng cửa!" },
          ]}
        >
          <TimePicker format="HH:mm" />
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

        <div style={{ height: "300px", marginBottom: "16px" }}>
          <MapContainer
            center={[10.03104, 105.76946]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
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
