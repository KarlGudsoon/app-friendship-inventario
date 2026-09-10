import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex h-full text-white flex-col gap-4 items-center p-6 mx-w-[1200px]">
      <h1 className="text-6xl text-primary font-[Roadstore] mt-8 mb-4 font-black">
        BIENVENIDOS A FRIENDSHIP BURGERS APP
      </h1>
      <p>
        Esta aplicación está diseñada para ayudar a los empleados de Friendship
        Burgers a gestionar el inventario de la cocina de manera eficiente y
        sencilla.
      </p>
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
