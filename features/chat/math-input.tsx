"use client"

import React, { useEffect, useRef, useState } from 'react';
// Import both the type and the actual class
import { MathfieldElement } from 'mathlive';
// Import styles
import './math-input.css';

// Register the web component
if (typeof window !== 'undefined') {
  // Only register in browser environment
  import('mathlive').then(({ MathfieldElement }) => {
    if (!customElements.get('math-field')) {
      customElements.define('math-field', MathfieldElement);
    }
  });
}

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
}

/**
 * Math input field component using MathLive
 */
export const MathInput: React.FC<MathInputProps> = ({
  value,
  onChange,
  placeholder = "Enter math expression...",
  className = "",
  onSubmit
}) => {
  const mathfieldRef = useRef<MathfieldElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize mathfield
  useEffect(() => {
    const mathfield = mathfieldRef.current;
    if (!mathfield) return;

    // Set initial value
    if (value && mathfield instanceof MathfieldElement) {
      mathfield.value = value;
    }

    // Add event listeners
    const handleInput = () => {
      if (mathfield instanceof MathfieldElement) {
        onChange(mathfield.value);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    };

    mathfield.addEventListener('input', handleInput);
    mathfield.addEventListener('keydown', handleKeyDown);

    return () => {
      mathfield.removeEventListener('input', handleInput);
      mathfield.removeEventListener('keydown', handleKeyDown);
    };
  }, [onChange, onSubmit, value]);

  return (
    <div className={`math-input-wrapper ${isFocused ? 'focused' : ''} ${className}`}>
      {/* @ts-ignore - Custom element */}
      <math-field
        ref={mathfieldRef as any}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        virtual-keyboard-mode="manual"
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          fontSize: '1rem',
          padding: '0.5rem',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
};
