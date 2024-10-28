import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  Button,
  Drawer,
  Space,
  Rate,
  Input,
  List,
  Modal,
  Form,
  TimePicker,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./leaflet.css";
import "leaflet-routing-machine"; // Import thư viện chỉ đường
import L from "leaflet";
import "./HomePage.css";
const { TextArea } = Input;

// function RoutingControl({ position, foodPosition }) {
//   const map = useMap();
//   const routingControlRef = useRef();

//   useEffect(() => {
//     if (position && foodPosition) {
//       // Xóa điều khiển chỉ đường nếu đã tồn tại
//       if (routingControlRef.current) {
//         routingControlRef.current.remove();
//       }

//       // Thêm điều khiển chỉ đường mới
//       routingControlRef.current = L.Routing.control({
//         waypoints: [
//           L.latLng(position[0], position[1]), // Vị trí người dùng
//           L.latLng(foodPosition[0], foodPosition[1]), // Vị trí nhà thuốc
//         ],
//         routeWhileDragging: true,
//       }).addTo(map);
//     }

//     // Dọn dẹp khi component unmount
//     return () => {
//       if (routingControlRef.current) {
//         routingControlRef.current.remove();
//       }
//     };
//   }, [position, foodPosition, map]);

//   return null;
// }

function RoutingControl({ position, foodPosition }) {
  const map = useMap();
  const routingControlRef = useRef();

  useEffect(() => {
    if (
      position &&
      foodPosition &&
      Array.isArray(foodPosition) &&
      foodPosition.length === 2
    ) {
      // Remove existing routing control if it exists
      if (routingControlRef.current) {
        routingControlRef.current.remove();
      }

      // Add new routing control
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(position[0], position[1]), // User's position
          L.latLng(foodPosition[0], foodPosition[1]), // Food position
        ],
        routeWhileDragging: true,
      }).addTo(map);
    }

    // Cleanup on component unmount
    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
      }
    };
  }, [position, foodPosition, map]);

  return null;
}

