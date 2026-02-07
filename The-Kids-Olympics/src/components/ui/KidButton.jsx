// components/KidButton.jsx
import React from 'react';

/**
 * Helper to darken a hex color by a certain percentage.
 * This creates the "3D shadow" effect automatically without needing a second prop.
 */
const darkenColor = (hex, percent) => {
  let num = parseInt(hex.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      B = ((num >> 8) & 0x00FF) - amt,
      G = (num & 0x0000FF) - amt;

  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255)
  ).toString(16).slice(1);
};

const KidButton = ({ 
  label = "Click Me", 
  color = "#9956DE", 
  onClick 
}) => {
  
  // Calculate the darker shadow color (20% darker)
  const shadowColor = darkenColor(color, 20);

  return (
    <button
      onClick={onClick}
      className="
        relative 
        inline-flex 
        items-center 
        justify-center 
        px-7 
        py-3 
        text-xl 
        font-bold 
        text-white 
        uppercase 
        tracking-wide 
        transition-all 
        duration-150 
        ease-in-out 
        active:translate-y-1 
        active:shadow-none
        rounded-2xl
        select-none
        font-primary
      "
      style={{
        backgroundColor: color,
        // The 3D effect is created here using box-shadow
        boxShadow: `0px 6px 0px ${shadowColor}`,
        // Fix for active state specific styling overrides if needed
        marginBottom: '6px' // Reserves space for the shadow so layout doesn't jump
      }}
      // We use onMouseDown/Up simulation for extra crispness if needed, 
      // but CSS active: classes handle most of it.
    >
      {label}
    </button>
  );
};

export default KidButton;