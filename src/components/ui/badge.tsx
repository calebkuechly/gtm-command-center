'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        primary:
          'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
        secondary:
          'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
        success:
          'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
        warning:
          'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
        danger:
          'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
        outline:
          'border border-gray-200 bg-transparent text-gray-700 dark:border-gray-700 dark:text-gray-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
