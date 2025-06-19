import { Button, Flex, Form, Input, InputNumber, Row } from "antd";
import "./styles/cart.css";
import ProductCartCard from "../components/ProductCartCard";
import { useDispatch, useSelector } from "react-redux";
import { useAddOrderMutation } from "../apis/orders";
import { toast } from "react-toastify";
import { clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

const TAX = 70;
const SHIPPINGCHARGES = 200;

const Cart = () => {
  const [form] = Form.useForm();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const [placeOrder] = useAddOrderMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subTotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subTotalPrice + TAX + SHIPPINGCHARGES;

  const onSubmit = async (values) => {
    const items = cartItems.map((k) => ({
      productId: k.productId,
      quantity: k.quantity,
    }));

    const res = await placeOrder({
      userId: user.id,
      items,
      totalAmount: total,
      status: "pending",
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address,
      city: values.city,
      state: values.state,
      phoneNumber: values.phoneNumber,
      zipCode: values.zipCode,
    }).unwrap();

    if (res) {
      toast.success("Order Placed Successfully.");
      dispatch(clearCart());
      navigate("/dashboard/orders");
    }
  };

  return (
    <div className="cart-page-container">
      <div className="products-list">
        <h3>Products</h3>
        <div className="products-list-container">
          {cartItems.length === 0 ? (
            <div className="empty-state">No Product In Your Cart.</div>
          ) : (
            cartItems.map((cart) => (
              <ProductCartCard key={cart.productId} {...cart} />
            ))
          )}
        </div>
      </div>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <Flex vertical>
          <Flex justify="space-between">
            <p>Subtotal</p>
            <p>Rs.{subTotalPrice}</p>
          </Flex>
          <Flex justify="space-between">
            <p>Estimated Shipping & Handling</p>
            <p>Rs.{SHIPPINGCHARGES}</p>
          </Flex>
          <Flex justify="space-between">
            <p>Estimated Tax</p>
            <p>Rs.{TAX}</p>
          </Flex>
          <hr />
          <br />
          <Flex justify="space-between">
            <p>Total</p>
            <p>Rs.{total}</p>
          </Flex>
          <hr />
        </Flex>

        <br />
        <Form
          form={form}
          autoComplete="off"
          onFinish={onSubmit}
          layout="vertical"
        >
          <Flex gap={24}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please Input your First Name!",
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please Input your Last Name!",
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </Flex>
          <Flex gap={24}>
            <Form.Item
              label="State"
              name="state"
              rules={[
                {
                  required: true,
                  message: "Please Input State!",
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message: "Please Input City!",
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </Flex>
          <Flex gap={12}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please Input Phone Number!",
                },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                minLength={11}
                maxLength={11}
                addonBefore="+92"
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
            <Form.Item
              label="Zip Code"
              name="zipCode"
              rules={[
                {
                  required: true,
                  message: "Please Input ZipCode!",
                },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                maxLength={6}
                style={{ width: "100%" }}
                controls={false}
              />
            </Form.Item>
          </Flex>
          <Form.Item
            label="Shipping Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please Input your shipping address!",
              },
            ]}
            extra="Your order will be delivered within 7 to 10 working days."
          >
            <Input.TextArea />
          </Form.Item>
          <p>
            You can also pay online. Pay on our easypaisa and Jazzcash
            0327-3391289
          </p>

          <Form.Item label={null}>
            <Button
              type="primary"
              variant="solid"
              htmlType="submit"
              block
              disabled={cartItems.length === 0}
            >
              Checkout
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Cart;
