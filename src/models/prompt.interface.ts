export interface Prompt {
  id: string;
  versionNumber: string;
  processStage: string;
  instructionParagraphs: string[];
  instructionGuide: string[];
  reasonForEdit: string[];
  jsonSchema?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptFormData {
  versionNumber: string;
  processStage: string;
  instructionParagraphs: string[];
  instructionGuide: string[];
  reasonForEdit: string[];
  jsonSchema?: string;
}

export interface GlobalSettings {
  topK: number;
  temperature: number;
  maxOutputTokens: number;
  topP: number;
}