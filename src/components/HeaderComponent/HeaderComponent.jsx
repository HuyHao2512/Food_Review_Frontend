import { useState } from "react";
import { Layout, Button, Modal, Form, Input, Tabs, message } from "antd";
import { useEffect } from "react";
import { LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import "./Header.css";
const { Header } = Layout;
const { TabPane } = Tabs;

function HeaderComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleLogin = () => {
    setIsModalVisible(true);
  };
  const handleOkLogin = (values) => {
    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng nhập không thành công");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Đăng nhập thành công:", data);
        localStorage.setItem("accessToken", data.data.token.access_token);
        localStorage.setItem("refreshToken", data.data.token.refresh_token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", JSON.stringify(data.data.role));
        setIsLoggedIn(true);
        setIsModalVisible(false);
        message.success("Đăng nhập thành công!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        // Thông báo cho người dùng về lỗi
        message.error("Có lỗi khi đăng nhập!");
      });
  };
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleOkRegister = (values) => {
    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có trùng nhau không
    if (values.password !== values.confirm) {
      // Thông báo lỗi nếu mật khẩu không trùng nhau
      console.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      message.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return; // Dừng hàm nếu mật khẩu không khớp
    }
    const loading = message.loading("Đang xử lý đăng ký...", 0);
    // Gửi yêu cầu đăng ký đến backend
    fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng ký không thành công");
        }
        return response.json();
      })
      .then((data) => {
        loading(); // Ẩn loading
        console.log("Đăng ký thành công:", data);
        message.success("Bạn đã đăng ký thành công, vui lòng kiểm tra Email");
        setIsModalVisible(false); // Đóng modal khi đăng ký thành công
      })
      .catch((error) => {
        loading(); // Ẩn loading
        console.error("Lỗi:", error);
        // Thông báo cho người dùng về lỗi đăng ký
        message.error("Có lỗi khi đăng ký");
      });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    const accessToken = localStorage.getItem("accessToken");

    // Gửi yêu cầu đăng xuất tới server
    fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Gửi token để xác thực
      },
      body: JSON.stringify({
        accessToken: accessToken, // Gửi refreshToken để server có thể thu hồi
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng xuất không thành công");
        }
        return response.json();
      })
      .then((data) => {
        // Xóa token khỏi localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        // Cập nhật trạng thái không đăng nhập
        setIsLoggedIn(false);
        message.success("Đã đăng xuất thành công");
        console.log("Đã đăng xuất thành công");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        message.error("Có lỗi khi đăng xuất");
      });
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#96d6ff",
        }}
      >
        <h1 className="title">
          <span className="title-letter">F</span>
          <img src="public/images/bibimbap.png" style={{ width: "30px" }} />
          od
          <span className="title-letter">R</span>
          eview
        </h1>

        <div>
          {isLoggedIn ? (
            <div>
              <Button type="primary" onClick={handleLogout}>
                <LogoutOutlined />
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Button type="default" onClick={handleLogin}>
              <LoginOutlined />
              Đăng nhập
            </Button>
          )}
        </div>
      </Header>

      {/* Modal Đăng Nhập / Đăng Ký */}
      <Modal
        title="Đăng Nhập / Đăng Ký"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Đăng Nhập" key="1">
            <Form onFinish={handleOkLogin}>
              <Form.Item
                label="Tài khoản"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Đăng Ký" key="2">
            <Form onFinish={handleOkRegister}>
              <Form.Item
                label="Tên người dùng"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirm"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Đăng Ký
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </Layout>
  );
}

export default HeaderComponent;
