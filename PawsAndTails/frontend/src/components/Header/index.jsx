import { NavLink as Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import userIcon from "../../assets/sample-images/user.png";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Flex, Space } from "antd";
import { DownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { logout } from "../../features/authSlice";

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log({ user });
  const items = [
    {
      label: <Link to="/dashboard">Dashboard</Link>,
      key: "0",
    },
    {
      label: <Link to="/dashboard/profile">Profile</Link>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <p
          role="button"
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
        >
          Logout
        </p>
      ),
      key: "3",
    },
  ];

  return (
    <header>
      <Link to="/">
        <img src={Logo} alt="Paws & Tails Logo" className="logo" />
      </Link>
      <nav>
        <ul>
          <li>
            <Link
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/adoption"
            >
              Adoption
            </Link>
          </li>
          <li>
            <Link
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/marketplace"
            >
              Marketplace
            </Link>
          </li>
          <li>
            <Link
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/veterinary"
            >
              Veterinary
            </Link>
          </li>
          <li>
            <Link
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/grooming"
            >
              Grooming
            </Link>
          </li>
          <li>
            <Link
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/ai-breed-detection"
            >
              AI Detector
            </Link>
          </li>
        </ul>
      </nav>
      {!isAuthenticated && (
        <div className="auth-buttons">
          <Link to="/register">Sign up</Link>
          <Link to="/login">Log in</Link>
        </div>
      )}
      <Flex gap={24} align="center">
        <Link to="/cart">
          <ShoppingCartOutlined style={{ fontSize: "32px", color: "#000" }} />
        </Link>
        {isAuthenticated && (
          <Dropdown menu={{ items }}>
            <Space>
              <img src={userIcon} alt="User Icon" height="28" />
              <DownOutlined />
            </Space>
          </Dropdown>
        )}
      </Flex>
    </header>
  );
};

export default Header;
