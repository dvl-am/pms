import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { PromptFormComponent } from './components/prompt-form.component';
import { PromptListComponent } from './components/prompt-list.component';
import { SettingsComponent } from './components/settings.component';
import { PromptService } from './services/prompt.service';
import { Prompt, PromptFormData } from './models/prompt.interface';
import { appConfig } from './app.config';
import { LoaderComponent } from "./components/loader/loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PromptFormComponent, PromptListComponent, SettingsComponent, LoaderComponent],
  template: `
  <app-loader></app-loader>
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <div><div class="app-title">
            Prompt Management System
</div></div>
          <div><p class="app-subtitle">Manage your AI prompts intelligently</p> </div>
          <div class="header-actions">
            <!-- <button 
              class="btn btn-outline"
              (click)="toggleSettings()"
              [class.active]="showSettings">
              <span class="btn-icon">⚙️</span>
              Settings
            </button> -->
          </div>
        </div>
      </header>

      <main class="app-main">
        <div class="main-content">
          <!-- Action Bar -->
          <div class="action-bar" *ngIf="!showSettings">
      
            <input type="text" class="form-input m-r"  placeholder="Search..."
      (input)="onSearch($event)">
            <button 
              *ngIf="!showForm" 
              class="btn btn-primary create-btn"
              (click)="toggleForm()">
              <span class="btn-icon">+</span>
              Create New Prompt
            </button>
            <button 
              *ngIf="showForm" 
              class="btn btn-secondary"
              (click)="cancelForm()">
              <span class="btn-icon">←</span>
              Back to List
            </button>
          </div>

          <!-- Settings Section -->
          <div class="settings-section" *ngIf="showSettings">
            <app-settings></app-settings>
          </div>

          <!-- Form Section -->
          <div class="form-section" *ngIf="showForm && !showSettings">
            <app-prompt-form
              [editPrompt]="editingPrompt"
              (formSubmit)="onFormSubmit($event)"
              (formCancel)="cancelForm()">
            </app-prompt-form>
          </div>

          <!-- List Section -->
          <div class="list-section" *ngIf="!showForm && !showSettings">
            <app-prompt-list
              [prompts]="prompts"
              (editPrompt)="onEditPrompt($event)"
              (deletePrompt)="onDeletePrompt($event)">
            </app-prompt-list>
          </div>
        </div>
      </main>

      <!-- Success Toast -->
      <div class="toast" [class.show]="showToast">
        <div class="toast-content">
          <span class="toast-icon">✅</span>
          <span class="toast-message">{{ toastMessage }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class App implements OnInit {
  prompts: Prompt[] = [];
  showForm = false;
  showSettings = false;
  editingPrompt: Prompt | null = null;
  showToast = false;
  toastMessage = '';

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe(prompts => {
      this.prompts = prompts;
    });
    this.promptService.fetchUserDetails("amit.mishra@digivatelabs.com").subscribe(el=>{
      console.log(el);
      
    })
  }

  toggleForm(): void {
    this.showForm = true;
    this.showSettings = false;
    this.editingPrompt = null;
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    this.showForm = false;
    this.editingPrompt = null;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingPrompt = null;
  }

  onFormSubmit(formData: PromptFormData): void {
    if (this.editingPrompt) {
      // Update existing prompt
      const updated = this.promptService.updatePrompt(this.editingPrompt.id, formData);
      if (updated) {
        this.showToastMessage('Prompt updated successfully!');
      }
    } else {
      // Create new prompt
      this.promptService.createPrompt(formData);
      this.showToastMessage('Prompt created successfully!');
    }
    
    this.cancelForm();
  }

  onEditPrompt(prompt: any): void {
    this.editingPrompt = prompt;
    this.showForm = true;
  }

  onDeletePrompt(prompt: any): void {
    //const success = this.promptService.deletePrompt(prompt.id);
    this.promptService.markPromptItemAsInactive(prompt?._id?.$oid).subscribe(res=>{
      if (res) {
      this.showToastMessage('Prompt deleted successfully!');
      }})
    
    
  }

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
    onSearch(event: any) {
    const value = event.target.value;
    this.promptService.updateSearch(value);
  }
}

bootstrapApplication(App,appConfig);