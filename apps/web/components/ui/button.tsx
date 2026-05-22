import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-xs font-mono font-medium ring-offset-background transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0033aa] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-neutral-800 border border-transparent',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-red-700 border border-transparent',
        outline: 'border border-border bg-card text-foreground hover:bg-neutral-100',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-neutral-200 border border-transparent',
        ghost: 'hover:bg-neutral-100 text-foreground',
        link: 'text-neutral-900 underline-offset-4 hover:underline',
        bloomberg: 'bg-[#0033aa] hover:bg-[#002288] text-white border border-transparent font-semibold uppercase tracking-wider',
        audit: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 font-mono font-normal',
      },
      size: {
        default: 'h-7 px-3 py-1.5',
        sm: 'h-6 px-2 text-[10px]',
        lg: 'h-8 px-4 text-sm',
        icon: 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
