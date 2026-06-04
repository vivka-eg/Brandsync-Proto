import Image from "next/image";

// Create icon component factory
const createIcon = (iconFile, iconName) => {
  const IconComponent = ({
    width = 20,
    height = 20,
    alt,
    className,
    style,
    ...props
  }) => (
    <Image
      src={iconFile}
      alt={alt || iconName}
      width={width}
      height={height}
      className={className}
      style={style}
      {...props}
    />
  );

  return IconComponent;
};

// Export individual components
export const Top = createIcon("/icons/top.svg", "Top");
export const Bottom = createIcon("/icons/bottom.svg", "Bottom");
export const Left = createIcon("/icons/left.svg", "Left");
export const Right = createIcon("/icons/right.svg", "Right");
export const LeftToRight = createIcon("/icons/left-right.svg", "LeftToRight");
export const TopToBottom = createIcon("/icons/top-bottom.svg", "TopToBottom");
export const BatteryFull = createIcon(
  "/icons/Battery.svg",
  "BatteryFull"
);
export const CelluarFull = createIcon(
  "/icons/Cellular Signal.svg",
  "CellularFull"
);
export const WifiFull = createIcon("/icons/Wifi.svg", "WifiFull");
