export interface Prompt {
  id: string;
  versionNumber: string;
  processStage: string;
  instructionParagraphs: string;
  instructionGuide: string;
  reasonForEdit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptFormData {
  versionNumber: string;
  processStage: string;
  instructionParagraphs: string;
  instructionGuide: string;
  reasonForEdit: string;
}