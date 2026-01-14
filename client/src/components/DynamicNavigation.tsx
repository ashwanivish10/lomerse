"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface DynamicNavigationProps {
  links: {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  brandContent?: React.ReactNode;   // Naya Prop: Logo aur company naam ke liye
  actionContent?: React.ReactNode;  // Naya Prop: Sign In button ke liye
  backgroundColor?: string;
  textColor?: string;
  highlightColor?: string;
  glowIntensity?: number;
  className?: string;
  showLabelsOnMobile?: boolean;
  onLinkClick?: (id: string) => void;
  activeLink?: string;
  enableRipple?: boolean;
}

export const DynamicNavigation = ({
  links,
  brandContent,
  actionContent,
  backgroundColor,
  textColor,
  highlightColor,
  glowIntensity = 5,
  className,
  showLabelsOnMobile = false,
  onLinkClick,
  activeLink,
  enableRipple = true,
}: DynamicNavigationProps) => {
  const navRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(
    activeLink || (links.length > 0 ? links[0].id : null)
  );

  const defaultThemeStyles = {
    text: textColor || "text-foreground",
    highlight: highlightColor || "bg-foreground/10",
  };

  const updateHighlightPosition = (id?: string) => {
    if (!navRef.current || !highlightRef.current) return;
    const linkElement = navRef.current.querySelector(`#nav-item-${id || active}`);
    if (!linkElement) return;

    const { left, width } = linkElement.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();

    highlightRef.current.style.transform = `translateX(${left - navRect.left}px)`;
    highlightRef.current.style.width = `${width}px`;
  };

  const createRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // ... (ripple effect ka code waise hi rahega)
  };

  const handleLinkClick = (id: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    createRipple(event);
    setActive(id);
    if (onLinkClick) onLinkClick(id);
  };

  const handleLinkHover = (id: string) => {
    updateHighlightPosition(id);
  };

  useEffect(() => {
    updateHighlightPosition();
    const handleResize = () => updateHighlightPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active, links]);

  useEffect(() => {
    if (activeLink && activeLink !== active) {
      setActive(activeLink);
    }
  }, [activeLink]);

  return (
    // --- YEH HAI UPDATE: Ab yeh ek full-width container hai ---
    <nav
      ref={navRef}
      className={cn(
        `relative flex items-center justify-between w-full h-20 transition-all duration-300`,
        className
      )}
      onMouseLeave={() => updateHighlightPosition()} // Highlight ko active link par reset karein
    >
      {/* Highlight div abhi bhi absolute hai */}
      <div
        ref={highlightRef}
        className={cn(
          `absolute top-1/2 -translate-y-1/2 h-10 rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-0`,
          defaultThemeStyles.highlight
        )}
      />

      {/* Left Side: Brand */}
      <div className="relative z-10">
        {brandContent}
      </div>

      {/* Middle: Links */}
      <ul className="flex justify-center items-center gap-2 p-1.5 relative z-10">
        {links.map((link) => (
          <li
            key={link.id}
            className="rounded-full"
            id={`nav-item-${link.id}`}
          >
            <a
              href={link.href}
              className={cn(
                `flex gap-2 items-center justify-center h-9 text-sm rounded-full font-medium transition-all duration-300 relative overflow-hidden px-4`,
                defaultThemeStyles.text,
                active === link.id && "font-semibold"
              )}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id, e);
              }}
              onMouseEnter={() => handleLinkHover(link.id)}
            >
              {link.icon && <span>{link.icon}</span>}
              <span className={cn(showLabelsOnMobile ? "flex" : "hidden sm:flex")}>
                {link.label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Right Side: Actions */}
      <div className="relative z-10">
        {actionContent}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes ripple { to { transform: scale(4); opacity: 0; } } .animate-ripple { animation: ripple 0.6s linear; }` }} />
    </nav>

  );
};

export default DynamicNavigation;

