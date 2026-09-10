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
    isActive
      ? "text-black text-xl font-medium relative transition-all font-[Roadstore] before:absolute before:left-0 before:bottom-0 before:h-0.5 before:scale-y-0 before:w-full before:bg-black before:origin-left before:transition-all before:scale-y-100"
      : "text-black text-xl font-medium font-[Roadstore]";

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
              className="text-xl p-2 text-gray-700 transition hover:scale-105 rounded-full bg-primary shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M0 0h512v512H0z" fill="none" />
                <path
                  fill="#000"
                  d="M440.08 341.31c-1.66-2-3.29-4-4.89-5.93c-22-26.61-35.31-42.67-35.31-118c0-39-9.33-71-27.72-95c-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 0 1-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.1 3.1 0 0 1-.81.65c-56.38 23.21-83.78 67.74-83.78 136.14c0 75.36-13.29 91.42-35.31 118c-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 0 0-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H410.5c14.94 0 28-8.06 34.19-21a35.17 35.17 0 0 0-4.61-37.66M256 480a80.06 80.06 0 0 0 70.44-42.13a4 4 0 0 0-3.54-5.87H189.12a4 4 0 0 0-3.55 5.87A80.06 80.06 0 0 0 256 480"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M0 0h512v512H0z" fill="none" />
                <path
                  fill="#000"
                  d="M440.08 341.31c-1.66-2-3.29-4-4.89-5.93c-22-26.61-35.31-42.67-35.31-118c0-39-9.33-71-27.72-95c-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 0 1-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.1 3.1 0 0 1-.81.65c-56.38 23.21-83.78 67.74-83.78 136.14c0 75.36-13.29 91.42-35.31 118c-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 0 0-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H410.5c14.94 0 28-8.06 34.19-21a35.17 35.17 0 0 0-4.61-37.66M256 480a80.06 80.06 0 0 0 70.44-42.13a4 4 0 0 0-3.54-5.87H189.12a4 4 0 0 0-3.55 5.87A80.06 80.06 0 0 0 256 480"
                />
              </svg>
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
