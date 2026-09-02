interface RahulOSMarkProps {
  size?: number;
  variant?: 'glyph' | 'splash';
  className?: string;
}

/**
 * Overlapping-window mark for RahulOS chrome.
 * Replaces Apple branding with a desktop-native glyph.
 */
export function RahulOSMark({
  size = 14,
  variant = 'glyph',
  className,
}: RahulOSMarkProps) {
  const isSplash = variant === 'splash';
  const fill = isSplash ? '#f5f5f7' : 'currentColor';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
      style={{ display: 'block' }}
    >
      <rect
        x="1.25"
        y="4.25"
        width="9.5"
        height="9.5"
        rx="2.2"
        stroke={fill}
        strokeWidth="1.35"
        opacity={isSplash ? 0.45 : 0.55}
      />
      <rect
        x="5.25"
        y="1.25"
        width="9.5"
        height="9.5"
        rx="2.2"
        fill={isSplash ? fill : 'none'}
        fillOpacity={isSplash ? 0.18 : 0}
        stroke={fill}
        strokeWidth="1.35"
      />
      {isSplash && (
        <rect x="7.4" y="3.3" width="5.2" height="1.15" rx="0.4" fill={fill} opacity="0.7" />
      )}
    </svg>
  );
}
