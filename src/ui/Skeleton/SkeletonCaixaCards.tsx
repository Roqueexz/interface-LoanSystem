import SkeletonBase from './SkeletonBase';

function SkeletonCaixaCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <SkeletonBase width={48} height={48} rounded="rounded-xl" />
            <SkeletonBase width="60%" height={16} />
          </div>
          <SkeletonBase width="80%" height={32} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonCaixaCards;