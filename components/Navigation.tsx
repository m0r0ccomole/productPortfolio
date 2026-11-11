import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'motion/react';
import Headshot from './Headshot';

interface NavigationProps {
  navigation: {
    href: string;
    text: string;
  }[];
  siteTitle: string;
  globalImages?: {
    headshot?: string;
    headshotAlt?: string;
  };
}

const Navigation: React.FC<NavigationProps> = ({ navigation, siteTitle, globalImages }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'backdrop-blur-md bg-white/80 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
            {siteTitle}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-gray-700 hover:text-primary-600 transition-colors font-medium ${
                  isActive(item.href) ? 'text-primary-600' : ''
                }`}
              >
                {item.text}
                {isActive(item.href) && (
                  /* MOTION: layoutId underline, opacity-only — no token applies. */
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600"
                    layoutId="activeTab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
            ))}
            <Headshot
              src={globalImages?.headshot}
              alt={globalImages?.headshotAlt}
              size="small"
            />
          </div>

          {/* Mobile Menu Button and Headshot */}
          <div className="md:hidden flex items-center space-x-4">
            <Headshot
              src={globalImages?.headshot}
              alt={globalImages?.headshotAlt}
              size="small"
            />
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-10 h-10 text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          /* MOTION: bespoke height collapse — no token applies. */
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors ${
                    isActive(item.href) ? 'text-primary-600 bg-primary-50' : ''
                  }`}
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation; 