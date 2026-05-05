import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDarkColor(hex: string) {
  if (!hex || hex === 'transparent') return false;
  const color = hex.replace('#', '');
  if (color.length === 3) {
    const r = parseInt(color[0] + color[0], 16);
    const g = parseInt(color[1] + color[1], 16);
    const b = parseInt(color[2] + color[2], 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.4;
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.4;
}

export function getPrimaryMockup(order: any): string | null {
  if (!order) return null;
  if (order.design_views && Array.isArray(order.design_views) && order.design_views.length > 0) {
    // Try to find the Front view first
    const frontView = order.design_views.find((v: any) => v.viewName?.toLowerCase().includes('front'));
    if (frontView && frontView.mockup_url) return frontView.mockup_url;
    
    // Otherwise, just return the first view's mockup
    if (order.design_views[0].mockup_url) return order.design_views[0].mockup_url;
  }
  return order.mockup_image_url || null;
}
