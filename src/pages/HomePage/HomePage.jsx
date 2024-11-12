import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import { Button, Space, Rate, message, Spin } from "antd";
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
import ButtonFilter from "../../components/Home/ButtonFilter";
import DistanceFilter from "../../components/Filter/DistanceFilter";
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
  const [selectedFoodUpdate, setSelectedFoodUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [placement, setPlacement] = useState("left");
  const [isModalVisiblePosition, setIsModalVisiblePosition] = useState(false);
  const [isModalVisibleList, setIsModalVisibleList] = useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [isModalVisibleInfo, setIsModalVisibleInfo] = useState(false);
  const [isModalDistance, setIsModalDistance] = useState(false);
  const [radius, setRadius] = useState(0);
  const showDrawer = (id) => {
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
  const showAddPositionModal = () => {
    setIsModalVisiblePosition(true);
  };
  // const handleChangeDistance = (distance) => {
  //   setRadius(distance * 1000);
  //   setIsModalDistance(false);
  //   setFoods();
  // };
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
        // <<<<<<< HEAD
        //         const validFoods = data.data.filter(
        //           // Sửa ở đây
        //           (food) =>
        //             food.point && // Thay đổi từ position thành point
        //             Array.isArray(food.point) &&
        //             food.point.length === 2
        //         );
        //         setFoods(validFoods);
        //         console.log("Danh sách địa điểm validoo", validFoods);
        // =======
        setFoods(data.data);
        // >>>>>>> c3f893f3bad4c0d371024ec60a573de9e44b202b
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách:", error);
        setError("Không thể lấy danh sách.");
      });
  }, []);
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
    setSelectedFoodUpdate(foods.find((food) => food.id === id));
  };
  const handleCloseModal = () => {
    setIsModalVisibleInfo(false);
    setSelectedFood(null); // Đặt lại selectedFood khi đóng modal
    setSelectedFoodInfo(null);
  };
  const showDistance = () => {
    setIsModalDistance(true);
  };
  const handleChangeData = (e) => {
    console.log({ e });
    fetch(`http://localhost:8080/api/filter/by-star?star=${e}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Mã phản hồi không hợp lệ: " + response.status);
        }
        return response.json(); // Chuyển đổi phản hồi thành JSON
      })
      .then((data) => {
        console.log("Danh sách địa điểm validoo", data.data);
        setFoods(data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách:", error);
        setError("Không thể lấy danh sách.");
      });
  };
  const handleChangeDataDistance = (e) => {
    console.log("Kết quả lọc theo khoảng cách:", e);
    fetch(
      `http://localhost:8080/api/filter/by-distance?lat=${e.latitude}&lon=${e.longitude}&distance=${e.distance}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Mã phản hồi không hợp lệ: " + response.status);
        }
        return response.json(); // Chuyển đổi phản hồi thành JSON
      })
      .then((data) => {
        console.log("Danh sách địa điểm validoo", data.data);
        setRadius(e.distance * 1000);
        setIsModalDistance(false);
        setFoods(data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách:", error);
        setError("Không thể lấy danh sách.");
      });
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
  console.log(selectedFood);
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
        {role === "USER" && (
          <ButtonFilter onDistance={showDistance} onSubmit={handleChangeData} />
        )}
      </div>
      {position ? (
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "93vh" }}
          id="map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>Bạn đang ở đây</Popup>
          </Marker>
          <Circle
            center={position}
            radius={radius} // Đơn vị là mét, tạo ra một vòng tròn có bán kính 1000m
            color="none"
            fillColor="blue"
            fillOpacity={0.2}
          />
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
        selectedFoodUpdate={selectedFoodUpdate}
      />
      {selectedFoodInfo && (
        <InfoModal
          visible={isModalVisibleInfo}
          onClose={handleCloseModal}
          food={selectedFoodInfo}
        />
      )}
      <DistanceFilter
        open={isModalDistance}
        onCancel={() => setIsModalDistance(false)}
        onSubmit={handleChangeDataDistance}
      />
    </div>
  );
}

export default HomePage;
