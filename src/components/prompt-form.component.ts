import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
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

        <!-- JSON Schema -->
        <div class="form-group">
          <label for="jsonSchema" class="form-label">JSON Schema (Optional)</label>
          <p class="form-helper">Define the expected output structure in JSON Schema format</p>
          <textarea 
            id="jsonSchema" 
            formControlName="jsonSchema" 
            class="form-textarea json-schema"
            [class.error]="promptForm.get('jsonSchema')?.invalid && promptForm.get('jsonSchema')?.touched"
            rows="8"
            placeholder='{\n  "type": "object",\n  "properties": {\n    "result": {\n      "type": "string",\n      "description": "The generated result"\n    }\n  },\n  "required": ["result"]\n}'></textarea>
          <div *ngIf="promptForm.get('jsonSchema')?.invalid && promptForm.get('jsonSchema')?.touched" 
               class="error-message">
            <span *ngIf="promptForm.get('jsonSchema')?.errors?.['invalidJson']">Please enter valid JSON format</span>
          </div>
        </div>

        <!-- Instruction Paragraphs -->
        <div class="form-group">
          <label for="instructionParagraphs" class="form-label">Instruction Paragraphs</label>
          <div formArrayName="instructionParagraphs" class="form-array">
            <div *ngFor="let paragraph of instructionParagraphsArray.controls; let i = index" 
                 class="form-array-item">
              <div class="array-item-content">
                <textarea 
                  [formControlName]="i"
                  class="form-textarea"
                  [class.error]="paragraph.invalid && paragraph.touched"
                  rows="3"
                  [placeholder]="'Instruction paragraph ' + (i + 1) + '...'"></textarea>
                <button 
                  type="button" 
                  class="remove-btn"
                  (click)="removeInstructionParagraph(i)"
                  [disabled]="instructionParagraphsArray.length <= 1"
                  title="Remove paragraph">
                  ✕
                </button>
              </div>
              <div *ngIf="paragraph.invalid && paragraph.touched" 
                   class="error-message">
                Instruction paragraph is required
              </div>
            </div>
            <button 
              type="button" 
              class="add-btn"
              (click)="addInstructionParagraph()">
              + Add Instruction Paragraph
            </button>
          </div>
          <div *ngIf="instructionParagraphsArray.invalid && instructionParagraphsArray.touched" 
               class="error-message">
            At least one instruction paragraph is required
          </div>
        </div>

        <!-- Instruction Guide -->
        <div class="form-group">
          <label for="instructionGuide" class="form-label">Instruction Guide</label>
          <p class="form-helper">Explain the meaning and purpose of this instruction</p>
          <div formArrayName="instructionGuide" class="form-array">
            <div *ngFor="let guide of instructionGuideArray.controls; let i = index" 
                 class="form-array-item">
              <div class="array-item-content">
                <textarea 
                  [formControlName]="i"
                  class="form-textarea"
                  [class.error]="guide.invalid && guide.touched"
                  rows="3"
                  [placeholder]="'Guide explanation ' + (i + 1) + '...'"></textarea>
                <button 
                  type="button" 
                  class="remove-btn"
                  (click)="removeInstructionGuide(i)"
                  [disabled]="instructionGuideArray.length <= 1"
                  title="Remove guide">
                  ✕
                </button>
              </div>
              <div *ngIf="guide.invalid && guide.touched" 
                   class="error-message">
                Instruction guide is required
              </div>
            </div>
            <button 
              type="button" 
              class="add-btn"
              (click)="addInstructionGuide()">
              + Add Instruction Guide
            </button>
          </div>
          <div *ngIf="instructionGuideArray.invalid && instructionGuideArray.touched" 
               class="error-message">
            At least one instruction guide is required
          </div>
        </div>

        <!-- Reason for Edit -->
        <div class="form-group" *ngIf="isEditMode">
          <label for="reasonForEdit" class="form-label">Reason for Edit</label>
          <div formArrayName="reasonForEdit" class="form-array">
            <div *ngFor="let reason of reasonForEditArray.controls; let i = index" 
                 class="form-array-item">
              <div class="array-item-content">
                <input 
                  type="text"
                  [formControlName]="i"
                  class="form-input"
                  [class.error]="reason.invalid && reason.touched"
                  [placeholder]="'Edit reason ' + (i + 1) + '...'">
                <button 
                  type="button" 
                  class="remove-btn"
                  (click)="removeReasonForEdit(i)"
                  [disabled]="reasonForEditArray.length <= 1"
                  title="Remove reason">
                  ✕
                </button>
              </div>
              <div *ngIf="reason.invalid && reason.touched" 
                   class="error-message">
                Reason for edit is required
              </div>
            </div>
            <button 
              type="button" 
              class="add-btn"
              (click)="addReasonForEdit()">
              + Add Edit Reason
            </button>
          </div>
          <div *ngIf="reasonForEditArray.invalid && reasonForEditArray.touched" 
               class="error-message">
            At least one reason for edit is required when updating
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

  get instructionParagraphsArray(): FormArray {
    return this.promptForm.get('instructionParagraphs') as FormArray;
  }

  get instructionGuideArray(): FormArray {
    return this.promptForm.get('instructionGuide') as FormArray;
  }

  get reasonForEditArray(): FormArray {
    return this.promptForm.get('reasonForEdit') as FormArray;
  }

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
      instructionParagraphs: this.fb.array(
        this.editPrompt?.instructionParagraphs?.length 
          ? this.editPrompt.instructionParagraphs.map(p => this.fb.control(p, Validators.required))
          : [this.fb.control('', Validators.required)],
        Validators.required
      ),
      instructionGuide: this.fb.array(
        this.editPrompt?.instructionGuide?.length 
          ? this.editPrompt.instructionGuide.map(g => this.fb.control(g, Validators.required))
          : [this.fb.control('', Validators.required)],
        Validators.required
      ),
      reasonForEdit: this.fb.array(
        this.isEditMode 
          ? (this.editPrompt?.reasonForEdit?.length 
              ? this.editPrompt.reasonForEdit.map(r => this.fb.control(r, Validators.required))
              : [this.fb.control('', Validators.required)])
          : [],
        this.isEditMode ? Validators.required : null
      ),
      jsonSchema: [this.editPrompt?.jsonSchema || '', [this.validateJsonSchema]]
    });
  }

  addInstructionParagraph(): void {
    this.instructionParagraphsArray.push(this.fb.control('', Validators.required));
  }

  removeInstructionParagraph(index: number): void {
    if (this.instructionParagraphsArray.length > 1) {
      this.instructionParagraphsArray.removeAt(index);
    }
  }

  addInstructionGuide(): void {
    this.instructionGuideArray.push(this.fb.control('', Validators.required));
  }

  removeInstructionGuide(index: number): void {
    if (this.instructionGuideArray.length > 1) {
      this.instructionGuideArray.removeAt(index);
    }
  }

  addReasonForEdit(): void {
    this.reasonForEditArray.push(this.fb.control('', Validators.required));
  }

  removeReasonForEdit(index: number): void {
    if (this.reasonForEditArray.length > 1) {
      this.reasonForEditArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.promptForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Simulate API call delay
      setTimeout(() => {
        const formValue = this.promptForm.value;
        // Filter out empty strings from arrays
        const cleanedValue = {
          ...formValue,
          instructionParagraphs: formValue.instructionParagraphs.filter((p: string) => p.trim()),
          instructionGuide: formValue.instructionGuide.filter((g: string) => g.trim()),
          reasonForEdit: formValue.reasonForEdit.filter((r: string) => r.trim())
        };
        this.formSubmit.emit(cleanedValue);
        this.isSubmitting = false;
      }, 500);
    } else {
      this.markFormGroupTouched();
    }
  }

  validateJsonSchema(control: any) {
    if (!control.value) return null;
    
    try {
      JSON.parse(control.value);
      return null;
    } catch (error) {
      return { invalidJson: true };
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.promptForm.controls).forEach(key => {
      const control = this.promptForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach(c => c.markAsTouched());
      } else {
        control?.markAsTouched();
      }
    });
  }
}