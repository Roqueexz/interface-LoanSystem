import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import PerfilUsuario from "../../../components/Usuario/PerfilUsuario/PerfilUsuario";

function PPerfil(): JSX.Element {
  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <PerfilUsuario />
      </div>
    </Layout>
  );
}

export default PPerfil;