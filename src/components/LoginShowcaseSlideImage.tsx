type LoginShowcaseSlideImageProps = {
  src: string;
  isActive: boolean;
  shouldLoad: boolean;
};

export function LoginShowcaseSlideImage({
  src,
  isActive,
  shouldLoad,
}: LoginShowcaseSlideImageProps) {
  if (!shouldLoad) {
    return <div className="login-showcase__image-placeholder" aria-hidden />;
  }

  return (
    <img
      src={src}
      alt=""
      className="login-showcase__image"
      loading={isActive ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      fetchPriority={isActive ? "high" : "low"}
    />
  );
}
