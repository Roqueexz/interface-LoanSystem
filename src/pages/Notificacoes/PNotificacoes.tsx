import type { JSX } from 'react';
import Layout from '../../components/Layout/Layout';
import CentralNotificacoes from '../../components/Notificacoes/CentralNotificacoes';

function PNotificacoes(): JSX.Element {
  return (
    <Layout>
      <CentralNotificacoes />
    </Layout>
  );
}

export default PNotificacoes;
