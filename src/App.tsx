/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { HomeView } from './views/HomeView';
import { EventView } from './views/EventView';
import { VerifyView } from './views/VerifyView';
import { AdminView } from './views/AdminView';
import { StorageService, AUTHORIZED_ADMIN_EMAIL } from './services/storage';
import { AdminUser, EventItem } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string>('');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [adminSession, setAdminSession] = useState<AdminUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Load initial data and admin session
  useEffect(() => {
    setEvents(StorageService.getEvents());
    setAdminSession(StorageService.getAdminSession());

    // Listen to hash and query changes for deep linking
    const handleNavigation = () => {
      // Check query parameters first (?verify=... or ?event=...)
      const searchParams = new URLSearchParams(window.location.search);
      const verifyQuery = searchParams.get('verify') || searchParams.get('cert');
      const eventQuery = searchParams.get('event');

      if (verifyQuery) {
        setCurrentView('verify');
        setViewParam(verifyQuery);
        return;
      }

      if (eventQuery) {
        setCurrentView('event');
        setViewParam(eventQuery);
        return;
      }

      // Check hash (#verify/... or #event/...)
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('event/')) {
        const slug = hash.replace('event/', '');
        setCurrentView('event');
        setViewParam(slug);
      } else if (hash.startsWith('verify/')) {
        const certId = hash.replace('verify/', '');
        setCurrentView('verify');
        setViewParam(certId);
      } else if (hash === 'verify') {
        setCurrentView('verify');
        setViewParam('');
      } else if (hash === 'events') {
        setCurrentView('home');
        // Scroll to events
        setTimeout(() => {
          document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === 'about') {
        setCurrentView('home');
        setTimeout(() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === 'admin') {
        const session = StorageService.getAdminSession();
        if (session && session.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
          setCurrentView('admin');
        } else {
          setIsLoginModalOpen(true);
        }
      } else {
        setCurrentView('home');
        setViewParam('');
      }
    };

    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const navigateTo = (view: string, param = '') => {
    // Clear search parameters from the browser history so they do not trap subsequent navigation
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    setCurrentView(view);
    setViewParam(param);

    if (view === 'home') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'events') {
      window.location.hash = 'events';
      setCurrentView('home');
      setTimeout(() => {
        document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (view === 'about') {
      window.location.hash = 'about';
      setCurrentView('home');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (view === 'event') {
      window.location.hash = `event/${param}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'verify') {
      window.location.hash = param ? `verify/${param}` : 'verify';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      if (!adminSession || adminSession.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        setIsLoginModalOpen(true);
      } else {
        window.location.hash = 'admin';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    StorageService.setAdminSession(null);
    setAdminSession(null);
    navigateTo('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-[#0A66C2]">
      {/* Universal Top Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        adminSession={adminSession}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            events={events}
            onSelectEvent={(slug) => navigateTo('event', slug)}
          />
        )}

        {currentView === 'event' && (
          <EventView
            slug={viewParam}
            onBack={() => navigateTo('home')}
          />
        )}

        {currentView === 'verify' && (
          <VerifyView
            initialCertId={viewParam}
            onSelectEvent={(slug) => navigateTo('event', slug)}
          />
        )}

        {currentView === 'admin' && adminSession && (
          <AdminView
            adminUser={adminSession}
            onPreviewEvent={(slug) => navigateTo('event', slug)}
            onViewCert={(certId) => navigateTo('verify', certId)}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(user) => {
          setAdminSession(user);
          navigateTo('admin');
        }}
      />
    </div>
  );
}
