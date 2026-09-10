import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-[url('/img/fondo.svg')] bg-repeat bg-size-[300px,300px]">
      <form
        onSubmit={handleLogin}
        className="bg-primary text-black p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <img
          src="/img/logo-black.webp"
          alt="Logo"
          className="h-25 w-25 mx-auto mb-4"
        />
        <h1 className="text-xl font-bold mb-6 text-center font-[Roadstore]">
          Iniciar sesión
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black/15 border border-black/50 rounded-2xl px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-black/15 border border-black/50 rounded-2xl px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-secondary text-primary py-2 rounded-2xl hover:bg-[#171717] hover:cursor-pointer disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
