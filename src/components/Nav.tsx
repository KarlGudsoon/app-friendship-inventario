import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { activarNotificaciones } from "../utils/pushNotifications";

export default function Nav() {
  const navigate = useNavigate();
  const { session } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }
  return (
    <nav className="flex items-center gap-6 px-6 py-4 bg-amber-300 shadow-sm">
      <span className="font-bold text-lg">🍔 Inventario</span>
      <div className="flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-black font-semibold"
              : "text-gray-700 hover:text-black"
          }
        >
          Inicio
        </NavLink>
        <NavLink
          to="/inventario"
          className={({ isActive }) =>
            isActive
              ? "text-black font-semibold"
              : "text-gray-700 hover:text-black"
          }
        >
          Inventario
        </NavLink>

        {session && (
          <button
            onClick={() => activarNotificaciones(session.user.id)}
            className="text-sm text-gray-700 hover:text-black border px-3 py-1 rounded"
          >
            Activar notificaciones
          </button>
        )}

        {session && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-700 hover:text-black border px-3 py-1 rounded"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
