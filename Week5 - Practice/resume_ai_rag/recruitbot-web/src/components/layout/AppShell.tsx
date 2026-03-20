import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { useUIStore } from '@/lib/stores/ui.store';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isSidebarOpen } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-base text-white overflow-hidden">
      {/* Desktop sidebar */}
      {isSidebarOpen && (
        <div className="hidden md:block flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
