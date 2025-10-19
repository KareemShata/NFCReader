/**
 * Type declarations for the app
 * This file helps TypeScript understand module imports and types
 */

// Extend window object if needed
declare global {
  interface Window {
    // Add any global properties here if needed
  }
}

// Image module declarations (if you import images)
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

export {};

