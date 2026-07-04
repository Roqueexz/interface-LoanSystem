interface Props {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

function SkeletonBase({ className = '', width, height, rounded = 'rounded-xl' }: Props) {
  const style = {
    width: width || '100%',
    height: height || '20px',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 ${rounded} ${className}`}
      style={style}
    />
  );
}

export default SkeletonBase;