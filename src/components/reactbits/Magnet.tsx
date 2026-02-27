'use client';
import React, { useEffect, useRef, useCallback, ReactNode, HTMLAttributes } from 'react';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const magnetRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(false);

  // Use refs for config so the listener doesn't need to be re-attached
  const configRef = useRef({ padding, disabled, magnetStrength, activeTransition, inactiveTransition });
  configRef.current = { padding, disabled, magnetStrength, activeTransition, inactiveTransition };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!magnetRef.current || !innerRef.current) return;
    const cfg = configRef.current;
    if (cfg.disabled) return;

    const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    if (distX < width / 2 + cfg.padding && distY < height / 2 + cfg.padding) {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        innerRef.current.style.transition = cfg.activeTransition;
      }
      const offsetX = (e.clientX - centerX) / cfg.magnetStrength;
      const offsetY = (e.clientY - centerY) / cfg.magnetStrength;
      innerRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    } else if (isActiveRef.current) {
      isActiveRef.current = false;
      innerRef.current.style.transition = cfg.inactiveTransition;
      innerRef.current.style.transform = `translate3d(0px, 0px, 0)`;
    }
  }, []);

  useEffect(() => {
    if (disabled) {
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(0px, 0px, 0)`;
      }
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [disabled, handleMouseMove]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
