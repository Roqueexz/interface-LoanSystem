import { useState } from "react";
import { Search, X, Check } from "lucide-react";
import Avatar from "../../components/shared/Avatar/Avatar";

export interface ModalSeletorItem {
  id: number | string;
  title: string;
  subtitle?: string;
  badge?: string;
  avatarInitials?: string;
  details?: string;
  originalObj: any;
}

export interface ModalSeletorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  items: ModalSeletorItem[];
  selectedId?: number | string;
  onSelect: (item: ModalSeletorItem) => void;
  emptyText?: string;
  icon?: React.ReactNode;
}

export default function ModalSeletor({
  isOpen,
  onClose,
  title,
  subtitle,
  searchPlaceholder = "Buscar...",
  items,
  selectedId,
  onSelect,
  emptyText = "Nenhum item encontrado.",
  icon,
}: ModalSeletorProps) {
  const [busca, setBusca] = useState("");

  if (!isOpen) return null;

  const itensFiltrados = items.filter((item) => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase();
    const titulo = item.title.toLowerCase();
    const sub = (item.subtitle || "").toLowerCase();
    const det = (item.details || "").toLowerCase();
    return titulo.includes(termo) || sub.includes(termo) || det.includes(termo);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-bold text-foreground text-base leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-border bg-card">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {itensFiltrados.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            itensFiltrados.map((item) => {
              const isSelected = selectedId !== undefined && String(selectedId) === String(item.id);

              return (
                <div
                  key={String(item.id)}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card border-border hover:bg-muted/50 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.avatarInitials ? (
                      <Avatar initials={item.avatarInitials} size="md" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-xs text-foreground shrink-0">
                        #{item.id}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground text-sm truncate">
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                      {item.details && (
                        <p className="text-[11px] text-muted-foreground/80 truncate">
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check size={14} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-border bg-muted/30" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
