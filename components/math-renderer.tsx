"use client"

import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  math: string;
  display?: boolean;
  className?: string;
}

/**
 * A component that safely renders LaTeX math expressions using KaTeX
 * This avoids Next.js warnings about unrecognized HTML tags
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ 
  math, 
  display = false,
  className = ""
}) => {
  // Create a ref to hold the div element
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Use useEffect to render the math when the component mounts or math changes
  React.useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          output: 'html'
        });
      } catch (error) {
        console.error('Error rendering math:', error);
        // Fallback to plain text if rendering fails
        if (containerRef.current) {
          containerRef.current.textContent = math;
        }
      }
    }
  }, [math, display]);

  return (
    <div 
      ref={containerRef} 
      className={`${className} ${display ? 'py-4 px-2 flex justify-center overflow-x-auto bg-gray-50 rounded-md my-4 shadow-sm border border-gray-200' : 'text-blue-700 font-medium inline'}`}
    />
  );
};
