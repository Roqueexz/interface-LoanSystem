import SkeletonBase from './SkeletonBase';

interface Props {
  linhas?: number;
  colunas?: number;
}

function SkeletonTabela({ linhas = 5, colunas = 4 }: Props) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${colunas}, 1fr)` }}>
          {Array.from({ length: colunas }).map((_, index) => (
            <SkeletonBase key={index} width="80%" height={14} />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-border">
        {Array.from({ length: linhas }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${colunas}, 1fr)` }}>
              {Array.from({ length: colunas }).map((_, colIndex) => (
                <SkeletonBase
                  key={colIndex}
                  width={colIndex === 0 ? "60%" : "80%"}
                  height={16}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonTabela;