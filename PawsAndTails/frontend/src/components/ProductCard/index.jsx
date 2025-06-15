import { Image, Button, Rate, Modal, Flex } from "antd";
import { loadImageFromServer } from "../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cartSlice";
import { useState } from "react";

const ProductCard = (props) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const { image, name, price, rating, _id, description } = props;

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: _id,
        name,
        price,
        quantity: 1,
        rating,
        image,
      })
    );
  };

  return (
    <>
      <div className="product-card">
        <div>
          <Image src={loadImageFromServer(image)} alt={name} />
          <h4>{name}</h4>
          <p>Rs. {price || 0}</p>
          <Rate
            allowHalf
            defaultValue={rating}
            style={{ marginBottom: "12px", pointerEvents: "none" }}
          />
        </div>
        <Flex gap={8}>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => setViewModalOpen(true)}
            style={{ width: "100px" }}
          >
            View Details
          </Button>
          <Button
            variant="solid"
            style={{ width: "100px" }}
            color="primary"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Flex>
      </div>
      <Modal
        title={name}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={<></>}
      >
        <p>{description}</p>
      </Modal>
    </>
  );
};

export default ProductCard;
