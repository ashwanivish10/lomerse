"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { Home, Briefcase, Calendar, Shield, Settings } from "lucide-react";

type IconComponentType = React.ElementType<{ className?: string }>;

export interface InteractiveMenuItem {
  label: string;
  icon: IconComponentType;
}

export interface InteractiveMenuProps {
  items?: InteractiveMenuItem[];
  accentColor?: string;
  inline?: boolean;
}

const defaultItems: InteractiveMenuItem[] = [
  { label: "home", icon: Home },
  { label: "strategy", icon: Briefcase },
  { label: "period", icon: Calendar },
  { label: "security", icon: Shield },
  { label: "settings", icon: Settings },
];

const defaultAccentColor = "var(--component-active-color-default)";

export default function InteractiveMenu({
  items,
  accentColor,
  inline = false,
}: InteractiveMenuProps) {
  const finalItems = useMemo(() => {
    const valid = items && items.length >= 2 && items.length <= 5;
    return valid ? items : defaultItems;
  }, [items]);

  const [activeIndex, setActiveIndex] = useState(0);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const updateWidth = () => {
      const item = itemRefs.current[activeIndex];
      const text = textRefs.current[activeIndex];
      if (!item || !text) return;

      item.style.setProperty("--lineWidth", `${text.offsetWidth}px`);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [activeIndex, finalItems]);

  const navStyle = {
    "--active-color": accentColor || defaultAccentColor,
  } as React.CSSProperties;

  return (
    <nav
      style={navStyle}
      className={cn(
        "flex gap-6 px-4 py-3 rounded-xl transition-all",
        inline
          ? "bg-gray-100 border shadow-inner w-fit"
          : "fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/70 dark:bg-black/40 shadow-lg backdrop-blur-xl"
      )}
    >
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative flex flex-col items-center px-2 py-1 transition-all",
              isActive && "text-[var(--active-color)]"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "scale-110")} />

            <span
              ref={(el) => (textRefs.current[index] = el)}
              className={cn(
                "text-[10px] mt-1 transition-opacity",
                isActive ? "opacity-100" : "opacity-60"
              )}
            >
              {item.label}
            </span>

            {isActive && (
              <div
                className="absolute -bottom-1 bg-[var(--active-color)] h-[2px] rounded-full"
                style={{ width: "var(--lineWidth)" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
