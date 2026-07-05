import type { JSX } from "react";

import Layout from "../../components/Layout/Layout";
import DashboardCaixa from "../../components/Caixa/DashboardCaixa/DashboardCaixa";

function PCaixa(): JSX.Element {
  return (
    <Layout>
      <DashboardCaixa />
    </Layout>
  );
}

export default PCaixa;