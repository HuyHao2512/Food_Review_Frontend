// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Địa chỉ server của bạn
});

let refreshTokenFlat = null;

// Thêm interceptor để tự động thêm token vào header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Hàm refresh token
function handleRefreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return Promise.reject(new Error("No refresh token available."));
  }

  return axios
    .post("http://localhost:8080/api/auth/refreshToken", { refreshToken })
    .then((res) => {
      const { accessToken, refreshToken } = res.data.metadata;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return accessToken;
    })
    .catch((error) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw error;
    });
}

// Xử lý lỗi response
apiClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    const config = err.config;
    if (![401, 422, 403].includes(err.response?.status)) {
      // Có thể xử lý lỗi khác nếu cần
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && config?.url !== "/auth/refreshToken") {
      console.log("error", err);
      // Nếu token hết hạn
      // if (!refreshTokenPromise) {
      refreshTokenFlat = refreshTokenFlat
        ? refreshTokenFlat
        : handleRefreshToken().finally(() => {
            // phải set lại null để ko gây lặp vô hạn khi access token lần t2 bị stale
            setTimeout(() => {
              refreshTokenFlat = null;
            }, 10000);
          });
      console.log("ErrorUnAth", err);
      console.log("refreshTokenFlat", refreshTokenFlat);

      return refreshTokenFlat.then((res) => {
        console.log("response taij daay", res);
        //phải return để trả về được data sau khi gửi accessTK mới lên headers
        return apiClient({
          ...config,
          headers: { ...config?.headers, authorization: res },
        });
      });

      // const newToken = await refreshTokenPromise;
      // config.headers["Authorization"] = `Bearer ${newToken}`; // Cập nhật lại header với token mới
      // return apiClient(config); // Gửi lại request
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return Promise.reject(err);
  }
);

export default apiClient;
