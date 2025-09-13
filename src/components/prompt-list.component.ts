import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prompt } from '../models/prompt.interface';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="prompt-list-container">
      <!-- <div class="list-header">
        <h2 class="list-title">Prompt Collection</h2>
        <p class="list-subtitle" *ngIf="prompts.length > 0">{{ prompts.length }} prompt{{ prompts.length === 1 ? '' : 's' }} available</p>
      </div> -->

      <div *ngIf="prompts.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3 class="empty-title">No prompts created yet</h3>
        <p class="empty-description">Create your first prompt to get started with smart prompt management.</p>
      </div>

      <div class="prompt-grid" *ngIf="prompts.length > 0">
        <div *ngFor="let prompt of prompts; trackBy: trackByPromptId" class="prompt-card">
          <div class="card-header">
            <div class="version-badge">v{{ prompt.versionNumber }}</div>
            <div class="card-actions">
              <button 
                class="action-btn edit-btn" 
                (click)="onEdit(prompt)"
                title="Edit prompt">
                ✏️
              </button>
              <button 
                class="action-btn delete-btn" 
                (click)="onDelete(prompt)"
                title="Delete prompt">
                🗑️
              </button>
            </div>
          </div>

          <div class="card-content">
            <h3 class="process-stage">{{ prompt.processStage }}</h3>
            
            <div class="instruction-preview">
              <p class="instruction-text">{{ truncateText(prompt.instructionParagraphs, 150) }}</p>
            </div>

            <div class="instruction-guide">
              <h4 class="guide-label">Purpose</h4>
              <p class="guide-text">{{ truncateText(prompt.instructionGuide, 100) }}</p>
            </div>

            <div *ngIf="prompt.reasonForEdit" class="edit-reason">
              <h4 class="reason-label">Last Edit</h4>
              <p class="reason-text">{{ prompt.reasonForEdit }}</p>
            </div>
          </div>

          <div class="card-footer">
            <div class="timestamp-info">
              <span class="timestamp">
                Created: {{ formatDate(prompt.createdAt) }}
              </span>
              <span *ngIf="prompt.updatedAt && prompt.updatedAt !== prompt.createdAt" class="timestamp">
                Updated: {{ formatDate(prompt.updatedAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./prompt-list.component.css']
})
export class PromptListComponent {
  @Input() prompts: Prompt[] = [];
  @Output() editPrompt = new EventEmitter<Prompt>();
  @Output() deletePrompt = new EventEmitter<Prompt>();

  trackByPromptId(index: number, prompt: Prompt): string {
    return prompt.id;
  }

  onEdit(prompt: Prompt): void {
    this.editPrompt.emit(prompt);
  }

  onDelete(prompt: Prompt): void {
    if (confirm(`Are you sure you want to delete the prompt "${prompt.processStage}"?`)) {
      this.deletePrompt.emit(prompt);
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}