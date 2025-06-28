"use client"

import React, { useEffect, useRef, useState } from 'react';
// Import styles
import './math-input.css';

// Define a type for the MathfieldElement
interface MathfieldElementType extends HTMLElement {
  value: string;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

// Register the web component
if (typeof window !== 'undefined') {
  // Only register in browser environment
  // Dynamic import to avoid SSR issues
  import('mathlive').then((mathliveModule) => {
    try {
      // Handle different export patterns in mathlive
      const MathfieldElement = 
        // @ts-ignore - Different module structures in different versions
        mathliveModule.MathfieldElement || 
        // @ts-ignore - Different module structures in different versions
        mathliveModule.default?.MathfieldElement || 
        // @ts-ignore - Different module structures in different versions
        mathliveModule.default;
      
      if (MathfieldElement && !customElements.get('math-field')) {
        customElements.define('math-field', MathfieldElement);
        console.log('MathfieldElement registered successfully');
      } else {
        console.warn('MathfieldElement not found or already registered');
      }
    } catch (error) {
      console.error('Error registering MathfieldElement:', error);
    }
  }).catch(error => {
    console.error('Failed to load mathlive:', error);
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
  const mathfieldRef = useRef<MathfieldElementType>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize mathfield
  useEffect(() => {
    const mathfield = mathfieldRef.current;
    if (!mathfield) return;

    // Set initial value
    if (value && mathfield) {
      mathfield.value = value;
    }

    // Add event listeners
    const handleInput = () => {
      if (mathfield) {
        onChange(mathfield.value);
      }
    };

    const handleKeyDown = (e: Event) => {
      // Cast to KeyboardEvent to access keyboard-specific properties
      const keyEvent = e as unknown as KeyboardEvent;
      if (keyEvent.key === 'Enter' && !keyEvent.shiftKey && onSubmit) {
        keyEvent.preventDefault();
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
