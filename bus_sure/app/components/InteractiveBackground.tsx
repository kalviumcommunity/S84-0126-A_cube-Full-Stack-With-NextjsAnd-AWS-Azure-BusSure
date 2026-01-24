"use client";

import { useEffect, useState } from "react";

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false);
  const [randomGlowBoxes, setRandomGlowBoxes] = useState<Set<string>>(new Set());
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  // Set initial dimensions on client side
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setLastMouseMove(Date.now());
      setIsIdle(false);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Check for idle state
  useEffect(() => {
    const checkIdle = setInterval(() => {
      const now = Date.now();
      if (now - lastMouseMove > 2000) { // 2 seconds of no movement
        setIsIdle(true);
      }
    }, 1000);

    return () => clearInterval(checkIdle);
  }, [lastMouseMove]);

  // Random glow effect when idle
  useEffect(() => {
    if (!isIdle) {
      setRandomGlowBoxes(new Set());
      return;
    }

    const interval = setInterval(() => {
      const boxWidth = 60; // Larger width
      const boxHeight = 120; // Larger height (vertical)
      const rows = Math.ceil(dimensions.height / boxHeight) + 2;
      const cols = Math.ceil(dimensions.width / boxWidth) + 2;
      
      // Generate 3-5 random boxes to glow
      const newGlowBoxes = new Set<string>();
      const numBoxes = Math.floor(Math.random() * 3) + 3; // 3-5 boxes
      
      for (let i = 0; i < numBoxes; i++) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);
        newGlowBoxes.add(`${randomRow}-${randomCol}`);
      }
      
      setRandomGlowBoxes(newGlowBoxes);
    }, 800); // Change every 800ms

    return () => clearInterval(interval);
  }, [isIdle, dimensions]);

  // Create grid of larger rectangular boxes (taller than wide)
  const boxWidth = 60; // Larger width
  const boxHeight = 120; // Larger height (vertical)
  const rows = Math.ceil(dimensions.height / boxHeight) + 2;
  const cols = Math.ceil(dimensions.width / boxWidth) + 2;

  const boxes = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * boxWidth;
      const y = row * boxHeight;
      const boxKey = `${row}-${col}`;
      
      let glowIntensity = 0;
      let glowColor = "59, 130, 246"; // Blue
      
      if (isIdle && randomGlowBoxes.has(boxKey)) {
        // Random glow when idle
        glowIntensity = 0.6 + Math.random() * 0.4; // 0.6 to 1.0
        // Random colors for idle glow
        const colors = [
          "59, 130, 246",   // Blue
          "147, 51, 234",   // Purple
          "236, 72, 153",   // Pink
          "34, 197, 94",    // Green
          "251, 146, 60",   // Orange
        ];
        glowColor = colors[Math.floor(Math.random() * colors.length)];
      } else if (!isIdle) {
        // Mouse proximity glow
        const boxCenterX = x + boxWidth / 2;
        const boxCenterY = y + boxHeight / 2;
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - boxCenterX, 2) + 
          Math.pow(mousePosition.y - boxCenterY, 2)
        );
        
        const maxDistance = Math.max(boxWidth, boxHeight) * 2;
        glowIntensity = Math.max(0, 1 - distance / maxDistance);
      }
      
      boxes.push(
        <div
          key={boxKey}
          className="absolute border border-gray-200/10 dark:border-gray-700/20 transition-all duration-300 ease-out"
          style={{
            left: x,
            top: y,
            width: boxWidth,
            height: boxHeight,
            backgroundColor: glowIntensity > 0.1 
              ? `rgba(${glowColor}, ${glowIntensity * 0.15})` 
              : 'transparent',
            boxShadow: glowIntensity > 0.1 
              ? `inset 0 0 ${25 * glowIntensity}px rgba(${glowColor}, ${glowIntensity * 0.4}), 0 0 ${15 * glowIntensity}px rgba(${glowColor}, ${glowIntensity * 0.2})`
              : 'none',
            borderColor: glowIntensity > 0.1 
              ? `rgba(${glowColor}, ${glowIntensity * 0.6})`
              : undefined,
          }}
        />
      );
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0">
        {boxes}
      </div>
    </div>
  );
}