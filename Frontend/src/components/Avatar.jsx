import React from 'react';
import { FiUser } from 'react-icons/fi';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Avatar = ({ 
  src, 
  name, 
  size = 'md', 
  className, 
  rounded = true,
  ...props 
}) => {
  // Determine size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-24 w-24 text-2xl',
  };

  // Get initials from name
  const getInitials = () => {
    if (!name) return '';
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  // Background color based on name hash for consistency
  const getBackgroundColor = () => {
    if (!name) return 'bg-gray-200';
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  const avatarClasses = classNames(
    'flex items-center justify-center font-medium select-none',
    sizeClasses[size],
    rounded ? 'rounded-full' : 'rounded-md',
    !src && getBackgroundColor(),
    className
  );

  return (
    <div className={avatarClasses} {...props}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`w-full h-full object-cover ${rounded ? 'rounded-full' : 'rounded-md'}`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      {!src ? (
        name ? (
          getInitials()
        ) : (
          <FiUser className="text-current" />
        )
      ) : (
        <div className={`${avatarClasses} hidden`}>
          {name ? getInitials() : <FiUser className="text-current" />}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
  rounded: PropTypes.bool,
};

export default Avatar;