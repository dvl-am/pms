import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromptService } from '../services/prompt.service';
import { GlobalSettings } from '../models/prompt.interface';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h2 class="settings-title">Global Settings</h2>
        <p class="settings-subtitle">Configure AI model parameters for prompt generation</p>
      </div>

      <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="settings-form">
        <div class="settings-grid">
          <!-- Top K Value -->
          <div class="form-group">
            <label for="topK" class="form-label">Top K Value</label>
            <p class="form-helper">Number of highest probability vocabulary tokens to keep for top-k-filtering (1-100)</p>
            <input 
              type="number" 
              id="topK" 
              formControlName="topK" 
              class="form-input"
              [class.error]="settingsForm.get('topK')?.invalid && settingsForm.get('topK')?.touched"
              min="1"
              max="100"
              step="1">
            <div *ngIf="settingsForm.get('topK')?.invalid && settingsForm.get('topK')?.touched" 
                 class="error-message">
              <span *ngIf="settingsForm.get('topK')?.errors?.['required']">Top K value is required</span>
              <span *ngIf="settingsForm.get('topK')?.errors?.['min']">Top K must be at least 1</span>
              <span *ngIf="settingsForm.get('topK')?.errors?.['max']">Top K must be at most 100</span>
            </div>
          </div>

          <!-- Temperature -->
          <div class="form-group">
            <label for="temperature" class="form-label">Temperature</label>
            <p class="form-helper">Controls randomness in output generation (0.0-2.0)</p>
            <input 
              type="number" 
              id="temperature" 
              formControlName="temperature" 
              class="form-input"
              [class.error]="settingsForm.get('temperature')?.invalid && settingsForm.get('temperature')?.touched"
              min="0"
              max="2"
              step="0.1">
            <div *ngIf="settingsForm.get('temperature')?.invalid && settingsForm.get('temperature')?.touched" 
                 class="error-message">
              <span *ngIf="settingsForm.get('temperature')?.errors?.['required']">Temperature is required</span>
              <span *ngIf="settingsForm.get('temperature')?.errors?.['min']">Temperature must be at least 0.0</span>
              <span *ngIf="settingsForm.get('temperature')?.errors?.['max']">Temperature must be at most 2.0</span>
            </div>
          </div>

          <!-- Max Output Tokens -->
          <div class="form-group">
            <label for="maxOutputTokens" class="form-label">Max Output Tokens</label>
            <p class="form-helper">Maximum number of tokens to generate (1-8192)</p>
            <input 
              type="number" 
              id="maxOutputTokens" 
              formControlName="maxOutputTokens" 
              class="form-input"
              [class.error]="settingsForm.get('maxOutputTokens')?.invalid && settingsForm.get('maxOutputTokens')?.touched"
              min="1"
              max="8192"
              step="1">
            <div *ngIf="settingsForm.get('maxOutputTokens')?.invalid && settingsForm.get('maxOutputTokens')?.touched" 
                 class="error-message">
              <span *ngIf="settingsForm.get('maxOutputTokens')?.errors?.['required']">Max output tokens is required</span>
              <span *ngIf="settingsForm.get('maxOutputTokens')?.errors?.['min']">Max output tokens must be at least 1</span>
              <span *ngIf="settingsForm.get('maxOutputTokens')?.errors?.['max']">Max output tokens must be at most 8192</span>
            </div>
          </div>

          <!-- Top P Value -->
          <div class="form-group">
            <label for="topP" class="form-label">Top P Value</label>
            <p class="form-helper">Nucleus sampling parameter (0.0-1.0)</p>
            <input 
              type="number" 
              id="topP" 
              formControlName="topP" 
              class="form-input"
              [class.error]="settingsForm.get('topP')?.invalid && settingsForm.get('topP')?.touched"
              min="0"
              max="1"
              step="0.01">
            <div *ngIf="settingsForm.get('topP')?.invalid && settingsForm.get('topP')?.touched" 
                 class="error-message">
              <span *ngIf="settingsForm.get('topP')?.errors?.['required']">Top P value is required</span>
              <span *ngIf="settingsForm.get('topP')?.errors?.['min']">Top P must be at least 0.0</span>
              <span *ngIf="settingsForm.get('topP')?.errors?.['max']">Top P must be at most 1.0</span>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="button" 
            class="btn btn-secondary"
            (click)="resetToDefaults()">
            Reset to Defaults
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="settingsForm.invalid || isSubmitting">
            <span *ngIf="isSubmitting" class="spinner"></span>
            Save Settings
          </button>
        </div>
      </form>

      <!-- Current Settings Preview -->
      <div class="settings-preview">
        <h3 class="preview-title">Current Configuration</h3>
        <div class="preview-grid">
          <div class="preview-item">
            <span class="preview-label">Top K:</span>
            <span class="preview-value">{{ settingsForm.get('topK')?.value || 'Not set' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Temperature:</span>
            <span class="preview-value">{{ settingsForm.get('temperature')?.value || 'Not set' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Max Tokens:</span>
            <span class="preview-value">{{ settingsForm.get('maxOutputTokens')?.value || 'Not set' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Top P:</span>
            <span class="preview-value">{{ settingsForm.get('topP')?.value || 'Not set' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentSettings();
  }

  private initializeForm(): void {
    this.settingsForm = this.fb.group({
      topK: [40, [Validators.required, Validators.min(1), Validators.max(100)]],
      temperature: [0.7, [Validators.required, Validators.min(0), Validators.max(2)]],
      maxOutputTokens: [2048, [Validators.required, Validators.min(1), Validators.max(8192)]],
      topP: [0.9, [Validators.required, Validators.min(0), Validators.max(1)]]
    });
  }

  private loadCurrentSettings(): void {
    this.promptService.getGlobalSettings().subscribe(settings => {
      this.settingsForm.patchValue(settings);
    });
  }

  onSubmit(): void {
    if (this.settingsForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      setTimeout(() => {
        const settings: GlobalSettings = this.settingsForm.value;
        this.promptService.updateGlobalSettings(settings);
        this.isSubmitting = false;
      }, 500);
    } else {
      this.markFormGroupTouched();
    }
  }

  resetToDefaults(): void {
    const defaultSettings: GlobalSettings = {
      topK: 40,
      temperature: 0.7,
      maxOutputTokens: 2048,
      topP: 0.9
    };
    this.settingsForm.patchValue(defaultSettings);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.settingsForm.controls).forEach(key => {
      this.settingsForm.get(key)?.markAsTouched();
    });
  }
}