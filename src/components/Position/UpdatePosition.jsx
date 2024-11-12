import React from "react";
import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Upload, TimePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import moment from "moment";
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

const UpdatePosition = ({
  open,
  onCancel,
  selectedFoodId,
  selectedFoodUpdate,
}) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState(null);
  const [lat, setLat] = useState(null); // State lưu vĩ độ
  const [lon, setLon] = useState(null); // State lưu kinh độ
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLon, setSelectedLon] = useState(null);
  const handleImageChange = (info) => {
    setImages(info.file);
  };

  useEffect(() => {
    if (selectedFoodUpdate) {
      setSelectedLat(selectedFoodUpdate.point[0]);
      setSelectedLon(selectedFoodUpdate.point[1]);
      form.setFieldsValue({
        name: selectedFoodUpdate.name,
        address: selectedFoodUpdate.address,
        phone: selectedFoodUpdate.phone,
        lon: selectedFoodUpdate.point[0],
        lat: selectedFoodUpdate.point[1],
        open: moment(selectedFoodUpdate.open, "HH:mm:ss"),
        close: moment(selectedFoodUpdate.close, "HH:mm:ss"),
        advantage: selectedFoodUpdate.advantage,
        disadvantage: selectedFoodUpdate.disadvantage,
        images: selectedFoodUpdate.images,
      });
    }
  }, [selectedFoodUpdate, form]);
  const onFinishUpdate = (values) => {
    console.log("Received values of form:", values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("lon", lon || values.lon); // Gửi kinh độ từ state
    formData.append("lat", lat || values.lat); // Gửi vĩ độ từ state
    formData.append("address", values.address);
    formData.append("phone", values.phone);
    formData.append("open", moment(values.open).format("HH:mm:ss"));
    formData.append("close", moment(values.close).format("HH:mm:ss"));
    formData.append("advantage", values.advantage);
    formData.append("disadvantage", values.disadvantage);
    formData.append("files", images);
    console.log(selectedFoodId);
    const id = selectedFoodId;
    const loadingMessage = message.loading("Đang cập nhật địa điểm...", 0);
    fetch(`http://localhost:8080/api/geo/${id}`, {
      method: "PUT",
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
        console.log("Success:", data);
        loadingMessage();
        message.success("Cập nhật địa điểm thành công");
        onCancel(); // Đóng modal
      })
      .catch((error) => {
        console.error("Error:", error);
        loadingMessage();
        message.error("Cập nhật địa điểm không thành công");
      });
  };
  console.log(selectedLat, selectedLon);
  return (
    <Modal
      title="Chỉnh sửa vị trí"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinishUpdate}>
        <Form.Item
          name="name"
          label="Tên địa điểm"
          rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lon"
          label="Lon"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          hidden
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lat"
          label="Lon"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          hidden
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
          <TimePicker format="HH:mm:ss" />
        </Form.Item>

        <Form.Item
          name="close"
          label="Thời Gian Đóng Cửa"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian đóng cửa!" },
          ]}
        >
          <TimePicker format="HH:mm:ss" />
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
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePosition;
