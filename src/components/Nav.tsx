import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { activarNotificaciones } from "../utils/pushNotifications";

export default function Nav() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
    setMenuAbierto(false);
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-black font-semibold" : "text-gray-700 hover:text-black";

  return (
    <nav className="bg-amber-300 shadow-sm relative">
      <div className="flex items-center justify-between px-6 py-4">
        <img src="/img/logo-black.webp" alt="Logo" className="h-10 w-10" />

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={linkClass}>
            Inicio
          </NavLink>
          <NavLink to="/inventario" className={linkClass}>
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

        {/* Botón hamburguesa mobile */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          {menuAbierto ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu desplegable mobile */}
      {menuAbierto && (
        <div className="md:hidden flex flex-col gap-3 px-6 pb-4 bg-amber-300">
          <NavLink
            to="/"
            className={linkClass}
            onClick={() => setMenuAbierto(false)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/inventario"
            className={linkClass}
            onClick={() => setMenuAbierto(false)}
          >
            Inventario
          </NavLink>

          {session && (
            <button
              onClick={() => {
                activarNotificaciones(session.user.id);
                setMenuAbierto(false);
              }}
              className="text-sm text-gray-700 hover:text-black border px-3 py-1 rounded text-left"
            >
              Activar notificaciones
            </button>
          )}

          {session && (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-700 hover:text-black border px-3 py-1 rounded text-left"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
