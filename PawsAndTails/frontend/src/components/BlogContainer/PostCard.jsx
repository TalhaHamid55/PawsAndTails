import { useState } from "react";
import { loadImageFromServer } from "../../utils/common";
import { Button, Modal } from "antd";

const PostCard = ({ image, title, content, _id }) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  return (
    <div className="story-card">
      <div>
        <img src={loadImageFromServer(image)} alt="Success Story" />
        <h4>{title}</h4>
        <p className="truncate">{content}</p>
      </div>
      <Button variant="solid" color="primary" href={`/single-post/${_id}`}>
        Read More
      </Button>
    </div>
  );
};

export default PostCard;
