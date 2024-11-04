import React from "react";
import { Drawer, Button, List, Space, Rate, Input } from "antd";
const { TextArea } = Input;
const DrawerPosition = ({
  food,
  open,
  placement,
  onClose,
  comment,
  onCommentChange,
  onSubmitComment,
  comments,
  onDirectionClick,
}) => {
  return (
    <Drawer
      title={food?.name}
      placement={placement}
      closable={false}
      onClose={onClose}
      open={open}
      key={placement}
    >
      <img src={food.images} className="img-des" alt="Food" />
      <br />
      <br />
      <p>
        Đánh giá: <Rate allowHalf disabled value={food.rate} />
      </p>
      <p>Địa chỉ: {food.address}</p>
      <p>Giờ mở chưa: {food.open}</p>
      <p>Giờ đóng cửa: {food.close}</p>
      <p>Số điện thoại: {food.phone}</p>
      <p>Ưu điểm: {food.advantage}</p>
      <p>Hạn chế: {food.disadvantage}</p>
      <hr />
      <h3>Thêm bình luận</h3>
      <TextArea
        value={comment}
        onChange={onCommentChange}
        placeholder="Nhập bình luận..."
        rows={4}
      />
      <br />
      <Rate />
      <br />
      <Button
        onClick={onSubmitComment}
        type="primary"
        style={{ marginTop: "10px" }}
      >
        Gửi bình luận
      </Button>
      &nbsp;&nbsp;&nbsp;
      <Button onClick={onDirectionClick}>Đường đi đến quán</Button>
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
  );
};

export default DrawerPosition;