function HomePage() {
  const [position, setPosition] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [error, setError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      username: "Người dùng 1",
      comment: "Nhà thuốc này rất tốt và uy tín.",
      rate: 5,
      timestamp: new Date().toLocaleString(),
    },
    {
      username: "Người dùng 2",
      comment: "Dịch vụ ổn nhưng có thể cải thiện thêm.",
      rate: 3,
      timestamp: new Date().toLocaleString(),
    },
  ]);
  const [placement, setPlacement] = useState("left");
  const [isModalVisiblePosition, setIsModalVisiblePosition] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  //set state cho vi tri
  const [name, setName] = useState("");
  const [lon, setLon] = useState("");
  const [lat, setLat] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");
  const [advantage, setAdvantage] = useState("");
  const [disadvantage, setDisadvantage] = useState("");
  const [rate, setRate] = useState("");
  const [review, setReview] = useState("");
  const [images, setImages] = useState(null);
  //handle change
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangeLon = (e) => {
    setLon(e.target.value);
  };
  const handleChangeLat = (e) => {
    setLat(e.target.value);
  };
  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleChangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleChangeOpen = (e) => {
    setOpen(e.target.value);
  };
  const handleChangeClose = (e) => {
    setClose(e.target.value);
  };
  const handleImageChange = (info) => {
    setImages(info.file);
  };
  const handleChangeReview = (e) => {
    setReview(e.target.value);
  };
  const StarRating = ({ rating }) => {
    return <Rate allowHalf disabled value={rating} />;
  };
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const showAddPositionModal = () => {
    setIsModalVisiblePosition(true);
  };
  const onFinish = (values) => {
    console.log("Received values of form:", values);
    const formData = new FormData();
    // Thêm các giá trị vào FormData
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

    // Gửi dữ liệu đến backend
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

  const handleCancel = () => {
    setIsModalVisiblePosition(false);
  };

  // const onFinish = (values) => {
  //   handleAddPosition(values);
  //   handleCancel();
  // };
  const handleSubmitComment = () => {
    if (!selectedFood || !comment.trim()) return;

    const newComment = {
      username: "Người dùng", // Hoặc lấy từ người dùng đăng nhập
      comment: comment,
      timestamp: new Date().toISOString(), // Thời gian hiện tại
    };

    const updatedComments = {
      ...comments,
      [selectedFood.id]: [...(comments[selectedFood.id] || []), newComment],
    };

    setComments(updatedComments);
    setComment(""); // Xóa bình luận sau khi gửi
  };
  // useEffect(() => {
  //   // Lấy vị trí hiện tại của người dùng
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => {
  //         setPosition([pos.coords.latitude, pos.coords.longitude]);
  //       },
  //       (err) => {
  //         console.error(err);
  //         setError("Không thể lấy vị trí của bạn.");
  //       }
  //     );
  //   } else {
  //     setError("Geolocation không được hỗ trợ trên trình duyệt của bạn.");
  //   }

  //   // Lấy danh sách nhà thuốc
  //   fetch("http://localhost:8080/api/geo", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Mã phản hồi không hợp lệ: " + response.status);
  //       }
  //       return response.data;
  //     })
  //     .then((data) => {
  //       const validFoods = data.filter(
  //         (food) =>
  //           food.position &&
  //           Array.isArray(food.position) &&
  //           food.position.length === 2
  //       );
  //       setFoods(validFoods);
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi lấy danh sách :", error);
  //       setError("Không thể lấy danh sách .");
  //     });
  // }, []);
  useEffect(() => {
    // Lấy vị trí hiện tại của người dùng
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error(err);
          setError("Không thể lấy vị trí của bạn.");
        }
      );
    } else {
      setError("Geolocation không được hỗ trợ trên trình duyệt của bạn.");
    }

    // Lấy danh sách nhà thuốc
    fetch("http://localhost:8080/api/geo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Mã phản hồi không hợp lệ: " + response.status);
        }
        return response.json(); // Chuyển đổi phản hồi thành JSON
      })
      .then((data) => {
        const validFoods = data.data.filter(
          // Sửa ở đây
          (food) =>
            food.point && // Thay đổi từ position thành point
            Array.isArray(food.point) &&
            food.point.length === 2
        );
        setFoods(validFoods);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách:", error);
        setError("Không thể lấy danh sách.");
      });
  }, []);
  console.log("Vị trí người dùng:", position);
  console.log(
    "Vị trí thực phẩm đã chọn:",
    selectedFood ? selectedFood.point : null
  );
  const role = JSON.parse(localStorage.getItem("role"));
  const showVisible = () => {
    setIsModalVisible(true);
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <div>
        {role === "ADMIN" && (
          <div style={{ right: "5px" }}>
            <Button type="default" onClick={showAddPositionModal}>
              Thêm địa điểm
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="default" onClick={showVisible}>
              Danh sách địa điểm
            </Button>
          </div>
        )}
      </div>
      {position ? (
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "100vh" }}
          id="map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={position}>
            <Popup>Bạn đang ở đây</Popup>
          </Marker>
          {foods.map((food) => (
            <Marker key={food.id} position={food.point}>
              <Popup>
                <h4 style={{ textAlign: "center", fontWeight: "700" }}>
                  {food.name}
                </h4>
                <Space>
                  <Button
                    onClick={() => {
                      showDrawer(); // Đóng Drawer khi bấm nút "Chỉ đường"
                    }}
                  >
                    Xem thông tin quán
                  </Button>
                </Space>
                <Drawer
                  title={food.name}
                  placement={placement}
                  closable={false}
                  onClose={onCloseDrawer}
                  open={openDrawer}
                  key={placement}
                >
                  <img src={food.images} className="img-des" />
                  <br />
                  <br />
                  <br />
                  <p>
                    Đánh giá: <StarRating rating={food.rate} />
                  </p>
                  <p>Địa chỉ: {food.address}</p>
                  <p>Giờ mở chưa: {food.open}</p>
                  <p>Giờ đóng cửa: {food.close}</p>
                  <p>Số điện thoại: {food.phone}</p>
                  <p>Ưu điểm: {food.advantage}</p>
                  <p>Hạn chế: {food.disadvantage}</p>
                  {/* Phần bình luận */}
                  <hr />
                  <h3>Thêm bình luận</h3>
                  <TextArea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Nhập bình luận..."
                    rows={4}
                  />
                  <br />
                  <br />
                  <Rate />
                  <br />
                  <Button
                    onClick={handleSubmitComment}
                    type="primary"
                    style={{ marginTop: "10px" }}
                  >
                    Gửi bình luận
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    onClick={() => {
                      setSelectedFood(food);
                      onClose(); // Đóng Drawer khi bấm nút "Chỉ đường"
                    }}
                  >
                    Đường đi đến quán
                  </Button>
                  <hr />
                  <h3>Bình luận:</h3>
                  <List
                    dataSource={comments}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.username}
                          description={item.timestamp}
                        />
                        {item.comment}
                        <Rate value={item.rate} />
                      </List.Item>
                    )}
                  />
                </Drawer>
              </Popup>
            </Marker>
          ))}
          {selectedFood && (
            <RoutingControl
              position={position}
              foodPosition={selectedFood.point} // Sử dụng 'point' thay vì 'position'
            />
          )}
        </MapContainer>
      ) : (
        <p>Đang lấy vị trí của bạn...</p>
      )}

      <Modal
        title="Thêm Vị Trí"
        open={isModalVisiblePosition}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên địa điểm"
            rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
          >
            <Input value={name} onChange={handleChangeName} />
          </Form.Item>

          <Form.Item
            name="lon"
            label="Kinh độ"
            rules={[
              { required: true, message: "Vui lòng nhập kinh độ!" },
              { pattern: /^-?\d+(\.\d+)?$/, message: "Kinh độ chỉ chứa số!" },
            ]} // Bắt buộc nhập
          >
            <Input value={lon} onChange={handleChangeLon} />
          </Form.Item>

          <Form.Item
            name="lat"
            label="Vĩ độ"
            rules={[
              { required: true, message: "Vui lòng nhập vĩ độ!" },
              { pattern: /^-?\d+(\.\d+)?$/, message: "Vĩ độ chỉ chứa số!" },
            ]} // Bắt buộc nhập
          >
            <Input value={lat} onChange={handleChangeLat} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa Chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input value={address} onChange={handleChangeAddress} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]*$/, message: "Số điện thoại chỉ chứa số!" },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              value={phone}
              onChange={handleChangePhone}
            />
          </Form.Item>
          <Form.Item
            name="open"
            label="Thời Gian Mở Cửa"
            rules={[
              { required: true, message: "Vui lòng nhập thời gian mở cửa!" },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Chọn thời gian mở cửa"
              value={open}
              onChange={handleChangeOpen}
            />
          </Form.Item>

          <Form.Item
            name="close"
            label="Thời Gian Đóng Cửa"
            rules={[
              { required: true, message: "Vui lòng nhập thời gian đóng cửa!" },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Chọn thời gian đóng cửa"
              value={close}
              onChange={handleChangeClose}
            />
          </Form.Item>
          <Form.Item
            name="advantage"
            label="Ưu điểm"
            rules={[{ required: true, message: "Vui lòng nhập ưu điểm!" }]}
          >
            <Input
              value={advantage}
              onChange={(e) => setAdvantage(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="disadvantage"
            label="Hạn chế"
            rules={[{ required: true, message: "Vui lòng nhập hạn chế!" }]}
          >
            <Input
              value={disadvantage}
              onChange={(e) => setDisadvantage(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="rate"
            label="Đánh giá"
            rules={[{ required: true, message: "Vui lòng nhập đánh giá!" }]}
          >
            <Input value={rate} onChange={(e) => setRate(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="review"
            label="Review"
            rules={[{ required: true, message: "Vui lòng nhập đánh giá!" }]}
          >
            <Input value={review} onChange={handleChangeReview} />
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
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        title="Danh sách địa điểm"
        footer={null}
      >
        <List
          dataSource={foods}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.name} description={item.address} />
              <Button
                onClick={() => {
                  setSelectedFood(item);
                  setIsModalVisible(false);
                  setIsModalVisibleUpdate(true);
                }}
              >
                Xem thông tin
              </Button>
            </List.Item>
          )}
        />
      </Modal>
      <Modal
        title="Thông tin địa điểm"
        open={isModalVisibleUpdate}
        onCancel={() => setIsModalVisibleUpdate(false)}
        footer={null}
      ></Modal>
    </div>
  );
}

export default HomePage;
