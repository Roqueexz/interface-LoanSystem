import SkeletonBase from './SkeletonBase';

function SkeletonDetalhes() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBase width="200px" height={24} />
          <SkeletonBase width="120px" height={14} />
        </div>
        <div className="flex gap-2">
          <SkeletonBase width={80} height={36} rounded="rounded-xl" />
          <SkeletonBase width={80} height={36} rounded="rounded-xl" />
        </div>
      </div>

      {/* Grid de informações */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SkeletonBase width="60%" height={20} />
          <SkeletonBase width="80%" height={16} />
          <SkeletonBase width="70%" height={16} />
          <SkeletonBase width="50%" height={16} />
        </div>
        <div className="space-y-4">
          <SkeletonBase width="60%" height={20} />
          <SkeletonBase width="80%" height={16} />
          <SkeletonBase width="70%" height={16} />
          <SkeletonBase width="50%" height={16} />
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <SkeletonBase width="50%" height={48} rounded="rounded-xl" />
        <SkeletonBase width="50%" height={48} rounded="rounded-xl" />
      </div>
    </div>
  );
}

export default SkeletonDetalhes;