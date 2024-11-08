import React from "react";
import { useState, useEffect } from "react";
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
  const handleImageChange = (info) => {
    setImages(info.file);
  };
  useEffect(() => {
    if (selectedFoodUpdate) {
      form.setFieldsValue({
        name: selectedFoodUpdate.name,
        address: selectedFoodUpdate.address,
        phone: selectedFoodUpdate.phone,
        rate: selectedFoodUpdate.rate,
        open: selectedFoodUpdate.open,
        close: selectedFoodUpdate.close,
        advantage: selectedFoodUpdate.advantage,
        disadvantage: selectedFoodUpdate.disadvantage,
        review: selectedFoodUpdate.review,
      });
    }
  }, [selectedFoodUpdate, form]);
  const onFinishUpdate = (values) => {
    console.log("Received values of form:", values);
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
    formData.append("rate", values.rate);
    formData.append("review", values.review);
    if (images) {
      formData.append("files", images);
    }
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
          name="rate"
          label="Đánh giá"
          rules={[{ required: true, message: "Vui lòng nhập đánh giá!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="review"
          label="review"
          rules={[{ required: true, message: "Vui lòng nhập review!" }]}
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
            beforeUpload={() => false} // Prevent auto-upload
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Thêm ảnh bìa</Button>
          </Upload>
        </Form.Item>
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
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePosition;
