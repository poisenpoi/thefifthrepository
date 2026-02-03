"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface CourseDetailLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export default function CourseDetailLayout({
  leftContent,
  rightContent,
}: CourseDetailLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !contentRef.current || !sidebarWrapperRef.current) return;

      const sidebar = sidebarRef.current;
      const content = contentRef.current;
      const wrapper = sidebarWrapperRef.current;

      const sidebarHeight = sidebar.offsetHeight;
      const contentRect = content.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const topOffset = 52; // lg:top-13 = 3.25rem = 52px
      const marginTop = 36; // lg:mt-9 = 2.25rem = 36px

      // Calculate where the sidebar bottom would be if sticky at topOffset
      const stickyBottomPosition = topOffset + sidebarHeight;

      // Check if we're on mobile (sidebar should not be sticky)
      if (window.innerWidth < 1024) {
        setSidebarStyle({});
        return;
      }

      // Check if the content bottom is above where the sticky sidebar bottom would be
      if (contentRect.bottom < stickyBottomPosition) {
        // Content has scrolled up past - align sidebar bottom with content bottom
        const stopTop = contentRect.bottom - sidebarHeight;
        setSidebarStyle({
          position: "fixed",
          top: `${stopTop}px`,
          width: `${wrapperRect.width}px`,
        });
      } else if (wrapperRect.top < topOffset - marginTop) {
        // Normal sticky behavior
        setSidebarStyle({
          position: "fixed",
          top: `${topOffset}px`,
          width: `${wrapperRect.width}px`,
        });
      } else {
        // At the top - use default positioning
        setSidebarStyle({
          marginTop: `${marginTop}px`,
        });
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      <div ref={contentRef} className="lg:col-span-2 flex flex-col gap-12">
        {leftContent}
      </div>
      <div ref={sidebarWrapperRef} className="lg:col-span-1 z-20">
        <div ref={sidebarRef} style={sidebarStyle}>
          {rightContent}
        </div>
      </div>
    </div>
  );
}
