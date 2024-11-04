import React from "react";
import { useState } from "react";
import { Modal, Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const CreatePosition = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState(null);

  const handleImageChange = (info) => {
    setImages(info.file);
  };

  const onFinishCreate = (values) => {
    console.log("Received values of form:", values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("lon", values.lon);
    formData.append("lat", values.lat);
    formData.append("address", values.address);
    formData.append("phone", values.phone);
    formData.append("open", values.open);
    formData.append("close", values.close);
    formData.append("advantage", values.advantage);
    formData.append("disadvantage", values.disadvantage);
    formData.append("rate", values.rate);
    formData.append("review", values.review);
    formData.append("file", images);
    fetch("http://localhost:8080/api/geo/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Gửi token để xác thực
      },
      body: formData, // Chỉ cần truyền formData
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Success:", data);
        message.success("Thêm địa điểm thành công");
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Thêm địa điểm không thành công");
      });
  };

  // Kiểm tra selectedFood có hợp lệ không

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
          name="lon"
          label="Kinh độ"
          rules={[{ required: true, message: "Vui lòng nhập kinh độ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lat"
          label="Vĩ độ"
          rules={[{ required: true, message: "Vui lòng nhập vĩ độ!" }]}
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
