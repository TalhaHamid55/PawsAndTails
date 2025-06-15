import { Image, Button, Rate, InputNumber } from "antd";
import { loadImageFromServer } from "../../utils/common";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../features/cartSlice";
import { toast } from "react-toastify";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const ProductCartCard = (props) => {
  const { image, name, price, rating, productId, quantity } = props;
  const dispatch = useDispatch();

  const removeProductFromCart = () => {
    dispatch(removeFromCart(productId));
    toast(`${name} is removed to Cart`, {
      autoClose: 5000,
    });
  };

  const onChange = (value) => {
    dispatch(
      updateQuantity({
        productId,
        quantity: value,
      })
    );
    toast.success(`${name} Quantity Update`, {
      autoClose: 5000,
    });
  };

  return (
    <div className="cart-card">
      <div className="cart-card-content">
        <Image src={loadImageFromServer(image)} alt={name} height={100} />
        <div>
          <h4>{name}</h4>
          <Rate
            allowHalf
            defaultValue={rating}
            style={{ marginBottom: "12px", pointerEvents: "none" }}
          />
          <InputNumber
            min={1}
            value={quantity}
            onChange={onChange}
            style={{ width: "150px" }}
            addonBefore={
              <PlusOutlined onClick={() => onChange(quantity + 1)} />
            }
            addonAfter={
              <MinusOutlined
                style={{
                  cursor: quantity === 1 ? "not-allowed" : "",
                }}
                onClick={() => {
                  if (quantity !== 1) onChange(quantity - 1);
                }}
              />
            }
          />
        </div>
      </div>
      <div className="cart-price-section">
        <p>Rs. {price || 0}</p>
        <Button variant="solid" color="danger" onClick={removeProductFromCart}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ProductCartCard;
