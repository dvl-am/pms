import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Prompt } from "../models/prompt.interface";
import { PromptService } from "../services/prompt.service";

@Component({
  selector: "app-prompt-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./prompt-list.component.html",
  styleUrls: ["./prompt-list.component.css"],
})
export class PromptListComponent implements OnInit{


  @Input() prompts: any[] = [];
  @Output() editPrompt = new EventEmitter<Prompt>();
  @Output() deletePrompt = new EventEmitter<Prompt>();
  show = false;
  message: string="";
  currentPrompt!: any;

  constructor(private promptService:PromptService){

  }
  ngOnInit(): void {
    this.promptService.getData().subscribe(data=>{
      if(data?.length){
        //debugger
        this.prompts = [...data];
        this.promptService.loadSampleData(data)
      }
    })
  }

  trackByPromptId(index: number, prompt: Prompt): string {
    return prompt.id;
  }

  onEdit(prompt: any): void {
    this.editPrompt.emit(prompt);
  }

  onDelete(prompt: any): void {
    this.show = true;
     this.message = `Are you sure you want to delete the prompt "${prompt.processStage}"?`;
    
      this.currentPrompt = prompt;
    
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  }

  formatDate(date: Date): string {
    if(!date) return '';
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
  onConfirm(arg: boolean) {
    this.show = false;
    if(arg){
      this.prompts = this.prompts.filter(p => p?._id?.$oid !== this.currentPrompt?._id?.$oid);
      this.promptService.loadSampleData(this.prompts)
        this.deletePrompt.emit(this.currentPrompt);
    }
  }

  getCurrentVersionItem(promptItem: any, version: string) {
      return [promptItem.versions.find((v: any) => v.versionNumber === version)]
    
    }
}
