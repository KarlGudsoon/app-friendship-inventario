import InfoCard from '../InfoCard'
import { NavLink } from 'react-router-dom'

export default function HomeEmpleado() {
  return (
    <>
      <p>
        Esta aplicación está diseñada para ayudar a los empleados de
        Friendship Burgers a gestionar el inventario de la cocina de manera
        eficiente y sencilla.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <InfoCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="none" stroke="#f0c807" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20v-8h16v8Zm8 -8v8m-4 -8V4h8v8" />
            </svg>
          }
          title="Inventario"
          description="Administra el inventario de la cocina, controlando los niveles de stock y realizando ajustes necesarios."
        />
        <InfoCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 1024 1024">
              <path d="M0 0h1024v1024H0z" fill="none" />
              <path fill="#f0c807" d="M880 112c-3.8 0-7.7.7-11.6 2.3L292 345.9H128c-8.8 0-16 7.4-16 16.6v299c0 9.2 7.2 16.6 16 16.6h101.6c-3.7 11.6-5.6 23.9-5.6 36.4c0 65.9 53.8 119.5 120 119.5c55.4 0 102.1-37.6 115.9-88.4l408.6 164.2c3.9 1.5 7.8 2.3 11.6 2.3c16.9 0 32-14.2 32-33.2V145.2C912 126.2 897 112 880 112M344 762.3c-26.5 0-48-21.4-48-47.8c0-11.2 3.9-21.9 11-30.4l84.9 34.1c-2 24.6-22.7 44.1-47.9 44.1" />
            </svg>
          }
          title="Notificaciones"
          description="Recibe y envía notificaciones sobre actualizaciones del inventario a los demás integrantes del equipo."
        />
      </div>
      <div className="flex gap-4 items-center mt-4">
        <NavLink
          to="/inventario"
          className="bg-primary text-black font-bold hover:brightness-90 transition-colors py-2 px-4 rounded"
        >
          Ir al Inventario
        </NavLink>
      </div>
    </>
  )
}