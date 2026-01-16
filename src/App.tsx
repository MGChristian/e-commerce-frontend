import "@mantine/core/styles.css";
import { Routes, Route } from "react-router";
import { MantineProvider } from "@mantine/core";
import UserProvider from "./contexts/UserProvider";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";

function App() {
  return (
    <MantineProvider>
      <UserProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </UserProvider>
    </MantineProvider>
  );
}

export default App;
