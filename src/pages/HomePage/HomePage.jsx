import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import { Button, Space, message, Spin, Skeleton } from "antd";
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
import TimeFilter from "../../components/Filter/TimeFilter";
import Address from "../../components/Home/Address";
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
  const [address, setAddress] = useState("");
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
  const [isModalTime, setIsModalTime] = useState(false);
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          fetchAddress(latitude, longitude);
        },
        (err) => {
          console.error(err);
          setError("Không thể lấy vị trí của bạn.");
        }
      );
    } else {
      setError("Geolocation không được hỗ trợ trên trình duyệt của bạn.");
    }
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
        setFoods(data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách:", error);
        setError("Không thể lấy danh sách.");
      });
  }, []);
  const fetchAddress = (latitude, longitude) => {
    // Gọi API để chuyển đổi tọa độ thành địa chỉ
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name) {
          setAddress(data.display_name); // Lưu địa chỉ vào state
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy địa chỉ:", error);
        setError("Không thể lấy địa chỉ.");
      });
  };
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
    setIsModalTime(false);
  };
  const showDistance = () => {
    setIsModalDistance(true);
  };
  const handleTime = () => {
    setIsModalTime(true);
  };
  const handleAll = () => {
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
        setFoods(data.data);
        setRadius(0);
        message.success("Dưới đây là tất cả các địa điểm");
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách:", error);
        setError("Không thể lấy danh sách.");
      });
  };
  const handleChangeData = (e) => {
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
        setFoods(data.data);
        setRadius(0);
        if (data.data.length === 0) {
          message.info(`Không có địa điểm ${e} nào`);
        } else {
          message.success(`Dưới đây là các địa điểm ${e} sao `);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách:", error);
        setError("Không thể lấy danh sách.");
      });
  };
  const handleChangeDataDistance = (e) => {
    fetch(
      `http://localhost:8080/api/filter/by-distance?lat=${e.latitude}&lon=${e.longitude}&distance=${e.distance}`,
      {
        method: "GET",
        headers: {
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
        setRadius(e.distance * 1000);
        setIsModalDistance(false);
        setFoods(data.data);
        if (data.data.length === 0) {
          message.info(`Không có địa điểm nào trong bán kính ${e.distance} km`);
        } else {
          message.success(
            `Dưới đây là các địa điểm trong bán kính ${e.distance} km`
          );
        }
      })
      .catch((error) => {
        message.error("Không thể lấy danh sách.");
        console.error("Lỗi khi lấy danh sách:", error);
        setError("Không thể lấy danh sách.");
      });
  };
  const handleChangeDataTime = (time) => {
    fetch(`http://localhost:8080/api/filter/by-time`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ time }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Mã phản hồi không hợp lệ: " + response.status);
        }
        return response.json(); // Chuyển đổi phản hồi thành JSON
      })
      .then((data) => {
        setFoods(data.data);
        setRadius(0);
        setIsModalTime(false);
        if (data.data.length === 0) {
          message.info("Không có địa điểm nào còn mở cửa");
        } else {
          message.success("Dưới đây là các địa điểm còn mở cửa");
        }
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
        message.success("Xóa địa điểm thành công");
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Xóa địa điểm không thành công");
      });
  };
  const redMarkerIcon = new L.Icon({
    iconUrl: "public/images/pin-map.png", // Path to your red marker image
    iconSize: [25, 41], // Size of the marker
    iconAnchor: [12, 41], // Anchor point of the marker
    popupAnchor: [1, -34], // Popup position relative to the marker
    shadowUrl: "public/images/marker-shadow.png", // Path to the shadow image
    shadowSize: [41, 41], // Size of the shadow
    shadowAnchor: [12, 41], // Anchor point of the shadow
  });
  return (
    <div>
      <div>
        {role === "ADMIN" && (
          <ButtonPositon
            onAddLocation={showAddPositionModal}
            onShowList={showVisible}
          />
        )}
        {role === "USER" && (
          <ButtonFilter
            onDistance={showDistance}
            onSubmit={handleChangeData}
            onTime={handleTime}
            onAll={handleAll}
          />
        )}
      </div>
      <Address address={address} />
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
          <Marker position={position} icon={redMarkerIcon}>
            <Popup>Bạn đang ở đây </Popup>
          </Marker>
          <Circle
            center={position}
            radius={radius}
            color="none"
            fillColor="blue"
            fillOpacity={0.2}
          />
          {foods.map((food) => (
            <Marker key={food.id} position={food.point}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <h4 style={{ fontWeight: "700" }}>{food.name}</h4>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      onClick={() => {
                        showDrawer(); // Đóng Drawer khi bấm nút "Chỉ đường"
                      }}
                      style={{ textAlign: "center" }}
                    >
                      Xem thông tin quán
                    </Button>
                  </div>
                  <DrawerPosition
                    food={food}
                    open={openDrawer}
                    placement={placement}
                    onClose={onCloseDrawer}
                    onDirectionClick={() => handleDirectionClick(food)}
                  />
                </div>
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
        <Skeleton active />
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
      <TimeFilter
        open={isModalTime}
        onCancel={handleCloseModal}
        onSubmit={handleChangeDataTime}
      />
    </div>
  );
}

export default HomePage;
