import React from "react";
import {Composition} from "remotion";
import {GamingAd} from "./GamingAd";
import {defaultContent} from "./content";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TilicherosGamingDemo"
      component={GamingAd}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{content: defaultContent}}
    />
  );
};
