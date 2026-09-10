import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface Producto {
  id: number;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
}

export default function Inventario() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) console.error(error);
    else setProductos(data as Producto[]);
    setLoading(false);
  }

  function actualizarStockLocal(id: number, nuevoStock: number) {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock_actual: nuevoStock } : p)),
    );
  }

  async function actualizarStock(id: number, nuevoStock: number) {
    // Actualiza local primero (UI instantánea)
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock_actual: nuevoStock } : p)),
    );

    const { error } = await supabase
      .from("productos")
      .update({ stock_actual: nuevoStock })
      .eq("id", id);

    if (error) console.error("Error actualizando stock:", error);
  }

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6 flex-1 min-h-0 overflow-hidden flex flex-col text-white">
      {/* <div className="mb-4 bg-amber-300 text-black p-4 rounded-2xl shadow-md shadow-black/25">
        <h1 className="text-xl font-bold">Inventario cocina</h1>
      </div> */}

      <div className="flex-1 min-h-0 overflow-auto rounded-2xl shadow-md shadow-black/25">
        <table className="w-full border-separate border-spacing-0 bg-[#1d1d1d] rounded-2xl">
          <thead>
            <tr className="text-black text-left">
              <th className="py-2 px-3 sticky top-0 z-10 bg-amber-300 border-b">
                Producto
              </th>
              <th className="py-2 px-3 sticky top-0 z-10 bg-amber-300 border-b">
                Stock actual
              </th>
              <th className="py-2 px-3 sticky top-0 z-10 bg-amber-300 border-b">
                Stock mínimo
              </th>
              <th className="py-2 px-3 sticky top-0 z-10 bg-amber-300 border-b">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const stockBajo = producto.stock_actual < producto.stock_minimo;

              return (
                <tr key={producto.id} className="">
                  <td className="py-2 px-3 border-b border-amber-300/10">
                    {producto.nombre}
                  </td>
                  <td className="py-2 px-3 border-b border-amber-300/10">
                    <button
                      type="button"
                      onClick={() =>
                        actualizarStock(producto.id, producto.stock_actual - 1)
                      }
                      className="size-6  bg-amber-300 text-black shadow shadow-black/20 rounded-2xl mr-4"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id={`stock-${producto.id}`}
                      onChange={(e) =>
                        actualizarStockLocal(
                          producto.id,
                          Number(e.target.value),
                        )
                      }
                      onBlur={(e) =>
                        actualizarStock(producto.id, Number(e.target.value))
                      }
                      className="border border-amber-300/10 text-center rounded-xl px-2 py-1 w-20 m-auto inset-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] bg-[#313131] text-white focus:outline-none focus:ring-2 focus:ring-amber-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={producto.stock_actual}
                    />
                    <button
                      className="size-6 bg-amber-300 text-black shadow shadow-black/20 rounded-2xl ml-4"
                      type="button"
                      onClick={() =>
                        actualizarStock(producto.id, producto.stock_actual + 1)
                      }
                    >
                      +
                    </button>
                  </td>
                  <td className="py-2 px-3 border-b border-amber-300/10">
                    {producto.stock_minimo}
                  </td>
                  <td className="py-2 px-3 border-b border-amber-300/10">
                    {stockBajo ? (
                      <span className="text-red-600 font-semibold">
                        ⚠ Stock bajo
                      </span>
                    ) : (
                      <span className="text-green-700 bg-green-700/50 rounded-2xl px-4 py-1 font-semibold">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
