import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromptService } from '../services/prompt.service';
import { Prompt, PromptFormData } from '../models/prompt.interface';

@Component({
  selector: 'app-prompt-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="prompt-form-container">
      <div class="form-header">
        <h2 class="form-title">{{ isEditMode ? 'Edit Prompt' : 'Create New Prompt' }}</h2>
        <p class="form-subtitle">{{ isEditMode ? 'Update prompt details and instructions' : 'Fill in the details to create a new prompt' }}</p>
      </div>

      <form [formGroup]="promptForm" (ngSubmit)="onSubmit()" class="prompt-form">
        <div class="form-grid">
          <!-- Version Number -->
          <div class="form-group">
            <label for="versionNumber" class="form-label">Version Number</label>
            <select 
              id="versionNumber" 
              formControlName="versionNumber" 
              class="form-select"
              [class.error]="promptForm.get('versionNumber')?.invalid && promptForm.get('versionNumber')?.touched">
              <option value="">Select version</option>
              <option *ngFor="let version of versionOptions" [value]="version">
                {{ version }}
              </option>
            </select>
            <div *ngIf="promptForm.get('versionNumber')?.invalid && promptForm.get('versionNumber')?.touched" 
                 class="error-message">
              Version number is required
            </div>
          </div>

          <!-- Process Stage -->
          <div class="form-group">
            <label for="processStage" class="form-label">Process Stage</label>
            <input 
              type="text" 
              id="processStage" 
              formControlName="processStage" 
              class="form-input"
              [class.error]="promptForm.get('processStage')?.invalid && promptForm.get('processStage')?.touched"
              placeholder="e.g., Content Generation, Code Review, Data Analysis">
            <div *ngIf="promptForm.get('processStage')?.invalid && promptForm.get('processStage')?.touched" 
                 class="error-message">
              Process stage is required
            </div>
          </div>
        </div>

        <!-- Instruction Paragraphs -->
        <div class="form-group">
          <label for="instructionParagraphs" class="form-label">Instruction Paragraphs</label>
          <textarea 
            id="instructionParagraphs" 
            formControlName="instructionParagraphs" 
            class="form-textarea"
            [class.error]="promptForm.get('instructionParagraphs')?.invalid && promptForm.get('instructionParagraphs')?.touched"
            rows="6"
            placeholder="Enter detailed instructions for the prompt..."></textarea>
          <div *ngIf="promptForm.get('instructionParagraphs')?.invalid && promptForm.get('instructionParagraphs')?.touched" 
               class="error-message">
            Instruction paragraphs are required
          </div>
        </div>

        <!-- Instruction Guide -->
        <div class="form-group">
          <label for="instructionGuide" class="form-label">Instruction Guide</label>
          <p class="form-helper">Explain the meaning and purpose of this instruction</p>
          <textarea 
            id="instructionGuide" 
            formControlName="instructionGuide" 
            class="form-textarea"
            [class.error]="promptForm.get('instructionGuide')?.invalid && promptForm.get('instructionGuide')?.touched"
            rows="4"
            placeholder="Why is this instruction required? What purpose does it serve?"></textarea>
          <div *ngIf="promptForm.get('instructionGuide')?.invalid && promptForm.get('instructionGuide')?.touched" 
               class="error-message">
            Instruction guide is required
          </div>
        </div>

        <!-- Reason for Edit -->
        <div class="form-group" *ngIf="isEditMode">
          <label for="reasonForEdit" class="form-label">Reason for Edit</label>
          <input 
            type="text" 
            id="reasonForEdit" 
            formControlName="reasonForEdit" 
            class="form-input"
            [class.error]="promptForm.get('reasonForEdit')?.invalid && promptForm.get('reasonForEdit')?.touched"
            placeholder="Brief description of what was changed and why">
          <div *ngIf="promptForm.get('reasonForEdit')?.invalid && promptForm.get('reasonForEdit')?.touched" 
               class="error-message">
            Reason for edit is required when updating
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="button" 
            class="btn btn-secondary"
            (click)="onCancel()">
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="promptForm.invalid || isSubmitting">
            <span *ngIf="isSubmitting" class="spinner"></span>
            {{ isEditMode ? 'Update Prompt' : 'Create Prompt' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./prompt-form.component.css']
})
export class PromptFormComponent implements OnInit {
  @Input() editPrompt: Prompt | null = null;
  @Output() formSubmit = new EventEmitter<PromptFormData>();
  @Output() formCancel = new EventEmitter<void>();

  promptForm!: FormGroup;
  versionOptions: string[] = [];
  isSubmitting = false;

  get isEditMode(): boolean {
    return !!this.editPrompt;
  }

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    this.versionOptions = this.promptService.getVersionOptions();
    this.initializeForm();
  }

  private initializeForm(): void {
    this.promptForm = this.fb.group({
      versionNumber: [this.editPrompt?.versionNumber || '', Validators.required],
      processStage: [this.editPrompt?.processStage || '', Validators.required],
      instructionParagraphs: [this.editPrompt?.instructionParagraphs || '', Validators.required],
      instructionGuide: [this.editPrompt?.instructionGuide || '', Validators.required],
      reasonForEdit: [this.editPrompt?.reasonForEdit || '', this.isEditMode ? Validators.required : null]
    });
  }

  onSubmit(): void {
    if (this.promptForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Simulate API call delay
      setTimeout(() => {
        this.formSubmit.emit(this.promptForm.value);
        this.isSubmitting = false;
      }, 500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.promptForm.controls).forEach(key => {
      this.promptForm.get(key)?.markAsTouched();
    });
  }
}