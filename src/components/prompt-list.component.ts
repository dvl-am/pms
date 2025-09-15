import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Prompt } from "../models/prompt.interface";

@Component({
  selector: "app-prompt-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./prompt-list.component.html",
  styleUrls: ["./prompt-list.component.css"],
})
export class PromptListComponent {

  @Input() prompts: Prompt[] = [];
  @Output() editPrompt = new EventEmitter<Prompt>();
  @Output() deletePrompt = new EventEmitter<Prompt>();
  show = false;
  message: string="";
  currentPrompt!: Prompt;

  trackByPromptId(index: number, prompt: Prompt): string {
    return prompt.id;
  }

  onEdit(prompt: Prompt): void {
    this.editPrompt.emit(prompt);
  }

  onDelete(prompt: Prompt): void {
    this.show = true;
     this.message = `Are you sure you want to delete the prompt "${prompt.processStage}"?`;
    
      this.currentPrompt = prompt;
    
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatJsonSchema(schema: string): string {
    try {
      const parsed = JSON.parse(schema);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return schema;
    }
  }
  onConfirm(arg0: boolean) {
    this.show = false;
    if(arg0){
        this.deletePrompt.emit(this.currentPrompt);

    }

    
}
}
