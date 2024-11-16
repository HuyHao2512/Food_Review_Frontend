import React from "react";
import { Drawer, Button, Rate, Input } from "antd";
import { useState, useEffect } from "react";
import Comment from "./Comment";
import CommentList from "./CommentList";
const { TextArea } = Input;
const DrawerPosition = ({
  food,
  open,
  placement,
  onClose,
  onDirectionClick,
}) => {
  const [idComment, setIdComment] = useState("");
  const [fetchComments, setFetchComments] = useState(() => () => {});

  useEffect(() => {
    if (food?.id) {
      setIdComment(food.id);
    }
  }, [food]);

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
      <Button onClick={onDirectionClick}>Đường đi đến quán</Button>
      <br />
      <br />
      <p>Giờ mở cửa: {food.open}</p>
      <p>Giờ đóng cửa: {food.close}</p>
      <p>Số điện thoại: {food.phone}</p>
      <p>Ưu điểm: {food.advantage}</p>
      <p>Hạn chế: {food.disadvantage}</p>
      <hr />
      {/* Nội dung chi tiết */}
      <Comment idComment={idComment} onCommentAdded={fetchComments} />
      <CommentList positionId={idComment} setFetchComments={setFetchComments} />
    </Drawer>
  );
};

// const DrawerPosition = ({
//   food,
//   open,
//   placement,
//   onClose,
//   onDirectionClick,
// }) => {
//   const [idComment, setIdComment] = useState("");
//   useEffect(() => {
//     if (food?.id) {
//       setIdComment(food.id);
//     }
//   }, [food]);

//   return (
//     <Drawer
//       title={food?.name}
//       placement={placement}
//       closable={false}
//       onClose={onClose}
//       open={open}
//       key={placement}
//     >
//       <img src={food.images} className="img-des" alt="Food" />
//       <br />
//       <br />
//       <p>
//         Đánh giá: <Rate allowHalf disabled value={food.rate} />
//       </p>
//       <p>Địa chỉ: {food.address}</p>
//       <Button onClick={onDirectionClick}>Đường đi đến quán</Button>
//       <br />
//       <br />
//       <p>Giờ mở cửa: {food.open}</p>
//       <p>Giờ đóng cửa: {food.close}</p>
//       <p>Số điện thoại: {food.phone}</p>
//       <p>Ưu điểm: {food.advantage}</p>
//       <p>Hạn chế: {food.disadvantage}</p>
//       <hr />
//       <Comment idComment={idComment} />
//       <CommentList positionId={idComment} /> {/* Add CommentList here */}
//     </Drawer>
//   );
// };

export default DrawerPosition;
