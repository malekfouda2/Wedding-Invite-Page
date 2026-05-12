const CSS = `
  @keyframes floatA {
    0%,100% { transform: translate(0px, 0px)  rotate(0deg)   scale(1);    }
    20%      { transform: translate(12px,-22px) rotate(7deg)   scale(1.04); }
    45%      { transform: translate(-7px,-46px) rotate(-4deg)  scale(0.96); }
    70%      { transform: translate(16px,-34px) rotate(11deg)  scale(1.03); }
  }
  @keyframes floatB {
    0%,100% { transform: translate(0px, 0px)   rotate(0deg)   scale(1);    }
    25%      { transform: translate(-14px,-20px) rotate(-9deg)  scale(0.94); }
    55%      { transform: translate(9px, -52px)  rotate(6deg)   scale(1.06); }
    80%      { transform: translate(-4px,-36px)  rotate(-2deg)  scale(1.01); }
  }
  @keyframes floatC {
    0%,100% { transform: translate(0px, 0px)   rotate(0deg)   scale(1);    }
    15%      { transform: translate(18px,-14px)  rotate(13deg)  scale(1.07); }
    50%      { transform: translate(-5px, -40px) rotate(-8deg)  scale(0.93); }
    78%      { transform: translate(11px,-58px)  rotate(9deg)   scale(1.04); }
  }
  @keyframes floatD {
    0%,100% { transform: translate(0px, 0px)   rotate(0deg)   scale(1);    }
    30%      { transform: translate(-20px,-28px) rotate(-13deg) scale(1.05); }
    62%      { transform: translate(7px, -45px)  rotate(5deg)   scale(0.95); }
  }
  @keyframes floatE {
    0%,100% { transform: translate(0px, 0px)   rotate(0deg)   scale(1);    }
    38%      { transform: translate(9px, -32px)  rotate(17deg)  scale(0.95); }
    68%      { transform: translate(-13px,-50px) rotate(-6deg)  scale(1.05); }
    88%      { transform: translate(4px, -36px)  rotate(4deg)   scale(1.02); }
  }
`;

const ANIMS = ["floatA", "floatB", "floatC", "floatD", "floatE"] as const;

interface Item {
  type: "flower" | "heart";
  x: number; y: number;
  size: number;
  color: string;
  opacity: number;
  dur: number;
  delay: number;
  anim: number;
  initRot: number;
}

const ITEMS: Item[] = [
  { type: "flower", x:  7, y: 10, size: 36, color: "#C91255", opacity: 0.14, dur: 24, delay:   0, anim: 0, initRot: 15 },
  { type: "flower", x: 87, y: 22, size: 26, color: "#D44A18", opacity: 0.11, dur: 30, delay: -12, anim: 1, initRot: 45 },
  { type: "flower", x: 11, y: 58, size: 30, color: "#EE88B4", opacity: 0.12, dur: 22, delay:  -8, anim: 2, initRot:  0 },
  { type: "flower", x: 83, y: 70, size: 22, color: "#D9B820", opacity: 0.10, dur: 36, delay:  -5, anim: 3, initRot: 30 },
  { type: "flower", x: 52, y: 14, size: 20, color: "#82A85A", opacity: 0.09, dur: 28, delay: -18, anim: 4, initRot: 60 },
  { type: "flower", x: 32, y: 44, size: 18, color: "#EE88B4", opacity: 0.08, dur: 34, delay: -26, anim: 0, initRot: 10 },

  { type: "heart",  x: 93, y:  6, size: 24, color: "#C91255", opacity: 0.12, dur: 26, delay:  -6, anim: 1, initRot: 10  },
  { type: "heart",  x:  3, y: 36, size: 18, color: "#EE88B4", opacity: 0.10, dur: 34, delay: -22, anim: 3, initRot: -12 },
  { type: "heart",  x: 90, y: 56, size: 22, color: "#D44A18", opacity: 0.11, dur: 20, delay: -10, anim: 0, initRot:  6  },
  { type: "heart",  x: 20, y: 80, size: 20, color: "#C91255", opacity: 0.10, dur: 32, delay:  -3, anim: 2, initRot: -8  },
  { type: "heart",  x: 70, y: 88, size: 16, color: "#EE88B4", opacity: 0.09, dur: 40, delay: -16, anim: 4, initRot: 14  },
  { type: "heart",  x: 58, y: 50, size: 14, color: "#D9B820", opacity: 0.08, dur: 38, delay: -28, anim: 3, initRot:  0  },
];

function Flower({ color, size }: { color: string; size: number }) {
  const angles = [0, 72, 144, 216, 288];
  return (
    <svg width={size} height={size} viewBox="-14 -14 28 28" aria-hidden="true">
      <defs>
        <radialGradient id={`pg-${color.replace("#","")}`} cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </radialGradient>
      </defs>
      {angles.map((a) => (
        <ellipse
          key={a}
          cx="0" cy="-6.5"
          rx="3.2" ry="7.5"
          fill={`url(#pg-${color.replace("#","")})`}
          transform={`rotate(${a})`}
        />
      ))}
      {/* Stamen */}
      <circle r="3.2" fill="rgba(255,255,255,0.75)" />
      <circle r="1.4" fill={color} opacity="0.55" />
    </svg>
  );
}

function Heart({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="-11 -11 22 22" aria-hidden="true">
      <defs>
        <radialGradient id={`hg-${color.replace("#","")}`} cx="38%" cy="28%" r="62%">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <path
        d="M 0,-2 C -2.5,-6.5 -9,-6.5 -9,-1 C -9,3 -5,6.5 0,11 C 5,6.5 9,3 9,-1 C 9,-6.5 2.5,-6.5 0,-2 Z"
        fill={`url(#hg-${color.replace("#","")})`}
      />
      {/* Specular highlight */}
      <path
        d="M -4,-3.5 C -5,-5.5 -7.5,-5.8 -7,-3 C -6.5,-1 -4.5,0 -3.5,-1.5 Z"
        fill="rgba(255,255,255,0.35)"
      />
    </svg>
  );
}

export default function FloatingElements() {
  return (
    <>
      <style>{CSS}</style>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 45,
          overflow: "hidden",
        }}
      >
        {ITEMS.map((item, i) => (
          /* Outer div: static initial rotation for visual variety */
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `rotate(${item.initRot}deg)`,
            }}
          >
            {/* Inner div: drifting animation on GPU compositor thread */}
            <div
              style={{
                opacity: item.opacity,
                willChange: "transform",
                animation: `${ANIMS[item.anim]} ${item.dur}s ease-in-out ${item.delay}s infinite`,
              }}
            >
              {item.type === "flower"
                ? <Flower color={item.color} size={item.size} />
                : <Heart  color={item.color} size={item.size} />
              }
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
