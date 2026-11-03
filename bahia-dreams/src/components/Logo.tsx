// The supplied Bahia Dreams lockup, always rendered at its native 3171:1898
// ratio. "light" is the original white-wordmark file for dark backgrounds;
// "dark" is the same artwork with the wordmark in brand navy for light ones.
const RATIO = 3171.43 / 1897.97;

export function Logo({
  variant = "light",
  height = 56,
  className = "",
}: {
  variant?: "light" | "dark" | "black";
  height?: number;
  className?: string;
}) {
  const src =
    variant === "light" ? "/brand/logo-color.svg" : variant === "dark" ? "/brand/logo-color-navy.svg" : "/brand/logo-black.svg";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Bahia Dreams Costa Rica"
      width={Math.round(height * RATIO)}
      height={height}
      className={className}
      style={{ height, width: "auto" }}
      decoding="async"
    />
  );
}

export function Macaw({ className = "", size = 40 }: { className?: string; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/macaw.png" alt="" aria-hidden="true" width={size} height={size} className={className} />;
}
