import React from "react";
import { Composition } from "remotion";
import type { VideoAdProps, TemplateId } from "./remotion/types";
import { ASPECT_RATIOS } from "./remotion/aspectRatios";
import { TONES } from "./remotion/tones";
import { TEMPLATE_REGISTRY } from "./templates/registry";

import { Template01_ProductIntro } from "./templates/Template01_ProductIntro";
import { Template02_SaleCampaign } from "./templates/Template02_SaleCampaign";
import { Template03_AppIntro } from "./templates/Template03_AppIntro";
import { Template04_BeforeAfter } from "./templates/Template04_BeforeAfter";
import { Template05_ProblemSolution } from "./templates/Template05_ProblemSolution";
import { Template06_Testimonial } from "./templates/Template06_Testimonial";
import { Template07_Ranking } from "./templates/Template07_Ranking";
import { Template08_Storytelling } from "./templates/Template08_Storytelling";
import { Template09_Countdown } from "./templates/Template09_Countdown";
import { Template10_BrandAwareness } from "./templates/Template10_BrandAwareness";

export const TEMPLATE_COMPONENTS: Record<
  string,
  React.FC<VideoAdProps>
> = {
  "01": Template01_ProductIntro,
  "02": Template02_SaleCampaign,
  "03": Template03_AppIntro,
  "04": Template04_BeforeAfter,
  "05": Template05_ProblemSolution,
  "06": Template06_Testimonial,
  "07": Template07_Ranking,
  "08": Template08_Storytelling,
  "09": Template09_Countdown,
  "10": Template10_BrandAwareness,
};

function getDefaultInputs(templateId: string): Record<string, string> {
  const meta = TEMPLATE_REGISTRY[templateId];
  if (!meta) return {};
  const inputs: Record<string, string> = {};
  for (const field of meta.fields) {
    inputs[field.key] = field.defaultValue ?? field.placeholder ?? "";
  }
  return inputs;
}

export const RemotionRoot: React.FC = () => {
  const templateIds = Object.keys(TEMPLATE_REGISTRY);
  const aspectKeys = Object.keys(ASPECT_RATIOS);
  const defaultTone = TONES.trust;

  return (
    <>
      {templateIds.flatMap((templateId) =>
        aspectKeys.map((aspectKey) => {
          const aspect = ASPECT_RATIOS[aspectKey];
          const TemplateComponent = TEMPLATE_COMPONENTS[templateId];
          const compositionId = `Template${templateId}-${aspect.id}`;

          const defaultProps: VideoAdProps = {
            templateId: templateId as TemplateId,
            inputs: getDefaultInputs(templateId),
            tone: defaultTone,
            aspectRatio: aspect,
            bgmSrc: null,
            withSFX: false,
            logoSrc: null,
            durationInFrames: 450,
            fps: 30,
          };

          return (
            <Composition
              key={compositionId}
              id={compositionId}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              component={TemplateComponent as any}
              durationInFrames={450}
              fps={30}
              width={aspect.width}
              height={aspect.height}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              defaultProps={defaultProps as any}
            />
          );
        }),
      )}
    </>
  );
};
