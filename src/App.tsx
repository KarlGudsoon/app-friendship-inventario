import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import Login from "./pages/Login";
import "./App.css";
import { useAuth } from "./context/AuthContext";

function App() {
  const { session } = useAuth();
  return (
    <>
      {session && <Nav />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventario"
          element={
            <ProtectedRoute>
              <Inventario />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
