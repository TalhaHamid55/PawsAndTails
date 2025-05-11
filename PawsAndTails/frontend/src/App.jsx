import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Home from "./pages/Home";
import MainHeader from "./components/MainHeader";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <>
      <Layout>
        <Header>
          <MainHeader />
        </Header>
        <Content style={{ padding: "50px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>PetShop ©2025</Footer>
      </Layout>
    </>
  );
}

export default App;
