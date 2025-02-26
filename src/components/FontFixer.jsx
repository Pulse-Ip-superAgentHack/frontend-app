"use client"

import { useEffect } from 'react';

export default function FontFixer() {
  useEffect(() => {
    // Create a style element to inject emergency CSS
    const style = document.createElement('style');
    style.textContent = `
      /* Emergency override for numeric values */
      [class*="temperature"] span:last-child,
      [class*="oxygen"] span:last-child,
      [class*="pulse"] span:last-child,
      [class*="steps"] h2,
      [class*="sleep"] h2,
      [class*="activity"] h2,
      [class*="card"] h2 {
        font-family: var(--font-inter) !important;
        font-weight: 500 !important;
      }
      
      /* Target specific numbers in cards */
      span:has(+ span:contains("°")),
      span:has(+ span:contains("%")),
      span:has(+ span:contains("bpm")) {
        font-family: var(--font-inter) !important;
      }
      
      /* Target all digits */
      .digit, [class*="digit"], 
      span:nth-of-type(2) {
        font-family: var(--font-inter) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
} 