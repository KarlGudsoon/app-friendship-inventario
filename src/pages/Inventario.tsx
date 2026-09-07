import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

interface Producto {
  id: number
  nombre: string
  stock_actual: number
  stock_minimo: number
}

export default function Inventario() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])



  async function fetchData() {
    setLoading(true)
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) console.error(error)
    else setProductos(data as Producto[])
    setLoading(false)
  }

  if (loading) return <p className="p-6">Cargando...</p>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Inventario</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 px-3">Producto</th>
            <th className="py-2 px-3">Stock actual</th>
            <th className="py-2 px-3">Stock mínimo</th>
            <th className="py-2 px-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const stockBajo = producto.stock_actual < producto.stock_minimo

            return (
              <tr key={producto.id} className="border-b">
                <td className="py-2 px-3">{producto.nombre}</td>
                <input type="number" onBlur={(e) => actualizarStock(producto.id, Number(e.target.value))} className="border rounded px-2 py-1 w-20" defaultValue={producto.stock_actual} />
                <td className="py-2 px-3">{producto.stock_minimo}</td>
                <td className="py-2 px-3">
                  {stockBajo ? (
                    <span className="text-red-600 font-semibold">⚠ Stock bajo</span>
                  ) : (
                    <span className="text-green-600">OK</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

async function actualizarStock(id: number, nuevoStock: number) {
    const { error } = await supabase
    .from('productos')
    .update({ stock_actual : nuevoStock })
    .eq('id', id)

    if (error) {
        console.error('Error actualizando stock:', error)
    }
}