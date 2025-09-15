import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PromptService } from '../services/prompt.service';
import { Prompt, PromptFormData } from '../models/prompt.interface';

// Standalone validator function
function validateJsonSchema(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  
  try {
    JSON.parse(control.value);
    return null;
  } catch (error) {
    return { invalidJson: true };
  }
}

@Component({
  selector: 'app-prompt-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prompt-form.component.html',
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

get instructions(): FormArray {
  return this.promptForm.get('instructions') as FormArray;
}

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    
    this.versionOptions=['1'] //= this.promptService.getVersionOptions();
    this.initializeForm();
  }

  addInstructionItem(){
    return this.fb.group({
      paragraph: this.fb.control('', Validators.required),
      guide: this.fb.control('', Validators.required),
      reasonForChange: this.fb.control('', Validators.required)
    })
  }

  private initializeForm(): void {
    debugger
    console.log(this.editPrompt)
    this.promptForm = this.fb.group({
      versionNumber: [this.editPrompt?.versionNumber || '1', Validators.required],
      processStage: [this.editPrompt?.processStage || '', Validators.required],
      jsonSchema:this.fb.control('', Validators.required),
      prompt: this.fb.control('', Validators.required),
      temperature: this.fb.control('', Validators.required),
      topK: this.fb.control('', Validators.required),
      topP: this.fb.control('', Validators.required),
      maxOutputTokens: this.fb.control('', Validators.required),
      thinkingBudget: this.fb.control('', Validators.required),
      parentVersion: this.fb.control(''),
      instructions: this.fb.array([this.addInstructionItem()])
    })
  }
  private _initializeForm(): void {
    this.promptForm = this.fb.group({
      versionNumber: [this.editPrompt?.versionNumber || '1.0', Validators.required],
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
      jsonSchema: [this.editPrompt?.jsonSchema || '', [validateJsonSchema]]
    });
  }

  addInstructionParagraph(): void {
    this.instructionParagraphsArray.push(this.fb.control('', Validators.required));
  }

    addInstructionToArray(): void {
    this.instructions.push(this.addInstructionItem());
  }

  removeInstructionParagraph(index: number): void {
    if (this.instructionParagraphsArray.length > 1) {
      this.instructionParagraphsArray.removeAt(index);
    }
  }

    removeInstruction(index: number): void {
    if (this.instructions.length > 1) {
      this.instructions.removeAt(index);
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
      
    console.log(this.promptForm.value);
      // Simulate API call delay
    //   setTimeout(() => {
    //     const formValue = this.promptForm.value;
    //     // Filter out empty strings from arrays
    //     const cleanedValue = {
    //       ...formValue,
    //       instructionParagraphs: formValue.instructionParagraphs.filter((p: string) => p.trim()),
    //       instructionGuide: formValue.instructionGuide.filter((g: string) => g.trim()),
    //       reasonForEdit: formValue.reasonForEdit.filter((r: string) => r.trim())
    //     };
    //     this.formSubmit.emit(cleanedValue);
    //     this.isSubmitting = false;
    //   }, 500);
    // } else {
    //   this.markFormGroupTouched();
    // }

    const submitObj = {
  "processStage": this.promptForm.value.processStage,
  "versions": [
    {
      "versionNumber":  this.promptForm.value.versionNumber,
      "jsonSchema": this.promptForm.value.jsonSchema,
      "prompt": this.promptForm.value.prompt,
      "temperature": this.promptForm.value.temperature,
      "topP": this.promptForm.value.topP,
      "topK": this.promptForm.value.topK,
      "maxOutputTokens": this.promptForm.value.maxOutputTokens,
      "thinkingBudget": this.promptForm.value.thinkingBudget,
      "parentVersion": "",
      "instructions": [
        ...this.promptForm.value.instructions
      ]
    }
  ],
  "currentVersion": this.promptForm.value.versionNumber
}
  this.promptService.submitNewPromptConfig(submitObj).subscribe({
    next: (response) => {
      console.log('Prompt configuration submitted successfully:', response);
    }})
    }}


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