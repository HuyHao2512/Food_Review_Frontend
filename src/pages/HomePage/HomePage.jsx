import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Button, Drawer, Space, Rate, Input, List, message, Spin } from "antd";
import "./leaflet.css";
import "leaflet-routing-machine"; // Import thư viện chỉ đường
import L from "leaflet";
import "./HomePage.css";
import CreatePosition from "../../components/Position/CreatePosition";
import UpdatePosition from "../../components/Position/UpdatePosition";
import InfoModal from "../../components/Position/InfoModal";
import ListPosition from "../../components/Position/ListPosition";
import DrawerPosition from "../../components/Position/DrawerPosition";
import ButtonPositon from "../../components/Home/ButtonPositon";
const { TextArea } = Input;
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
  const [selectedFoodInfo, setSelectedFoodInfo] = useState(null);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
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
  const [isModalVisibleList, setIsModalVisibleList] = useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [isModalVisibleInfo, setIsModalVisibleInfo] = useState(false);
  const StarRating = ({ rating }) => {
    return <Rate allowHalf disabled value={rating} />;
  };
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const handleDirectionClick = (food) => {
    setSelectedFood(food);
    onCloseDrawer();
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
    // Lấy danh sách
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
    selectedFoodInfo ? selectedFoodInfo.point : null
  );
  const role = JSON.parse(localStorage.getItem("role"));
  const showVisible = () => {
    setIsModalVisibleList(true);
  };
  const handleViewInfo = (item) => {
    setSelectedFoodInfo(item);
    setIsModalVisibleInfo(true);
  };
  const handleUpdate = (id) => {
    setIsModalVisibleUpdate(true);
    setSelectedFoodId(id);
  };
  const handleCloseModal = () => {
    setIsModalVisibleInfo(false);
    setSelectedFood(null); // Đặt lại selectedFood khi đóng modal
    setSelectedFoodInfo(null);
  };
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/geo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Success:", data);
        message.success("Xóa địa điểm thành công");
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Xóa địa điểm không thành công");
      });
  };
  return (
    <div>
      {error && <p>{error}</p>}
      <div>
        {role === "ADMIN" && (
          <ButtonPositon
            onAddLocation={showAddPositionModal}
            onShowList={showVisible}
          />
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
                <DrawerPosition
                  food={food}
                  open={openDrawer}
                  placement={placement}
                  onClose={onCloseDrawer}
                  comment={comment}
                  onCommentChange={handleCommentChange}
                  onSubmitComment={handleSubmitComment}
                  comments={comments[food.id] || []}
                  onDirectionClick={() => handleDirectionClick(food)}
                />
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
        <p>
          <Spin />
          Đang lấy vị trí của bạn...
        </p>
      )}
      <CreatePosition
        open={isModalVisiblePosition}
        onCancel={() => setIsModalVisiblePosition(false)}
        title="Thêm vị trí"
        footer={null}
      />
      <ListPosition
        isVisible={isModalVisibleList}
        onClose={() => setIsModalVisibleList(false)}
        locations={foods}
        onViewInfo={handleViewInfo}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <UpdatePosition
        open={isModalVisibleUpdate}
        onCancel={() => setIsModalVisibleUpdate(false)}
        title="Cập nhật thông tin"
        footer={null}
        selectedFoodId={selectedFoodId}
      />
      {selectedFoodInfo && (
        <InfoModal
          visible={isModalVisibleInfo}
          onClose={handleCloseModal}
          food={selectedFoodInfo}
        />
      )}
    </div>
  );
}

export default HomePage;
