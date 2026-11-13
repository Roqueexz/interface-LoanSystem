import type { JSX } from "react";

import Layout from "../../components/Layout/Layout";
import CofreFisico from "../../components/Caixa/CofreFisico";

function PCaixa(): JSX.Element {
  return (
    <Layout>
      <CofreFisico />
    </Layout>
  );
}

export default PCaixa;
