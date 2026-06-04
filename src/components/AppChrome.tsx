'use client';
import { useEffect, useState } from 'react';
import { NavBar } from './NavBar';
import { CommandSearch } from './CommandSearch';

export function AppChrome() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <><NavBar onOpenSearch={() => setOpen(true)} /><CommandSearch open={open} onClose={() => setOpen(false)} /></>;
}
