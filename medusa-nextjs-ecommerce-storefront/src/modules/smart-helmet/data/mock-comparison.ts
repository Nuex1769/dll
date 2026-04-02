import { SmartHelmetMockConfig } from "../types"

export const SMART_HELMET_COMPARISON_MOCKS: SmartHelmetMockConfig[] = [
  {
    eyebrow: "Hybrid",
    description: "E-bike certified helmet.",
    ratingValue: "5",
    ratingStars: 5,
    ratingNote: "Virginia Tech Certified",
    virginiaRank: "#22",
    category: "Hybrid",
    features: [
      { icon: "lights", lines: ["Front and Rear Lights"] },
      { icon: "app", lines: ["—", "Customizable via app"] },
      {
        icon: "fit",
        lines: [
          "S, M, L sizes",
          "Fits a wide range of head sizes",
          "Precision radial fit system",
        ],
      },
      {
        icon: "certified",
        lines: ["E-bike + Fully Certified", "NTA-8776, EN-1078 & CPSC"],
      },
      { icon: "brake", lines: ["Automatic Brake Lights"] },
      { icon: "turn", lines: ["Turn Signals"] },
      { icon: "mips", lines: ["Mips System"] },
    ],
  },
  {
    eyebrow: "Urban",
    isNew: true,
    description: "The impossible helmet.",
    ratingValue: "5",
    ratingStars: 5,
    ratingNote: "Virginia Tech Certified",
    virginiaRank: "#33",
    category: "Urban",
    features: [
      { icon: "lights", lines: ["Rear RGB Light"] },
      { icon: "app", lines: ["—", "Customizable via app"] },
      {
        icon: "fit",
        lines: [
          "S, M, L sizes",
          "Fits a wide range of head sizes",
          "Precision radial fit system",
        ],
      },
      {
        icon: "certified",
        lines: ["Fully Certified", "NTA-8776, EN-1078 & CPSC"],
      },
      { icon: "brake", lines: ["Automatic Brake Lights"] },
      { icon: "turn", lines: ["Turn Signals"] },
      { icon: "mips", lines: ["Optional Mips System"] },
    ],
  },
  {
    eyebrow: "Urban",
    description: "Safety & style for the city.",
    ratingValue: "—",
    ratingStars: null,
    ratingNote: "—",
    virginiaRank: "#81",
    category: "Urban",
    features: [
      {
        icon: "lights",
        lines: ["Front and Rear Lights", "Hidden RGB light under fabric"],
      },
      { icon: "app", lines: ["—", "Customizable via app"] },
      {
        icon: "fit",
        lines: [
          "S, M, L sizes",
          "Fits a wide range of head sizes",
          "Precision radial fit system",
        ],
      },
      { icon: "certified", lines: ["Fully Certified", "EN-1078 & CPSC"] },
      { icon: "brake", lines: ["Automatic Brake Lights"] },
      { icon: "turn", lines: ["Turn Signals"] },
      { icon: "mips", lines: ["Mips System"] },
    ],
  },
  {
    eyebrow: "Junior",
    isNew: true,
    description: "Safety made fun.",
    ratingValue: "—",
    ratingStars: null,
    ratingNote: "—",
    virginiaRank: "#147",
    category: "Junior",
    features: [
      { icon: "lights", lines: ["Touchable Rear RGB Light"] },
      { icon: "app", lines: ["—", "Customizable by tap & press"] },
      {
        icon: "fit",
        lines: ["One size", "Fits ages 3 to 9 (49–53 cm)", "Precision radial fit system"],
      },
      { icon: "certified", lines: ["Fully Certified", "EN-1078 & CPSC"] },
      { icon: "brake", lines: ["—"], muted: true },
      { icon: "turn", lines: ["—"], muted: true },
      { icon: "mips", lines: ["—"], muted: true },
    ],
  },
]
