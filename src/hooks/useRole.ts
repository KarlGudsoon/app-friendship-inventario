import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'

export function useRole() {
  const { session } = useAuth()
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      setRole(null)
      setLoading(false)
      return
    }

    supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error)
        setRole(data?.role ?? null)
        setLoading(false)
      })
  }, [session])

  return { role, loading }
}