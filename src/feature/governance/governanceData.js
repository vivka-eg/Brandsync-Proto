import { CheckCircle, FileText, Users, Target, Lightbulb, Shield, Rocket } from "phosphor-react";

export const members = [
  {
    name: "Petri Tolppanen",
    title: "Senior UX Designer",
    department: "Facility Management",
    businessUnit: "Facility Management"
  },
  {
    name: "Lukas Gavril Gnaur",
    title: "UX Designer",
    department: "Housing",
    businessUnit: "Housing"
  },
  {
    name: "Kavya Kommineni",
    title: "Junior UX Designer",
    department: "Industrials",
    businessUnit: "Industrials"
  },
  {
    name: "Børre Syvertsen Ødegaard",
    title: "Lead UX Designer",
    department: "Retail and Wholesale",
    businessUnit: "Retail and Wholesale"
  },
  {
    name: "Anton Karlkvist",
    title: "UX Designer",
    department: "EMS",
    businessUnit: "EMS"
  },
  {
    name: "Emil Semkuruto Løvø",
    title: "Senior UX Designer",
    department: "Payroll, Rostering & Finance",
    businessUnit: "Payroll, Rostering & Finance"
  },
  {
    name: "Adrian Finnanger",
    title: "Team Manager",
    department: "Retail & Wholesale",
    businessUnit: "Retail & Wholesale"
  },
  {
    name: "Sunniva Stuvøy Heggen",
    title: "UX Designer",
    department: "Healthcare",
    businessUnit: "Healthcare"
  },
  {
    name: "Rajshree Nautiyal",
    title: "UX Designer",
    department: "Industrials",
    businessUnit: "Industrials"
  },
  {
    name: "Lea Ruzicova",
    title: "UX Designer",
    department: "Industrials",
    businessUnit: "Industrials"
  },
  {
    name: "Gary Paul Smith",
    title: "Solutions Architect",
    department: "Transport ",
    businessUnit: "Transport "
  },
  {
    name: "René Thorsted",
    title: "UX Designer",
    department: "Xena",
    businessUnit: "Xena"
  },
  {
    name: "Manjeeth Shenoy",
    title: "Program Manager",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Sasha Lara Dsouza",
    title: "Junior UX Designer",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Mehnaz Zahur",
    title: "Junior UX Designer",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Nishanth Shenoy",
    title: "Junior UX Designer",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Vignesh V Kamath",
    title: "Senior UX Designer",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Jason Roque Fernandes",
    title: "Junior UX Designer",
    department: "Utility",
    businessUnit: "Utility"
  },
];

export const processSteps = [
  {
    id: 1,
    phase: "Planning & Drafting",
    description: "Careful planning and comprehensive documentation",
    color: "#6366F1",
    icon: FileText,
    details: [
      "Define clear objectives and scope for design initiatives",
      "Research industry best practices and user needs",
      "Create detailed documentation and specifications",
      "Collaborate with stakeholders to gather requirements",
      "Establish timeline and success criteria"
    ],
    benefits: [
      "Ensures alignment across teams from the start",
      "Reduces miscommunication and rework",
      "Creates a single source of truth for decisions"
    ]
  },
  {
    id: 2,
    phase: "Rigorous Review",
    description: "Quality checks and panel discussions",
    color: "#8B5CF6",
    icon: Users,
    details: [
      "Multi-disciplinary panel reviews all submissions",
      "Accessibility and usability audits performed",
      "Brand consistency verification checks",
      "Technical feasibility assessment",
      "User impact and business value evaluation"
    ],
    benefits: [
      "Catches potential issues early in the process",
      "Ensures high quality standards across all outputs",
      "Leverages diverse expertise for better outcomes"
    ]
  },
  {
    id: 3,
    phase: "Iterative Refinement",
    description: "Systematic tracking and refinement cycles",
    color: "#EC4899",
    icon: Target,
    details: [
      "Implement feedback from review panel",
      "Conduct user testing and gather insights",
      "Refine designs based on data and feedback",
      "Ensure technical implementation feasibility",
      "Validate against original objectives"
    ],
    benefits: [
      "Continuous improvement leads to excellence",
      "User-centered approach ensures adoption",
      "Data-driven decisions reduce assumptions"
    ]
  },
  {
    id: 4,
    phase: "Final Publication",
    description: "Upload to BrandSync for team access",
    color: "#10B981",
    icon: CheckCircle,
    details: [
      "Final approval from governance panel",
      "Documentation prepared for team consumption",
      "Assets uploaded to BrandSync platform",
      "Team notifications and training materials",
      "Ongoing monitoring and support established"
    ],
    benefits: [
      "Centralized access for entire organization",
      "Version control and change tracking",
      "Seamless integration into existing workflows"
    ]
  }
];

export const whyGovernanceMatters = [
  {
    icon: Shield,
    color: "#3B82F6",
    title: "Consistency Across Products",
    description: "Ensure every product feels like part of the same family, creating a cohesive brand experience that users trust and recognize."
  },
  {
    icon: Rocket,
    color: "#8B5CF6",
    title: "Faster Design Decisions",
    description: "Clear guidelines and established patterns mean teams spend less time debating and more time building great experiences."
  },
  {
    icon: Users,
    color: "#EC4899",
    title: "Cross-Team Collaboration",
    description: "Break down silos and enable seamless collaboration between designers, developers, and product teams across the organization."
  },
  {
    icon: Lightbulb,
    color: "#F59E0B",
    title: "Innovation Within Guardrails",
    description: "Governance doesn't stifle creativity; it provides a foundation that lets teams innovate confidently within proven frameworks."
  }
];

export const challenges = [
  {
    title: "Without Governance",
    problems: [
      "Inconsistent user experiences across products",
      "Duplicate work and wasted resources",
      "Accessibility issues slip through the cracks",
      "Brand dilution and confused identity",
      "Long approval cycles with unclear criteria"
    ],
    color: "#EF4444"
  },
  {
    title: "With Governance",
    solutions: [
      "Unified, cohesive experiences that delight users",
      "Reusable components save time and money",
      "Accessibility built in from the start",
      "Strong, consistent brand presence",
      "Clear, efficient approval processes"
    ],
    color: "#10B981"
  }
];
