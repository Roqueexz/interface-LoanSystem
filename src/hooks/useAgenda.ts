import { useEffect, useState } from 'react';
import { BaseRequests } from '../fetch/BaseRequests';

export interface ParcelaAgenda { id_parcela: number; id_emprestimo: number; id_cliente: number; nome: string; sobrenome: string; numero_parcela: number; valor: number; vencimento: string }
class AgendaRequests extends BaseRequests { listar() { return this.request<ParcelaAgenda[]>('/api/agenda/parcelas'); } }
const api = new AgendaRequests();
export function useAgenda() {
  const [parcelas, setParcelas] = useState<ParcelaAgenda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useEffect(() => {
    let ativo = true;
    void api.listar().then(res => { if (!ativo) return; if (res.sucesso) setParcelas(res.dados || []); else setErro(res.erro || 'Não foi possível carregar os recebimentos.'); setCarregando(false); });
    return () => { ativo = false; };
  }, []);
  return { parcelas, carregando, erro };
}
export function dataLocal(data = new Date()) { return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`; }
export function moeda(valor: number) { return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
