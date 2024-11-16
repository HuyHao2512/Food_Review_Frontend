import React, { useState } from "react";
import { Button, AutoComplete, Rate, Popover } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import DrawerPosition from "../Position/DrawerPosition";

const SearchComponent = () => {
  const [showInput, setShowInput] = useState(false);
  const [searchValue, setSearchValue] = useState(""); // Đây là giá trị hiển thị trong ô input
  const [selectedId, setSelectedId] = useState(null); // Lưu id của mục đã chọn
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [food, setFood] = useState(null);

  const handleIconClick = () => {
    setShowInput(true);
  };
  const onCloseDrawer = () => {
    setOpen(false);
  };

  const onSelectGeo = (value, option) => {
    setSelectedId(value); // Lưu id khi chọn mục
    setSearchValue(option.name); // Cập nhật searchValue với name
    handleGetFood(option.value);
    setOpen(true);
  };

  const handleGetFood = (id) => {
    if (id) {
      fetch(`http://localhost:8080/api/geo/${id}`, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {          
          setFood(data.data);
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);

    if (value) {
      fetch(`http://localhost:8080/api/filter/search?name=${value}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const formattedOptions = data.data.map((item) => ({
            value: item.id, // Lưu id của mục
            name: item.name,
            label: (
              <Popover
                placement="leftTop"
                title="Địa chỉ"
                content={item.address}
              >
                <strong>{item.name}</strong>
                <div>
                  <Rate disabled value={item.rate} />
                </div>
                <div>{item.address}</div>
              </Popover>
            ),
          }));
          setOptions(formattedOptions);
        })
        .catch((error) => console.error("Fetch error:", error));
    } else {
      setOptions([]); // Clear options if input is empty
    }
  };

  return (
    <div style={{ marginRight: 10 }}>
      {!showInput ? (
        <Button
          icon={<SearchOutlined />}
          onClick={handleIconClick}
          type="primary"
        />
      ) : (
        <AutoComplete
          options={options}
          style={{ width: 300 }}
          onSelect={onSelectGeo} // Truyền id khi chọn mục
          onSearch={handleSearch}
          value={searchValue} // Hiển thị giá trị trong input
          onChange={setSearchValue} // Lấy giá trị mới khi người dùng thay đổi
          placeholder="Tìm kiếm..."
          autoFocus
          notFoundContent="Không tìm thấy địa điểm"
        />
      )}
      <DrawerPosition
        food={food || {}}
        open={open}
        placement="left"
        onClose={onCloseDrawer}
        // onDirectionClick={() => handleDirectionClick(food)}
      />
    </div>
  );
};

export default SearchComponent;
