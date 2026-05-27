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
import SistemaCompleto from "./pages/SistemaCompleto.tsx";

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
        <Route path="/sistema" element={<SistemaCompleto />} />
      </Routes>
    </Layout>
  );
}
