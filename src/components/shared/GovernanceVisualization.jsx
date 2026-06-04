"use client";
import { Box } from "@mui/material";

function GovernanceVisualization({ processSteps }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 700 400"
      sx={{
        width: "100%",
        height: "100%",
        maxWidth: "700px",
      }}
    >
      <defs>
        {/* Avatar gradients for first layer (4 avatars) */}
        {[0, 1, 2, 3].map((i) => (
          <linearGradient key={i} id={`avatarGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={processSteps[i % processSteps.length].color} />
            <stop offset="100%" stopColor={processSteps[(i + 1) % processSteps.length].color} />
          </linearGradient>
        ))}
        {/* Avatar gradients for second layer (6 avatars) */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <linearGradient key={`layer2-${i}`} id={`avatarGradientLayer2-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={processSteps[i % processSteps.length].color} />
            <stop offset="100%" stopColor={processSteps[(i + 1) % processSteps.length].color} />
          </linearGradient>
        ))}
        {/* Shield gradient */}
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        {/* Review box black gradient */}
        <linearGradient id="reviewBoxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1F2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        {/* Avatar clip paths for first layer */}
        {[0, 1, 2, 3].map((i) => {
          const avatarSize = 40;
          const avatarX = avatarSize;
          const avatarY = 110 + i * 70;
          const avatarRadius = avatarSize / 2;
          return (
            <clipPath key={`clip-${i}`} id={`avatarClip${i}`}>
              <circle cx={avatarX} cy={avatarY} r={avatarRadius} />
            </clipPath>
          );
        })}
        {/* Avatar clip paths for second layer */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const avatarSize = 40;
          const xOffset = 380;
          const avatarX = avatarSize + xOffset;
          const avatarY = 60 + i * 55;
          const avatarRadius = avatarSize / 2;
          return (
            <clipPath key={`clip-layer2-${i}`} id={`avatarClipLayer2-${i}`}>
              <circle cx={avatarX} cy={avatarY} r={avatarRadius} />
            </clipPath>
          );
        })}
      </defs>

      {/* 4 Avatars stacked vertically */}
      <g>
        {[0, 1, 2, 3].map((i) => {
          const yPos = 110 + i * 70;
          const avatarSize = 40;
          const avatarX = avatarSize;
          const avatarY = yPos;
          const avatarRadius = avatarSize / 2;
          const avatarSeed = `reviewer${i + 1}`;
          const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&mouth=smile,default&eyes=happy,default`;
          
          return (
            <g key={`avatar-${i}`}>
              {/* Avatar image */}
              <image
                href={avatarUrl}
                x={avatarX - avatarRadius}
                y={avatarY - avatarRadius}
                width={avatarSize}
                height={avatarSize}
                clipPath={`url(#avatarClip${i})`}
                opacity="0.9"
              />
              {/* Optional border circle */}
              <circle
                cx={avatarX}
                cy={avatarY}
                r={avatarRadius}
                fill="none"
                stroke={processSteps[i % processSteps.length].color}
                strokeWidth="2"
                opacity="0.5"
              />
            </g>
          );
        })}
      </g>

      {/* Second layer - 6 Avatars stacked vertically */}
      <g>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const yPos = 60 + i * 55;
          const avatarSize = 40;
          const xOffset = 380;
          const avatarX = avatarSize + xOffset;
          const avatarY = yPos;
          const avatarRadius = avatarSize / 2;
          const avatarSeed = `reviewer${i + 5}`;
          const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&mouth=smile,default&eyes=happy,default`;
          
          return (
            <g key={`avatar-layer2-${i}`}>
              {/* Avatar image */}
              <image
                href={avatarUrl}
                x={avatarX - avatarRadius}
                y={avatarY - avatarRadius}
                width={avatarSize}
                height={avatarSize}
                clipPath={`url(#avatarClipLayer2-${i})`}
                opacity="0.9"
              />
              {/* Optional border circle */}
              <circle
                cx={avatarX}
                cy={avatarY}
                r={avatarRadius}
                fill="none"
                stroke={processSteps[i % processSteps.length].color}
                strokeWidth="2"
                opacity="0.5"
              />
            </g>
          );
        })}
      </g>

      {/* Review Box - positioned between first and second group */}
      <g>
        {/* Box background */}
        <rect
          x="200"
          y="40"
          width="140"
          height="320"
          rx="12"
          fill="url(#reviewBoxGradient)"
          stroke="rgba(100, 149, 237, 0.4)"
          strokeWidth="2"
          style={{
            filter: "drop-shadow(0px 4px 12px rgba(100, 149, 237, 0.2))",
          }}
        />
        {/* Review label */}
        <text
          x="270"
          y="200"
          fontSize="24"
          fontWeight="700"
          fill="#FFFFFF"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          transform="rotate(-90 270 200)"
        >
          Review
        </text>
        
        {/* Floating orbs inside review box */}
        {[0, 1, 2, 3, 4].map((i) => {
          const startY = 80 + i * 60;
          const orbSize = 4;
          return (
            <g key={`orb-${i}`}>
              {/* Orb circle */}
              <circle
                cx="200"
                cy={startY}
                r={orbSize}
                fill={processSteps[i % processSteps.length].color}
                opacity="0.8"
              >
                {/* Horizontal movement from left to right */}
                <animate
                  attributeName="cx"
                  values={`200;340`}
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.4}s`}
                />
                {/* Vertical floating motion */}
                <animate
                  attributeName="cy"
                  values={`${startY};${startY - 10};${startY}`}
                  dur={`${1.5 + i * 0.2}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
                {/* Opacity fade out as it reaches the right */}
                <animate
                  attributeName="opacity"
                  values="0.8;0.8;0"
                  keyTimes="0;0.7;1"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.4}s`}
                />
              </circle>
              {/* Glow effect */}
              <circle
                cx="200"
                cy={startY}
                r={orbSize * 2}
                fill={processSteps[i % processSteps.length].color}
                opacity="0.3"
              >
                <animate
                  attributeName="cx"
                  values={`200;340`}
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.4}s`}
                />
                <animate
                  attributeName="cy"
                  values={`${startY};${startY - 10};${startY}`}
                  dur={`${1.5 + i * 0.2}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.3;0"
                  keyTimes="0;0.7;1"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.4}s`}
                />
              </circle>
            </g>
          );
        })}
      </g>

      {/* Nodes around review box - Left side (connecting to first group) */}
      {[0, 1, 2, 3].map((i) => {
        const nodeY = 110 + i * 70;
        const nodeX = 200;
        return (
          <g key={`node-left-${i}`}>
            {/* Connection node dot */}
            <circle
              cx={nodeX}
              cy={nodeY}
              r="7"
              fill={processSteps[i % processSteps.length].color}
              stroke="rgba(255, 255, 255, 1)"
              strokeWidth="2.5"
              style={{
                filter: `drop-shadow(0px 2px 6px ${processSteps[i % processSteps.length].color}60)`,
              }}
            >
              <animate
                attributeName="r"
                values="7;9;7"
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
            </circle>
            {/* Inner glow */}
            <circle
              cx={nodeX}
              cy={nodeY}
              r="4"
              fill="rgba(255, 255, 255, 0.9)"
              opacity="0.9"
            />
          </g>
        );
      })}

      {/* Nodes around review box - Right side (connecting to second group) */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const nodeY = 60 + i * 55;
        const nodeX = 340;
        return (
          <g key={`node-right-${i}`}>
            {/* Connection node dot */}
            <circle
              cx={nodeX}
              cy={nodeY}
              r="7"
              fill={processSteps[i % processSteps.length].color}
              stroke="rgba(255, 255, 255, 1)"
              strokeWidth="2.5"
              style={{
                filter: `drop-shadow(0px 2px 6px ${processSteps[i % processSteps.length].color}60)`,
              }}
            >
              <animate
                attributeName="r"
                values="7;9;7"
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.25 + 3}s`}
              />
            </circle>
            {/* Inner glow */}
            <circle
              cx={nodeX}
              cy={nodeY}
              r="4"
              fill="rgba(255, 255, 255, 0.9)"
              opacity="0.9"
            />
          </g>
        );
      })}

      {/* Connector lines from first group to review box nodes */}
      {[0, 1, 2, 3].map((i) => {
        const firstLayerX = 40;
        const firstLayerY = 110 + i * 70;
        const avatarRadius = 20;
        const avatarRightEdge = firstLayerX + avatarRadius;
        const nodeX = 200;
        const nodeY = 110 + i * 70;
        
        return (
          <g key={`connector-first-to-review-${i}`}>
            {/* Path from first layer to review box node */}
            <path
              id={`pathFirstToReview${i}`}
              d={`M ${avatarRightEdge} ${firstLayerY} L ${nodeX} ${nodeY}`}
              fill="none"
              stroke={processSteps[i % processSteps.length].color}
              strokeWidth="2"
              opacity="0.5"
              strokeDasharray="4,4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="8"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            {/* Moving dot along path */}
            <circle r="3.5" fill={processSteps[i % processSteps.length].color}>
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              >
                <mpath href={`#pathFirstToReview${i}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}

      {/* Connector lines from review box nodes to second group */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const nodeX = 340;
        const nodeY = 60 + i * 55;
        const secondLayerX = 380;
        const secondLayerY = 60 + i * 55;
        const avatarRadius = 20;
        const avatarLeftEdge = secondLayerX + 40 - avatarRadius;
        
        return (
          <g key={`connector-review-to-second-${i}`}>
            {/* Path from review box node to second layer */}
            <path
              id={`pathReviewToSecond${i}`}
              d={`M ${nodeX} ${nodeY} L ${avatarLeftEdge} ${secondLayerY}`}
              fill="none"
              stroke={processSteps[i % processSteps.length].color}
              strokeWidth="2"
              opacity="0.5"
              strokeDasharray="4,4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="8"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${i * 0.25 + 3}s`}
              />
            </path>
            {/* Moving dot along path */}
            <circle r="3.5" fill={processSteps[i % processSteps.length].color}>
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.25 + 3}s`}
              >
                <mpath href={`#pathReviewToSecond${i}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}

      {/* Connector lines from second group to shield */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const secondLayerX = 380;
        const secondLayerY = 60 + i * 55;
        const avatarRadius = 20;
        const avatarRightEdge = secondLayerX + 40 + avatarRadius;
        const shieldX = 580;
        const shieldY = 200;
        
        return (
          <g key={`connector-second-to-shield-${i}`}>
            {/* Path from second layer to shield */}
            <path
              id={`pathSecondToShield${i}`}
              d={`M ${avatarRightEdge} ${secondLayerY} L ${shieldX - 70} ${shieldY}`}
              fill="none"
              stroke={processSteps[i % processSteps.length].color}
              strokeWidth="2.5"
              opacity="0.6"
              strokeDasharray="4,4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="8"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${i * 0.25 + 4}s`}
              />
            </path>
            {/* Moving dot along path */}
            <circle r="4" fill={processSteps[i % processSteps.length].color}>
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.25 + 4}s`}
              >
                <mpath href={`#pathSecondToShield${i}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}

      {/* Shield with Checkmark - positioned on the right */}
      <g transform="translate(580, 200)">
        {/* Shield background container */}
        <rect
          x="-70"
          y="-100"
          width="140"
          height="200"
          rx="16"
          fill="url(#shieldGradient)"
          style={{
            filter: "drop-shadow(0px 20px 40px rgba(16, 185, 129, 0.4))",
          }}
        >
          {/* Throbbing animation */}
          <animate
            attributeName="opacity"
            values="0.9;1;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
        
        {/* Shield shape */}
        <path
          d="M 0,-60 L -40,-45 L -40,20 Q -40,40 0,60 Q 40,40 40,20 L 40,-45 Z"
          fill="rgba(255, 255, 255, 0.95)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="2"
        >
          {/* Throbbing scale animation */}
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.05;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Checkmark inside shield */}
        <path
          d="M -15,5 L -5,15 L 15,-15"
          stroke="rgba(16, 185, 129, 1)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.95"
        >
          {/* Throbbing animation */}
          <animate
            attributeName="stroke-width"
            values="6;7;6"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.95;1;0.95"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Pulsing glow ring around shield */}
        <circle
          cx="0"
          cy="0"
          r="45"
          fill="none"
          stroke="rgba(16, 185, 129, 0.4)"
          strokeWidth="2"
        >
          <animate
            attributeName="r"
            values="45;55;45"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.1;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </Box>
  );
}

export default GovernanceVisualization;


