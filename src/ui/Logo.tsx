import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showText?: boolean;
  subtitle?: string;
  className?: string;
  href?: string;
}

const sizeMap = {
  sm: { dimension: 32, boxClass: "w-8 h-8", textClass: "text-sm", subClass: "text-[10px]" },
  md: { dimension: 40, boxClass: "w-10 h-10", textClass: "text-base", subClass: "text-[11px]" },
  lg: { dimension: 48, boxClass: "w-12 h-12", textClass: "text-lg", subClass: "text-xs" },
  xl: { dimension: 64, boxClass: "w-16 h-16", textClass: "text-xl", subClass: "text-xs" },
  "2xl": { dimension: 80, boxClass: "w-20 h-20", textClass: "text-2xl", subClass: "text-sm" },
};

export function Logo({
  size = "md",
  showText = true,
  subtitle = "Senior Teaching Junior",
  className = "",
  href,
}: LogoProps) {
  const config = sizeMap[size];

  const content = (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {/* ITC Logo Emblem with dark/light mode protection ring */}
      <div
        className={`${config.boxClass} relative rounded-full overflow-hidden bg-white p-0.5 shadow-sm ring-1 ring-border/60 transition-transform duration-200 group-hover:scale-105 flex-shrink-0 flex items-center justify-center`}
      >
        <Image
          src="/images/itc-logo.png"
          alt="ITC - Institut de Technologie du Cambodge"
          width={config.dimension}
          height={config.dimension}
          className="object-contain w-full h-full"
          priority
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center space-x-1.5">
            <span className={`font-bold tracking-tight text-foreground ${config.textClass}`}>
              STJ
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
              ITC
            </span>
          </div>
          {subtitle && (
            <p className={`text-muted-foreground ${config.subClass} font-medium mt-0.5 hidden sm:block`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}