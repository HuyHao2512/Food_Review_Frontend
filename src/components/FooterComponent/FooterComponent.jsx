import React from "react";
import "./Footer.css";
function FooterComponent() {
  return (
    <div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>
              Chúng tôi mang đến những đánh giá chân thực và hữu ích cho bạn!
            </p>
          </div>
          <div className="footer-copy">
            <p>&copy; Bản quyền thuộc về Gia Huy & Huy Hào</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FooterComponent;
