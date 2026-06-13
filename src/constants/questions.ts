export const QUESTION_MAP = {
  INITIAL_OUTREACH: {
    q1: "How long since the initial contact was made?",
    q2: "What was the expected follow-up timeline promised?",
    q3: "How many days have passed since the recruiter went silent?"
  },
  SCREENING_CALL: {
    q1: "How many days passed between the screening call and the promised follow-up date?",
    q2: "Was a follow-up interview specifically scheduled?",
    q3: "Did they provide a specific deadline for the next step?"
  },
  HIRING_MANAGER_INTERVIEW: {
    q1: "Did you receive positive feedback during the call?",
    q2: "Were next steps (e.g., assessment/final round) explicitly mentioned?",
    q3: "How many follow-up attempts did you make after the interview before receiving silence?"
  },
  FINAL_ROUND_OFFER: {
    q1: "Were salary expectations or benefits discussed?",
    q2: "Was there a verbal commitment to an offer or timeline?",
    q3: "Did they stop responding to specific questions about the offer?"
  },
  POST_PLACEMENT: {
    q1: "Was the onboarding start date finalized?",
    q2: "Did they cease communication after the offer was signed?",
    q3: "How many days passed between the signed offer and when communication broke down?"
  }
} as const;

export type GhostStage = keyof typeof QUESTION_MAP;
