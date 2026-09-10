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

  if (loading)
    return (
      <div className="md:p-6 flex-1 min-h-0 overflow-hidden flex flex-col text-white">
        <div className="flex-1 h-full w-full overflow-auto bg-secondary md:rounded-2xl shadow-md shadow-black/25"></div>
      </div>
    );

  return (
    <div className="md:p-6 flex-1 min-h-0 overflow-hidden flex flex-col text-white">
      {/* <div className="mb-4 bg-amber-300 text-black p-4 rounded-2xl shadow-md shadow-black/25">
        <h1 className="text-xl font-bold">Inventario cocina</h1>
      </div> */}

      <div className="flex-1 min-h-0 h-full bg-secondary overflow-auto md:rounded-2xl shadow-md shadow-black/25">
        <table className="w-full border-separate border-spacing-0 bg-secondary md:rounded-2xl">
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
          <tbody>
            {productos.map((producto) => {
              return (
                <tr key={producto.id} className="">
                  <td className="py-2 px-3 border-b border-amber-300/10">
                    {producto.nombre}
                  </td>
                  <td className="py-2 px-3 border-b border-amber-300/10">
                    {producto.stock_actual === 0 ? (
                      <div className="w-fit text-red-700 bg-red-700/50 rounded-2xl px-4 py-1 font-semibold">
                        Sin stock
                      </div>
                    ) : producto.stock_actual <= producto.stock_minimo ? (
                      <div className="w-fit text-amber-700 bg-amber-700/50 rounded-2xl px-4 py-1 font-semibold">
                        ⚠️
                      </div>
                    ) : (
                      <div className="w-fit text-green-700 bg-green-700/50 rounded-2xl px-4 py-1 font-semibold">
                        OK
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 border-b border-amber-300/10">
                    <div className="flex w-fit">
                      <button
                        type="button"
                        onClick={() =>
                          actualizarStock(
                            producto.id,
                            producto.stock_actual - 1,
                          )
                        }
                        className="size-6 block bg-primary text-black shadow shadow-black/20 rounded-2xl mr-4"
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
                        className="size-6 block bg-primary text-black shadow shadow-black/20 rounded-2xl ml-4"
                        type="button"
                        onClick={() =>
                          actualizarStock(
                            producto.id,
                            producto.stock_actual + 1,
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-3 border-b border-amber-300/10">
                    {producto.stock_minimo}
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
