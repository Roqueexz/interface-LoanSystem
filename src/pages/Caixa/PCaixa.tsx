import type { JSX } from "react";
import Layout from "../../components/Layout/Layout";
import ResumoCaixa from "../../components/Caixa/ResumoCaixa/ResumoCaixa";

function PCaixa(): JSX.Element {
  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <ResumoCaixa />
      </div>
    </Layout>
  );
}

export default PCaixa;