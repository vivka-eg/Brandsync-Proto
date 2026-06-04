const isDev = process.env.NEXT_PUBLIC_APP_ENV === "dev";

const singleComponent = [
  "Image",

  "Overview",
  "Overview.Anatomy",
  "Overview.Anatomy.AnatomyImage",
  "Overview.Type",
  "Overview.Type.TypeElements",
  "Overview.Type.TypeElements.Image",
  "Overview.States",
  "Overview.States.Image",

  "Specification",
  "Specification.SpecificationElement",
  "Specification.SpecificationElement.Measurements",
  "Specification.SpecificationElement.Measurements.Image",
  "Specification.SpecificationElement.Measurements.MeasureElements",
  "Specification.SpecificationElement.Measurements.MeasureElements.Padding",
  "Specification.SpecificationElement.Measurements.MeasureElements.TextElement",
  "Specification.SpecificationElement.Measurements.MeasureElements.Size",

  "Usage",

  "Guidelines",
  "Guidelines.GuidelineElement",
  "Guidelines.GuidelineElement.DoAndDont",
  "Guidelines.GuidelineElement.DoAndDont.Do",
  "Guidelines.GuidelineElement.DoAndDont.Do.Image",
  "Guidelines.GuidelineElement.DoAndDont.Dont",
  "Guidelines.GuidelineElement.DoAndDont.Dont.Image",

  "Accessiblity",
  "Accessiblity.AccessiblityElement",
  "Accessiblity.AccessiblityElement.DoAndDont",
  "Accessiblity.AccessiblityElement.DoAndDont.Do",
  "Accessiblity.AccessiblityElement.DoAndDont.Do.Image",
  "Accessiblity.AccessiblityElement.DoAndDont.Dont.Image",

  ...(isDev ? ["CodeExamples"] : []),
];

export const accessibility = [
  "Video",
  "Overview",
  "Overview.SecondarySection.Subsection",
  "Overview.SecondarySection.Subsection.Image",
  "Principles",
  "Principles.Subsection",
  "Principles.Subsection.Image",
  "Foundation",
  "Foundation.Subsection",
  "Foundation.Subsection.Image",
  "TestingAndTools",
];

export const designPhilosophy = [
  "Video",

  "Purpose",
  "Purpose.Subsection",
  "Purpose.Subsection.Image",
  // "Purpose.Subsection.Description",

  "CorePrinciples",
  "CorePrinciples.Subsection",
  "CorePrinciples.Subsection.Image",
  // "CorePrinciples.Subsection.Description",

  "Approach",
  "Approach.Subsection",
  "Approach.Subsection.Image",
  // "Approach.Subsection.Description",

  "HowToUse",
  "HowToUse.Subsection",
  "HowToUse.Subsection.Image",
  // "HowToUse.Subsection.Description",
];

export const forDesigners = [
  "Video",

  "TokenSystem",
  "TokenSystem.Subsection",
  "TokenSystem.Subsection.Image",

  "GettingStartedInFigma",
  "GettingStartedInFigma.Subsection",
  "GettingStartedInFigma.Subsection.Image",

  "CustomisingTokensForYourBrand",
  "CustomisingTokensForYourBrand.Subsection",
  "CustomisingTokensForYourBrand.Subsection.Image",

  "ResponsiveBehaviourAndAccessibility",
  "ResponsiveBehaviourAndAccessibility.Subsection",
  "ResponsiveBehaviourAndAccessibility.Subsection.Image",
];

export const logosFindOne = [
  "Assets",

  "Assets.Logo",
  "Assets.Bundle",

  "Assets.LightLogo",
  "Assets.LightLogo.Horizontal",
  "Assets.LightLogo.Vertical",

  "Assets.DarkLogo",
  "Assets.DarkLogo.Horizontal",
  "Assets.DarkLogo.Vertical",

  "Assets.NegativeLogo",
  "Assets.NegativeLogo.Horizontal",
  "Assets.NegativeLogo.Vertical",

  "Sizes",
  "Sizes.HeaderSize",
  "Sizes.DrawerSize",
  "Sizes.SplashHorizontalSize",
  "Sizes.SplashSquareSize",

  "Powerpoint",
  "CVI",
];

export const logosFind = ["Assets", "Assets.Logo"];

export const populate = {
  components: {
    findOne: singleComponent,
    find: singleComponent,
  },
  "component-lists": {
    find: [
      "ComponentItem",
      "ComponentItem.ComponentImage",
      "ComponentItem.ComponentRel",
      "ComponentItem.ComponentRel.Image",
    ],
  },
  introductions: {
    find: ["Article", "Article.Blocks", "Article.Video"],
  },

  foundations: {
    find: ["Article", "Article.Blocks", "Article.Video"],
  },

  logos: {
    find: logosFindOne,
    findOne: logosFindOne,
  },

  // Single types :
  singleType: {
    chip: singleComponent,
    "navigation-header": singleComponent,
    accessibility: accessibility,
    "design-philosophy": designPhilosophy,
    "logo-placement-for-old-logo": [
      "Article",
      "Article.Blocks",
      "Article.Video",
    ],
    "for-designer": forDesigners,
  },
};
