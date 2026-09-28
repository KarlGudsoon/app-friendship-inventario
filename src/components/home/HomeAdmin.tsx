import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

interface Producto {
    id: number;
    nombre: string;
    stock_actual: number;
    stock_minimo: number;
}

export default function HomeAdmin() {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const fetchProductos = async () => {
            const { data, error } = await supabase
                .from("productos")
                .select("*");

            if (error) {
                console.error("Error fetching productos:", error);
            } else {
                setProductos(data);
            }
        };

        fetchProductos();
    }, []);

  return (
    <>
    <p className="text-white text-center text-lg max-w-3xl">
    Esta aplicación está diseñada para ayudar a los administradores de
    Friendship Burgers a gestionar el inventario de la cocina de manera
    eficiente y sencilla.
    </p>
    <div className="bg-primary text-black outline outline-white/25 flex flex-col w-full max-w-150 h-72 rounded-xl">
        <div className="border-b">
            <h2 className="text-xl font-bold my-2 font-[Roadstore] text-center">Hay que reponer ⚠</h2>
        </div>
        <div className="flex-1 min-h-0 bg-secondary overflow-auto shadow-md shadow-black/25">
            <table className="w-full border-separate border-spacing-0 bg-secondary">
            <thead>
                <tr className="text-black font-[Roadstore] text-left">
                <th className="py-2 px-3 sticky top-0 z-10 bg-primary border-b">
                    Producto
                </th>
                <th className="py-2 px-3 sticky top-0 z-10 bg-primary border-b">
                    Estado
                </th>
                <th className="py-2 px-3 sticky top-0 z-10 bg-primary border-b">
                    Stock actual
                </th>
                <th className="py-2 px-3 sticky top-0 z-10 bg-primary border-b">
                    Stock mínimo
                </th>
                </tr>
            </thead>
            <tbody className="text-white ">
                {productos.map((producto) => (
                    producto.stock_actual < producto.stock_minimo && (
                <tr key={producto.id}>
                    <td className="py-2 px-3 border-b border-amber-300/10">{producto.nombre}</td>
                    <td className="py-2 px-3 border-b border-amber-300/10">
                    {producto.stock_actual < producto.stock_minimo ? (
                        <span className="text-amber-500 font-bold">Reponer</span>
                    ) : (
                        "En stock"
                    )}
                    </td>
                    <td className="py-2 px-3 border-b border-amber-300/10">{producto.stock_actual}</td>
                    <td className="py-2 px-3 border-b border-amber-300/10">{producto.stock_minimo}</td>
                </tr>
                )))}
            </tbody>
            </table>
        </div>    
      </div>
    </>
  )
}