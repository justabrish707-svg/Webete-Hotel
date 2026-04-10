import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-10 h-10 rounded-full border border-brand-gold/30 pointer-events-none z-[9999] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] backdrop-blur-[2px] hidden md:block ${
          isPointer ? 'scale-[2.4] bg-brand-gold/10' : 'scale-100'
        } ${isClicking ? 'scale-[0.8]' : ''}`}
        style={{
          transform: `translate3d(${position.x - 20}px, ${position.y - 20}px, 0)`,
        }}
      />
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand-gold rounded-full pointer-events-none z-[9999] transition-transform duration-200 ease-out hidden md:block"
        style={{
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
        }}
      />
    </>
  );
}
