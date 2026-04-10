import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import MobileNav from './MobileNav';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useScrollReveal(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Alt + A for Admin access
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main key={location.pathname} className="flex-grow pt-20 animate-fade-in">{children}</main>
      <ChatWidget />
      <div className="pb-24 lg:pb-0">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
}
