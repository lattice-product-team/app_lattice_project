import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import './globals.css';

function useMermaidZoom() {
  const router = useRouter();

  useEffect(() => {
    const injectZoom = () => {
      const containers = document.querySelectorAll('.nextra-mermaid:not([data-zoom-initialized])');

      containers.forEach((el: Element) => {
        const container = el as HTMLDivElement;
        container.setAttribute('data-zoom-initialized', 'true');

        // Find the inner SVG
        const svg = container.querySelector('svg');
        if (!svg) return;

        // Apply container styles
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.style.cursor = 'grab';
        container.style.userSelect = 'none';
        container.style.border = '1px solid rgba(0, 0, 0, 0.08)';
        container.style.borderRadius = '0.75rem';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
        container.style.padding = '3rem 1.5rem 1.5rem 1.5rem';
        container.style.margin = '1.5rem 0';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.minHeight = '350px';

        // Dark mode styles (if dark class is on html)
        const updateThemeStyles = () => {
          const isDark = document.documentElement.classList.contains('dark');
          container.style.borderColor = isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.08)';
          container.style.backgroundColor = isDark
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)';
        };
        updateThemeStyles();

        // Listen for theme mutations
        const observer = new MutationObserver(updateThemeStyles);
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });

        // Add a helper wrapper inside the container around the SVG to handle translation & scale
        const wrapper = document.createElement('div');
        wrapper.className = 'nextra-mermaid-zoom-wrapper';
        wrapper.style.transition = 'transform 0.075s ease-out';
        wrapper.style.transformOrigin = 'center center';
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.width = '100%';

        // Move SVG into wrapper
        if (!svg.parentNode) return;
        svg.parentNode.insertBefore(wrapper, svg);
        wrapper.appendChild(svg);

        // Ensure SVG expands naturally
        svg.style.maxWidth = 'none';
        svg.style.minWidth = '900px';
        svg.style.height = 'auto';

        // State variables
        let scale = 1;
        let position = { x: 0, y: 0 };
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };

        const updateTransform = () => {
          wrapper.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;
          infoSpan.textContent = `Arrastra para mover | Zoom: ${Math.round(scale * 100)}%`;
        };

        // Create status bar
        const infoBar = document.createElement('div');
        infoBar.style.position = 'absolute';
        infoBar.style.top = '12px';
        infoBar.style.left = '16px';
        infoBar.style.zIndex = '10';
        infoBar.style.fontSize = '11px';
        infoBar.style.fontWeight = '500';
        infoBar.style.pointerEvents = 'none';
        infoBar.style.display = 'flex';
        infoBar.style.alignItems = 'center';
        infoBar.style.gap = '6px';

        const dot = document.createElement('span');
        dot.style.display = 'inline-block';
        dot.style.width = '6px';
        dot.style.height = '6px';
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = '#10b981';

        const infoSpan = document.createElement('span');
        infoSpan.style.color = '#71717a';
        infoSpan.textContent = 'Arrastra para mover | Zoom: 100%';

        infoBar.appendChild(dot);
        infoBar.appendChild(infoSpan);
        container.appendChild(infoBar);

        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.style.position = 'absolute';
        toolbar.style.bottom = '16px';
        toolbar.style.right = '16px';
        toolbar.style.zIndex = '20';
        toolbar.style.display = 'flex';
        toolbar.style.gap = '4px';
        toolbar.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
        toolbar.style.padding = '4px';
        toolbar.style.borderRadius = '8px';
        toolbar.style.border = '1px solid rgba(0, 0, 0, 0.08)';
        toolbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
        toolbar.className = 'nextra-mermaid-zoom-toolbar';

        // Apply dark mode styles to toolbar too
        const updateToolbarTheme = () => {
          const isDark = document.documentElement.classList.contains('dark');
          toolbar.style.backgroundColor = isDark
            ? 'rgba(24, 24, 27, 0.85)'
            : 'rgba(255, 255, 255, 0.85)';
          toolbar.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        };
        updateToolbarTheme();
        const toolbarObserver = new MutationObserver(updateToolbarTheme);
        toolbarObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });

        // Helper to create buttons
        const createBtn = (text: string, title: string, onClick: () => void) => {
          const btn = document.createElement('button');
          btn.textContent = text;
          btn.title = title;
          btn.style.width = '32px';
          btn.style.height = '32px';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          btn.style.border = '1px solid rgba(0, 0, 0, 0.08)';
          btn.style.borderRadius = '4px';
          btn.style.cursor = 'pointer';
          btn.style.fontSize = '13px';
          btn.style.fontWeight = 'bold';
          btn.style.transition = 'all 0.15s';

          const updateBtnTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            btn.style.backgroundColor = isDark ? '#18181b' : '#ffffff';
            btn.style.color = isDark ? '#f4f4f5' : '#18181b';
            btn.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
          };
          updateBtnTheme();
          const btnObserver = new MutationObserver(updateBtnTheme);
          btnObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
          });

          btn.onmouseover = () => {
            btn.style.filter = 'brightness(0.9)';
          };
          btn.onmouseout = () => {
            btn.style.filter = 'none';
          };
          btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          };
          return btn;
        };

        const btnOut = createBtn('-', 'Zoom Out', () => {
          scale = Math.max(scale - 0.2, 0.4);
          updateTransform();
        });

        const btnReset = createBtn('Reset', 'Reset View', () => {
          scale = 1;
          position = { x: 0, y: 0 };
          updateTransform();
        });
        btnReset.style.width = 'auto';
        btnReset.style.padding = '0 10px';
        btnReset.style.fontSize = '11px';

        const btnIn = createBtn('+', 'Zoom In', () => {
          scale = Math.min(scale + 0.2, 3);
          updateTransform();
        });

        toolbar.appendChild(btnOut);
        toolbar.appendChild(btnReset);
        toolbar.appendChild(btnIn);
        container.appendChild(toolbar);

        // Pan drag event handlers (Mouse)
        const onMouseDown = (e: MouseEvent) => {
          if ((e.target as HTMLElement).closest('.nextra-mermaid-zoom-toolbar')) return;
          isDragging = true;
          container.style.cursor = 'grabbing';
          dragStart = { x: e.clientX - position.x, y: e.clientY - position.y };
        };

        const onMouseMove = (e: MouseEvent) => {
          if (!isDragging) return;
          position = {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
          };
          updateTransform();
        };

        const onMouseUp = () => {
          isDragging = false;
          container.style.cursor = 'grab';
        };

        container.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        // Touch event handlers (Mobile)
        const onTouchStart = (e: TouchEvent) => {
          if ((e.target as HTMLElement).closest('.nextra-mermaid-zoom-toolbar')) return;
          if (e.touches.length === 1) {
            isDragging = true;
            const touch = e.touches[0];
            dragStart = { x: touch.clientX - position.x, y: touch.clientY - position.y };
          }
        };

        const onTouchMove = (e: TouchEvent) => {
          if (!isDragging) return;
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            position = {
              x: touch.clientX - dragStart.x,
              y: touch.clientY - dragStart.y,
            };
            updateTransform();
          }
        };

        const onTouchEnd = () => {
          isDragging = false;
        };

        container.addEventListener('touchstart', onTouchStart);
        container.addEventListener('touchmove', onTouchMove);
        container.addEventListener('touchend', onTouchEnd);
      });
    };

    // Run immediately and periodically as Nextra compiles on the fly in development
    const timer1 = setTimeout(injectZoom, 500);
    const timer2 = setTimeout(injectZoom, 1500);
    const timer3 = setTimeout(injectZoom, 3000);

    // Run on router changes
    router.events.on('routeChangeComplete', injectZoom);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      router.events.off('routeChangeComplete', injectZoom);
    };
  }, [router]);
}

export default function App({ Component, pageProps }: AppProps) {
  useMermaidZoom();
  return <Component {...pageProps} />;
}
