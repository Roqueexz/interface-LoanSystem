import type { JSX } from "react";
import Layout from "../../components/Layout/Layout";
import Calendario from "../../components/Calendario/Calendario";

function PCalendario(): JSX.Element {
    return (
        <Layout>
            <Calendario />
        </Layout>
    );
}

export default PCalendario;