import { ClipboardList } from "lucide-react";
import EmptyState from "../../../ui/EmptyState";
import type { MovimentacaoCaixaPessoalDTO } from "../../../interface/CaixaPessoalDTO";

interface ListaHistoricoProps {
  movimentacoes: MovimentacaoCaixaPessoalDTO[];
}

// ============================================================
// ListaHistorico — histórico de movimentações do caixa pessoal
// Sprint 1: sempre renderiza EmptyState (sem dados ainda).
// Sprint 3: renderizará a lista real com filtros por
//           categoria, tipo e data.
// A estrutura já nasce preparada para receber dados.
// ============================================================

function ListaHistorico({ movimentacoes }: ListaHistoricoProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Histórico de Movimentações
          </h3>
        </div>
        {movimentacoes.length > 0 && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
            {movimentacoes.length} registro(s)
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="px-6">
        {movimentacoes.length === 0 ? (
          <EmptyState
            mensagem="Nenhuma movimentação registrada."
            descricao="As entradas e saídas do seu caixa pessoal aparecerão aqui."
            icone={<ClipboardList size={26} className="text-muted-foreground/50" />}
          />
        ) : (
          // Sprint 3: lista real de movimentações
          <div className="space-y-3 py-4">
            {movimentacoes.map((mov) => (
              <div
                key={mov.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border"
              >
                <span className="text-sm text-foreground">{mov.descricao}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default ListaHistorico;