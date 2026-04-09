"use client";

import type { AssessmentQuestion, AssessmentAnswer } from "@/types/assessment";
import NumberInput from "./inputs/NumberInput";
import SingleSelect from "./inputs/SingleSelect";
import MultiSelect from "./inputs/MultiSelect";
import RankInput from "./inputs/RankInput";
import EnergySelect from "./inputs/EnergySelect";

interface QuestionRendererProps {
  question: AssessmentQuestion;
  answer: AssessmentAnswer | null;
  onAnswer: (answer: AssessmentAnswer) => void;
}

export default function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: QuestionRendererProps) {
  switch (question.type) {
    case "number-sequence":
      return (
        <NumberInput
          value={answer?.type === "numeric" ? answer.value : null}
          onChange={(value) => onAnswer({ type: "numeric", value })}
        />
      );

    case "odd-one-out":
    case "rapid-association":
    case "scenario-judgment":
    case "estimation":
    case "single-select":
      return (
        <SingleSelect
          options={question.options ?? []}
          selected={answer?.type === "single" ? answer.optionId : null}
          onSelect={(optionId) => onAnswer({ type: "single", optionId })}
        />
      );

    case "energy-mapping":
      return (
        <EnergySelect
          selected={answer?.type === "single" ? answer.optionId : null}
          onSelect={(value) => onAnswer({ type: "single", optionId: value })}
        />
      );

    case "flow-state":
    case "discomfort-tolerance":
    case "multi-select": {
      const selected = answer?.type === "multi" ? answer.optionIds : [];
      return (
        <MultiSelect
          options={question.options ?? []}
          selected={selected}
          maxSelections={question.maxSelections}
          onToggle={(optionId) => {
            const next = selected.includes(optionId)
              ? selected.filter((id) => id !== optionId)
              : [...selected, optionId];
            onAnswer({ type: "multi", optionIds: next });
          }}
        />
      );
    }

    case "prioritization": {
      const ranked = answer?.type === "rank" ? answer.rankedIds : [];
      return (
        <RankInput
          options={question.options ?? []}
          ranked={ranked}
          maxRank={question.rankCount}
          onToggleRank={(optionId) => {
            const next = ranked.includes(optionId)
              ? ranked.filter((id) => id !== optionId)
              : [...ranked, optionId];
            onAnswer({ type: "rank", rankedIds: next });
          }}
        />
      );
    }

    default:
      return null;
  }
}
