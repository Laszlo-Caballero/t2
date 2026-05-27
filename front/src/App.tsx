import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import ParteB from "./pages/ParteB";
import { ParteC } from "./pages/ParteC";
import ParteD from "./pages/ParteD";
import { ParteE } from "./pages/ParteE";
import { ParteF } from "./pages/ParteF";
import { ParteG } from "./pages/ParteG";
import { ParteH } from "./pages/ParteH";
import { ParteI } from "./pages/ParteI";
import { ParteJ } from "./pages/ParteJ";
import { ParteK } from "./pages/ParteK";

function DemoPage({ name }: { name: string }) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-slate-900/20 rounded-2xl border border-slate-800/50 backdrop-blur-sm max-w-2xl mx-auto my-auto shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
        {name}
      </h2>
      <p className="text-slate-400 text-sm max-w-md">
        Este es el módulo correspondiente a la {name}. Aquí puedes visualizar y
        gestionar todos los parámetros y variables del sistema en tiempo real.
      </p>

      {/* Decorative dashboard card mockup */}
      <div className="mt-8 grid grid-cols-2 gap-4 w-full text-left">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-xs text-slate-500 block mb-1">
            Estado de Conexión
          </span>
          <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Conectado
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-xs text-slate-500 block mb-1">Rendimiento</span>
          <span className="text-sm font-semibold text-indigo-400">98.4%</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parte-b" element={<ParteB />} />
        <Route path="/parte-c" element={<ParteC />} />
        <Route path="/parte-d" element={<ParteD />} />
        <Route path="/parte-e" element={<ParteE />} />
        <Route path="/parte-f" element={<ParteF />} />
        <Route path="/parte-g" element={<ParteG />} />
        <Route path="/parte-h" element={<ParteH />} />
        <Route path="/parte-i" element={<ParteI />} />
        <Route path="/parte-j" element={<ParteJ />} />
        <Route path="/parte-k" element={<ParteK />} />
        <Route
          path="/sistema"
          element={<DemoPage name="Sistema Completo - Panel de Control" />}
        />
      </Routes>
    </Layout>
  );
}
