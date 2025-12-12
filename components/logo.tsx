export const Logo = ({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  // Simplified generic logo to avoid product branding
  return (
    <div
      className={className}
      style={{
        width: width ?? 120,
        height: height ?? 24,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontWeight: 600,
      }}
    >
      <span style={{ display: 'inline-block', width: 24, height: 24, borderRadius: 6, background: 'currentColor' }} />
      <span>App</span>
    </div>
  );
};
