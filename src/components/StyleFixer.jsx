"use client"

import { useEffect } from 'react';

export default function StyleFixer() {
  useEffect(() => {
    // Create a style element to inject specific CSS targeting dashboard numbers
    const style = document.createElement('style');
    style.textContent = `
      /* Target all large numbers in dashboard cards */ 
      .Temperature span:nth-child(2),
      .Oxygen span:nth-child(2),
      .Pulse span:nth-child(2),
      div[class*="Card"] span:nth-child(2),
      div[class*="card"] span:nth-child(2),
      div[class*="Steps"] h2,
      div[class*="Sleep"] h2,
      div[class*="Activity"] h2,
      div[class*="metrics"] h2,
      
      /* The main dashboard numbers */
      span:has(+ span:contains("°")),
      span:has(+ span:contains("%")),
      span:has(+ span:contains("bpm")),
      
      /* Target numerical values anywhere */
      [class*="numerical"], [class*="value"], [class*="number"],
      .numerical, .number, .metric, .value,
      
      /* Target precise formatting patterns likely to be numbers */
      span:matches(/^[0-9,.]+$/),
      span:matches(/^[0-9,.]+[°%]$/),
      span:matches(/^[0-9,.]+\s*[a-z]+$/i),
      
      /* Last resort catch-all for digits */
      h2 {
        font-family: var(--font-inter) !important;
        font-weight: 500 !important;
        letter-spacing: -0.02em;
      }
      
      /* Specifically target the date picker in top right corner */
      [class*="date-picker"], 
      [class*="datepicker"],
      [class*="date-range"],
      [class*="calendar"],
      div:has(svg[class*="calendar"]),
      span:has(svg[class*="calendar"]),
      div[class*="sep"],   /* Date format like "Sep 02 - Sep 09" */
      button:has(> span:contains("Sep")),
      [title*="date"], [title*="Date"], 
      [aria-label*="date"], [aria-label*="Date"],
      
      /* More specific targeting for the date in header */
      header [class*="date"],
      nav [class*="date"],
      .dashboard-header [class*="date"],
      [class*="header"] [class*="date"],
      [class*="navbar"] [class*="date"] {
        font-family: var(--font-inter) !important;
        font-feature-settings: "tnum" on !important;
      }
      
      /* Direct and extreme targeting by content */
      span:contains("Sep 02 - Sep 09"),
      div:contains("Sep 02 - Sep 09"),
      button:contains("Sep 02 - Sep 09") {
        font-family: var(--font-inter) !important;
      }
    `;
    document.head.appendChild(style);
    
    // Additionally, find and force all numeric elements to use Inter
    const applyInterToNumbers = () => {
      // Find all elements that likely contain numbers
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, span, div');
      
      elements.forEach(el => {
        // Check if the text content is numeric-like
        const text = el.textContent?.trim();
        if (text && /^[0-9,.]+(\s*[°%]|\s*[a-z]+)?$/i.test(text)) {
          el.style.fontFamily = 'var(--font-inter)';
          el.style.fontWeight = '500';
        }
      });
      
      // Add date element targeting
      applyInterToDateElements();
    };
    
    // Additionally, find and force all date elements to use Inter
    const applyInterToDateElements = () => {
      // Find date picker elements based on content
      document.querySelectorAll('span, div, button').forEach(el => {
        const text = el.textContent?.trim() || '';
        
        // If element contains date-like patterns
        if (
          /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\b/.test(text) ||
          /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/.test(text) ||
          /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/.test(text)
        ) {
          el.style.fontFamily = 'var(--font-inter)';
          // Apply to all child text nodes too
          el.childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              node.style.fontFamily = 'var(--font-inter)';
            }
          });
        }
      });
      
      // Specifically target the date picker in the top right
      // This is a more direct approach to find the date picker
      const dateElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent?.trim() || '';
        return text === 'Sep 02 - Sep 09';
      });
      
      dateElements.forEach(el => {
        el.style.fontFamily = 'var(--font-inter)';
        el.parentElement.style.fontFamily = 'var(--font-inter)';
      });
    };
    
    // Run once and then on any DOM changes
    applyInterToNumbers();
    
    // Create a mutation observer to watch for DOM changes
    const observer = new MutationObserver(applyInterToNumbers);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => {
      document.head.removeChild(style);
      observer.disconnect();
    };
  }, []);
  
  return null;
} 