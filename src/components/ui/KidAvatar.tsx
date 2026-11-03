'use client';

import React from 'react';

interface KidAvatarProps {
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export default function KidAvatar({ avatar = '🦉', size = 'md', className = '' }: KidAvatarProps) {
  const isImage = avatar?.startsWith('data:image') || avatar?.startsWith('http') || avatar?.startsWith('/');

  const sizeClasses = {
    xs: 'w-6 h-6 text-sm',
    sm: 'w-8 h-8 text-base',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-20 h-20 text-4xl',
    '2xl': 'w-24 h-24 text-5xl',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl overflow-hidden select-none flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {isImage ? (
        <img
          src={avatar}
          alt="Child Profile Avatar"
          className="w-full h-full object-cover rounded-2xl"
        />
      ) : (
        <span className="leading-none">{avatar}</span>
      )}
    </div>
  );
}

