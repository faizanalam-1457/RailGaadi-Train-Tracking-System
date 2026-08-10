'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
}

const NODES: Node[] = [
  { id: 'DEL', name: 'New Delhi', x: 200, y: 70 },
  { id: 'KOT', name: 'Kota', x: 160, y: 140 },
  { id: 'MUM', name: 'Mumbai', x: 100, y: 250 },
  { id: 'PUN', name: 'Pune', x: 120, y: 290 },
  { id: 'BLR', name: 'Bengaluru', x: 160, y: 390 },
  { id: 'MAA', name: 'Chennai', x: 220, y: 390 },
  { id: 'CCU', name: 'Kolkata', x: 350, y: 190 },
  { id: 'VNS', name: 'Varanasi', x: 280, y: 120 },
];

interface Link {
  from: string;
  to: string;
  d: string; // SVG path
}

const LINKS: Link[] = [
  { from: 'DEL', to: 'KOT', d: 'M 200 70 L 160 140' },
  { from: 'KOT', to: 'MUM', d: 'M 160 140 L 100 250' },
  { from: 'DEL', to: 'VNS', d: 'M 200 70 L 280 120' },
  { from: 'VNS', to: 'CCU', d: 'M 280 120 L 350 190' },
  { from: 'MUM', to: 'PUN', d: 'M 100 250 L 120 290' },
  { from: 'PUN', to: 'BLR', d: 'M 120 290 L 160 390' },
  { from: 'BLR', to: 'MAA', d: 'M 160 390 L 220 390' },
  { from: 'MUM', to: 'MAA', d: 'M 100 250 Q 180 320 220 390' },
  { from: 'CCU', to: 'MAA', d: 'M 350 190 Q 300 300 220 390' },
  { from: 'DEL', to: 'CCU', d: 'M 200 70 Q 280 110 350 190' },
];

export function RailNetworkMesh() {
  return (
    <div className="relative w-full h-[400px] border border-slate-200/50 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/30 rounded-3xl overflow-hidden flex items-center justify-center shadow-glass p-2">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c7_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-15 dark:opacity-20" />
      
      {/* Glowing Radar lines background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(2,132,199,0.05)_0%,transparent_70%)] pointer-events-none" />

      <svg
        viewBox="50 30 330 400"
        className="w-full h-full select-none"
        style={{ filter: 'drop-shadow(0px 0px 8px rgba(2, 132, 199, 0.15))' }}
      >
        {/* Route Paths */}
        {LINKS.map((link, idx) => (
          <g key={`link-${idx}`}>
            {/* Background Thick Glow Line */}
            <path
              d={link.d}
              fill="none"
              stroke="#0284c7"
              strokeWidth="6"
              strokeLinecap="round"
              className="opacity-[0.04]"
            />
            {/* Active Core Line */}
            <path
              d={link.d}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="opacity-40 dark:opacity-30"
            />
          </g>
        ))}

        {/* Train Particles (Gliding along paths) */}
        {LINKS.map((link, idx) => {
          // Stagger animation durations and delay
          const duration = 6 + (idx % 3) * 2.5;
          const delay = idx * 0.7;

          return (
            <circle key={`train-particle-${idx}`} r="3" fill="#38bdf8" className="shadow-glow">
              <animateMotion
                path={link.d}
                begin={`${delay}s`}
                dur={`${duration}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* City Nodes */}
        {NODES.map((node) => (
          <g key={node.id} className="cursor-pointer group">
            {/* Node Halo Pulse */}
            <circle
              cx={node.x}
              cy={node.y}
              r="14"
              fill="url(#nodeGlow)"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            
            {/* Pulse outer circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />

            {/* Core Node Dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r="3.5"
              fill="#0284c7"
              className="stroke-background stroke-[2px] transition-all group-hover:fill-sky-400 group-hover:r-[5px] duration-200"
            />

            {/* Text label */}
            <text
              x={node.x}
              y={node.y - 10}
              textAnchor="middle"
              className="font-sans text-[8px] font-extrabold fill-slate-500 dark:fill-slate-400 tracking-wider transition-all group-hover:fill-sky-500 dark:group-hover:fill-sky-400 select-none uppercase"
            >
              {node.name}
            </text>
          </g>
        ))}

        {/* Definitions */}
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Floating radar stats indicator overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-950/70 border border-slate-800 text-[9px] font-mono text-sky-400 px-3 py-1.5 rounded-xl backdrop-blur-sm pointer-events-none space-y-0.5">
        <div>NETWORK STATIONS: 8</div>
        <div>RADAR SIMULATED TRAINS: 10</div>
      </div>
    </div>
  );
}
