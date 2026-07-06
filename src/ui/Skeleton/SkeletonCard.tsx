import SkeletonBase from './SkeletonBase';

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBase width={48} height={48} rounded="rounded-xl" />
        <div className="flex-1">
          <SkeletonBase width="60%" height={16} />
          <SkeletonBase width="40%" height={12} className="mt-1" />
        </div>
      </div>
      <SkeletonBase width="100%" height={32} />
      <div className="flex gap-2">
        <SkeletonBase width="33%" height={24} />
        <SkeletonBase width="33%" height={24} />
        <SkeletonBase width="33%" height={24} />
      </div>
    </div>
  );
}

export default SkeletonCard;