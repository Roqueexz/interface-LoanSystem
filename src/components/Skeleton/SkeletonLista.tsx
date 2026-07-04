import SkeletonBase from './SkeletonBase';

interface Props {
  itens?: number;
}

function SkeletonLista({ itens = 5 }: Props) {
  return (
    <div className="space-y-3">
      {Array.from({ length: itens }).map((_, index) => (
        <div
          key={index}
          className="bg-white border rounded-xl p-4 space-y-2 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <SkeletonBase width="40%" height={16} />
            <SkeletonBase width="20%" height={14} />
          </div>
          <SkeletonBase width="60%" height={12} />
          <div className="flex justify-between items-center">
            <SkeletonBase width="30%" height={12} />
            <SkeletonBase width="80px" height={24} rounded="rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLista;