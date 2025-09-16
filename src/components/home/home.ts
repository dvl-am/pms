import { Component, OnInit } from '@angular/core';
import { Prompt, PromptFormData } from '../../models/prompt.interface';
import { PromptService } from '../../services/prompt.service';
import { PromptFormComponent } from "../prompt-form.component";
import { PromptListComponent } from "../prompt-list.component";
import { SettingsComponent } from "../settings.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [PromptFormComponent, PromptListComponent, SettingsComponent,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
    prompts: Prompt[] = [];
  showForm = false;
  showSettings = false;
  editingPrompt: Prompt | null = null;
  showToast = false;
  toastMessage = '';

  constructor(private promptService: PromptService, private router: Router) {}

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe(prompts => {
      this.prompts = prompts;
    });
    this.promptService.fetchUserDetails("amit.mishra@digivatelabs.com").subscribe(el=>{
      
    })
  }
   logout() {
  
    sessionStorage.clear()
    localStorage.clear();
    this.router.navigate(['/login']); // redirect to login
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
    const success = this.promptService.deletePrompt(prompt.id);
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
