import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {AdContent} from "./content";

const limit = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const F = "'Arial Black', Impact, system-ui, sans-serif";
const S = "'Inter', Arial, sans-serif";

const FloatingLights: React.FC<{accent: string; secondary: string; atmosphere: AdContent["atmosphere"]}> = ({accent, secondary, atmosphere}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden"}}>
      <div style={{
        position: "absolute", width: 920, height: 920, left: -340, top: 330,
        borderRadius: "50%", background: accent, opacity: 0.17, filter: "blur(145px)",
        transform: `translate3d(${Math.sin(f / 53) * 48}px,${Math.cos(f / 72) * 68}px,0)`
      }}/>
      <div style={{
        position: "absolute", width: 780, height: 780, right: -350, bottom: 120,
        borderRadius: "50%", background: secondary, opacity: 0.11, filter: "blur(150px)",
        transform: `translate3d(${Math.cos(f / 61) * 65}px,${Math.sin(f / 83) * 40}px,0)`
      }}/>
      {atmosphere === "cyber" && <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px)",
        backgroundSize: "130px 130px", opacity: 0.13,
        transform: `perspective(800px) rotateX(22deg) translateY(${(f * 0.65) % 130}px)`
      }}/ >}
      {Array.from({length: atmosphere === "cyber" ? 24 : 14}, (_, i) => {
        const x = (i * 193 + 117) % 1080;
        const y = ((i * 337 + 101) + f * (0.45 + (i % 4) * 0.22)) % 1920;
        return <div key={i} style={{
          position: "absolute", left: x, top: y, width: i % 5 === 0 ? 6 : 3,
          height: i % 5 === 0 ? 6 : 3, borderRadius: "50%",
          background: i % 3 === 0 ? secondary : "#FFF", opacity: (atmosphere === "soft" ? 0.08 : 0.17) + (i % 4) * 0.09
        }}/>;
      })}
    </AbsoluteFill>
  );
};

const Header: React.FC<{content: AdContent}> = ({content}) => (
  <div style={{
    position: "absolute", zIndex: 20, left: 84, right: 84, top: 105,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontFamily: S, fontWeight: 900, color: "#FFF", fontSize: 35, letterSpacing: 3
  }}>
    <span>{content.brand}</span>
    <span style={{
      border: "1px solid rgba(255,255,255,.32)", borderRadius: 100,
      padding: "13px 25px", fontSize: 20, letterSpacing: 2, fontWeight: 700
    }}>{content.category}</span>
  </div>
);

const Intro: React.FC<{content: AdContent}> = ({content}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f, fps: 30, config: {damping: 16, stiffness: 85}});
  const q = spring({frame: Math.max(0, f - 12), fps: 30, config: {damping: 16}});
  const fade = interpolate(f, [74, 103], [1, 0], limit);
  return (
    <AbsoluteFill style={{
      justifyContent: "center", paddingLeft: 72, paddingRight: 72,
      opacity: fade, fontFamily: F, color: "white"
    }}>
      <div style={{fontSize: 33, fontFamily: S, fontWeight: 750, color: content.accentSecondary,
        letterSpacing: 10, marginBottom: 32, opacity: p}}>{content.eyebrow}</div>
      <div style={{
        fontSize: 146, lineHeight: 1.01, letterSpacing: -6,
        transform: `translateX(${(1 - p) * -165}px)`,
        opacity: p, textShadow: "0 14px 70px rgba(0,0,0,.4)"
      }}>{content.hook}</div>
      <div style={{
        fontSize: 138, lineHeight: 1.05, letterSpacing: -6,
        color: content.accentSecondary,
        transform: `translateX(${(1 - q) * 150}px)`, opacity: q,
        textShadow: `0 0 80px ${content.accentSecondary}45`
      }}>{content.highlight}</div>
      <div style={{
        marginTop: 45, width: interpolate(f, [18, 56], [0, 700], limit),
        height: 8, background: `linear-gradient(90deg,${content.accent},${content.accentSecondary})`,
        borderRadius: 99
      }}/>
    </AbsoluteFill>
  );
};

