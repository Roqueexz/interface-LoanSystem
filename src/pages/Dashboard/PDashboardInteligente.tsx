import type { JSX } from "react";
import Layout from "../../components/Layout/Layout";
import DashboardInteligente from "../../components/Dashboard/DashboardInteligente";

function PDashboardInteligente(): JSX.Element {
    return (
        <Layout>
            <DashboardInteligente />
        </Layout>
    );
}

export default PDashboardInteligente;