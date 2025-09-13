import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Prompt, PromptFormData } from '../models/prompt.interface';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private prompts: Prompt[] = [];
  private promptsSubject = new BehaviorSubject<Prompt[]>([]);

  constructor() {
    // Initialize with sample data
    this.loadSampleData();
  }

  getPrompts(): Observable<Prompt[]> {
    return this.promptsSubject.asObservable();
  }

  createPrompt(formData: PromptFormData): Prompt {
    const newPrompt: Prompt = {
      id: this.generateId(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.prompts.unshift(newPrompt);
    this.promptsSubject.next([...this.prompts]);
    return newPrompt;
  }

  updatePrompt(id: string, formData: PromptFormData): Prompt | null {
    const index = this.prompts.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedPrompt: Prompt = {
      ...this.prompts[index],
      ...formData,
      updatedAt: new Date()
    };

    this.prompts[index] = updatedPrompt;
    this.promptsSubject.next([...this.prompts]);
    return updatedPrompt;
  }

  deletePrompt(id: string): boolean {
    const initialLength = this.prompts.length;
    this.prompts = this.prompts.filter(p => p.id !== id);
    
    if (this.prompts.length < initialLength) {
      this.promptsSubject.next([...this.prompts]);
      return true;
    }
    return false;
  }

  getVersionOptions(): string[] {
    return ['1.0', '1.1', '1.2', '2.0', '2.1', '2.2', '3.0', '3.1', '3.2', '4.0'];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private loadSampleData(): void {
    const samplePrompts: Prompt[] = [
      {
        id: 'sample1',
        versionNumber: '2.1',
        processStage: 'Content Generation',
        instructionParagraphs: 'Create engaging and informative content that resonates with the target audience. Focus on clarity, accuracy, and maintaining a consistent tone throughout the piece.',
        instructionGuide: 'This instruction ensures content quality and brand consistency across all generated materials.',
        reasonForEdit: 'Updated to include tone consistency requirements',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'sample2',
        versionNumber: '1.2',
        processStage: 'Code Review',
        instructionParagraphs: 'Review code for best practices, security vulnerabilities, and performance optimizations. Ensure proper documentation and adherence to coding standards.',
        instructionGuide: 'Code review instructions help maintain code quality and reduce technical debt in the long term.',
        reasonForEdit: 'Added security vulnerability checks',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      }
    ];

    this.prompts = samplePrompts;
    this.promptsSubject.next([...this.prompts]);
  }
}