const ProductReveal: React.FC<{content: AdContent}> = ({content}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({frame: f, fps, config: {damping: 21, stiffness: 75}});
  const angle = interpolate(f, [0, 190], [-16, 7], limit);
  const zoom = interpolate(f, [0, 110, 250], [0.74, 1.0, 1.13], limit);
  const fade = interpolate(f, [0, 18, 230, 263], [0, 1, 1, 0], limit);
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: fade}}>
      <div style={{
        position: "absolute", width: 850, height: 850, top: 480,
        border: `2px solid ${content.accent}45`, borderRadius: "50%",
        boxShadow: `0 0 125px ${content.accent}29, inset 0 0 130px ${content.accentSecondary}11`,
        transform: `scale(${0.8 + appear * 0.25}) rotate(${f * 0.28}deg)`
      }}/>
      <div style={{
        position: "absolute", width: 650, height: 650, top: 570,
        border: `2px dashed ${content.accentSecondary}55`, borderRadius: "50%",
        transform: `rotate(${-f * 0.38}deg)`, opacity: 0.55
      }}/>
      <Img src={staticFile(content.productImage)} alt="Arte conceptual original, no corresponde a un producto comercial"
        style={{
          width: 1020, height: 1020, objectFit: "contain", zIndex: 3,
          opacity: appear, transform: `translateY(${(1 - appear) * 300 + Math.sin(f / 17) * 16}px) scale(${zoom}) rotate(${angle}deg)`,
          filter: `drop-shadow(0px 85px 60px rgba(0,0,0,.66)) drop-shadow(0px 0px 55px ${content.accent}39)`
        }}/>
      <div style={{
        position: "absolute", bottom: 320, textAlign: "center", padding: "0 120px",
        color: "white", fontFamily: S, fontSize: 49, fontWeight: 750,
        lineHeight: 1.14, zIndex: 9, opacity: interpolate(f, [26, 60, 211, 244], [0, 1, 1, 0], limit),
      }}>{content.valueLine}</div>
    </AbsoluteFill>
  );
};

const Ending: React.FC<{content: AdContent}> = ({content}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 17, stiffness: 75}});
  const button = spring({frame: Math.max(0, f - 16), fps, config: {damping: 16}});
  return (
    <AbsoluteFill style={{
      justifyContent: "center", alignItems: "center", padding: 86,
      textAlign: "center", color: "white", fontFamily: F
    }}>
      <div style={{
        fontSize: 36, fontFamily: S, letterSpacing: 9, fontWeight: 800,
        color: content.accentSecondary, opacity: p, marginBottom: 50
      }}>{content.outroLabel}</div>
      <div style={{
        fontSize: 126, lineHeight: 1, letterSpacing: -4,
        transform: `scale(${0.7 + p * 0.3})`, opacity: p,
        textShadow: `0 0 110px ${content.accent}88`
      }}>{content.brand}</div>
      <div style={{
        marginTop: 85, borderRadius: 24, background: content.accentSecondary,
        color: "#07101C", padding: "40px 44px", width: 850, boxSizing: "border-box",
        fontSize: 38, lineHeight: 1.15, fontWeight: 950, fontFamily: S,
        transform: `translateY(${(1-button)*90}px)`, opacity: button,
        boxShadow: `0 0 75px ${content.accentSecondary}55`
      }}>{content.callToAction}</div>
      <div style={{
        marginTop: 32, fontSize: 28, fontWeight: 600, fontFamily: S,
        opacity: interpolate(f, [20, 50], [0, 0.87], limit)
      }}>{content.footer}</div>
    </AbsoluteFill>
  );
};

export const GamingAd: React.FC<{content: AdContent}> = ({content}) => {
  const f = useCurrentFrame();
  const entrance = interpolate(f, [0, 15], [0, 1], limit);
  return (
    <AbsoluteFill style={{backgroundColor: content.background, overflow: "hidden", color: "#FFF"}}>
      <FloatingLights accent={content.accent} secondary={content.accentSecondary} atmosphere={content.atmosphere}/>
      <Header content={content}/>
      <Sequence from={0} durationInFrames={105}><Intro content={content}/></Sequence>
      <Sequence from={82} durationInFrames={265}><ProductReveal content={content}/></Sequence>
      <Sequence from={337} durationInFrames={113}><Ending content={content}/></Sequence>
      <div style={{
        position: "absolute", zIndex: 30, bottom: 45, left: 54, right: 54,
        color: "rgba(255,255,255,.65)", fontFamily: S, textAlign: "center",
        fontSize: 19, letterSpacing: 1.3, opacity: entrance
      }}>{content.artworkDisclaimer}</div>
    </AbsoluteFill>
  );
};
