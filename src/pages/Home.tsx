import { NavLink } from "react-router-dom";
import { useRole } from '../hooks/useRole'

export default function Home() {
  const { role } = useRole();

  return (
    <div className="flex h-full text-white flex-col gap-4 items-center p-6 mx-w-[1200px]">
      <h1 className="text-6xl text-primary font-[Roadstore] mt-8 mb-4 font-black">
        BIENVENIDOS A FRIENDSHIP BURGERS APP
      </h1>
      {role === 'empleado' && (<p>
        Esta aplicación está diseñada para ayudar a los empleados de Friendship
        Burgers a gestionar el inventario de la cocina de manera eficiente y
        sencilla.
      </p>)}
      {role === 'admin' && (<p>
        Esta aplicación está diseñada para ayudar a los administradores de Friendship
        Burgers a gestionar el inventario de la cocina de manera eficiente y
        sencilla.
      </p>)}

      {role === 'empleado' && (
        // Using nearest standard scale values
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-primary flex p-4 items-center gap-4 text-black border w-full max-w-96 min-h-32 rounded-xl">
          <div className="flex size-16 rounded-full items-center shrink-0 justify-center bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="none" stroke="yellow" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20v-8h16v8Zm8 -8v8m-4 -8V4h8v8" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Inventario</h2>
            <p>Administra el inventario de la cocina, controlando los niveles de stock y realizando ajustes necesarios.</p>
          </div>
          
        </div>
        <div className="bg-primary text-black border w-full max-w-96 min-h-32 rounded-xl">
          <h2 className="text-xl font-bold mb-2">Notificaciones</h2>
          <p>Recibe notificaciones sobre actualizaciones del inventario y otros eventos importantes.</p>
        </div>
        
      </div>
      )}

      <div className="flex gap-4 items-center mt-4">
        <NavLink
          to="/inventario"
          className="bg-primary text-black font-bold hover:brightness-90 transition-colors py-2 px-4 rounded"
        >
          Ir al Inventario
        </NavLink>
      </div>
      <div></div>
    </div>
  );
}
