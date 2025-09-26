'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from './modals/auth-modal';
import { fetchMe } from '@/lib/api';
import { User, ProtectedActionButtonProps } from '../types/types';

export function ProtectedActionButton({
  children,
  onClick,
  className,
  variant = 'default',
  size = 'default',
  requireAuth = true,
}: ProtectedActionButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchMe();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const handleClick = () => {
    if (requireAuth && !user) {
      setIsAuthModalOpen(true);
    } else {
      onClick?.();
    }
  };

  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        {children}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Button>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
