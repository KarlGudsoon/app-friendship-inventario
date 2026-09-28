import { useRole } from '../hooks/useRole'
import HomeAdmin from "../components/home/HomeAdmin";
import HomeEmpleado from "../components/home/HomeEmpleado";

export default function Home() {
  const { role } = useRole();

  return (
    <div className="flex text-white  flex-col gap-4 items-center p-6 mx-w-[1200px]">
      <h1 className="text-6xl text-primary font-[Roadstore] mt-8 mb-4 font-black">
        BIENVENIDO A FRIENDSHIP APP
      </h1>
      {role === 'admin' && (<HomeAdmin />)}

      {role === 'empleado' && (<HomeEmpleado />)}

      
    </div>
  );
}
