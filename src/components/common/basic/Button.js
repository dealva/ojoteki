import clsx from 'clsx';

export function Button({
  children,
  type = 'button',
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
    ghost: 'text-gray-800 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      type={type}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
