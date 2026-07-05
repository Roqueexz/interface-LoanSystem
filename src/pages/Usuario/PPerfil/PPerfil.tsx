import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import PerfilUsuario from "../../../components/Usuario/PerfilUsuario/PerfilUsuario";

function PPerfil(): JSX.Element {
  return (
    <Layout>
      <PerfilUsuario />
    </Layout>
  );
}

export default PPerfil;