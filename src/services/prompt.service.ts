import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { Prompt, PromptFormData, GlobalSettings } from '../models/prompt.interface';
import { AppConfigService } from './appConfig/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private prompts: any[] = [];
  private promptsSubject = new BehaviorSubject<Prompt[]>([]);
  private globalSettings: GlobalSettings = {
    topK: 40,
    temperature: 0.7,
    maxOutputTokens: 2048,
    topP: 0.9
  };
    private searchSubject = new Subject<string>();
  search$ = this.searchSubject.asObservable()
    .pipe(
      debounceTime(400),          // wait 400ms after typing
      distinctUntilChanged()      // emit only if value changed
    );
  private settingsSubject = new BehaviorSubject<GlobalSettings>(this.globalSettings);
  liquidUrl ="";
  addNew ="";
  updateMany=""

  constructor(public config: AppConfigService,private http:HttpClient) {
    // Initialize with sample data
    //this.loadSampleData();
     this.liquidUrl = this.config.getAPIURL(true, 'apiUrl', 'workFlowQueryUrl');
     this.addNew = this.config.getAPIURL(true, 'apiUrl', 'workFlowAddNewUrl');
     this.updateMany = this.config.getAPIURL(true, 'apiUrl', 'workFlowUpdateMany');

     
    //  debugger
     console.log(this.liquidUrl);
     
  }

  updateSearch(term: string) {
    this.searchSubject.next(term);
  }
  getPrompts(): Observable<Prompt[]> {
    return this.promptsSubject.asObservable();
  }

  getGlobalSettings(): Observable<GlobalSettings> {
    return this.settingsSubject.asObservable();
  }

  updateGlobalSettings(settings: GlobalSettings): void {
    this.globalSettings = { ...settings };
    this.settingsSubject.next(this.globalSettings);
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

  getData(): Observable<any[]> {
    const obj = {
          "filter": {
                "isActive": "A"
          },
          "projection": {

          },
          "sort": {
                   
          },
          "view": "promptMangementConfig"
}
    return this.http.post<any[]>(`${this.liquidUrl}`,obj);
  }
  loadSampleData(data:any): void {
    // const samplePrompts: Prompt[] = [
    //   {
    //     id: 'sample1',
    //     versionNumber: '2.1',
    //     processStage: 'Content Generation',
    //     instructionParagraphs: [
    //       'Create engaging and informative content that resonates with the target audience.',
    //       'Focus on clarity, accuracy, and maintaining a consistent tone throughout the piece.',
    //       'Ensure all content aligns with brand guidelines and messaging strategy.'
    //     ],
    //     instructionGuide: [
    //       'This instruction ensures content quality and brand consistency across all generated materials.',
    //       'Helps maintain professional standards and user engagement metrics.'
    //     ],
    //     reasonForEdit: [
    //       'Updated to include tone consistency requirements',
    //       'Added brand alignment guidelines'
    //     ],
    //     jsonSchema: '{\n  "type": "object",\n  "properties": {\n    "content": {\n      "type": "string",\n      "description": "Generated content"\n    },\n    "tone": {\n      "type": "string",\n      "enum": ["professional", "casual", "formal"]\n    }\n  },\n  "required": ["content"]\n}',
    //     createdAt: new Date('2024-01-15'),
    //     updatedAt: new Date('2024-01-20')
    //   },
    //   {
    //     id: 'sample2',
    //     versionNumber: '1.2',
    //     processStage: 'Code Review',
    //     instructionParagraphs: [
    //       'Review code for best practices, security vulnerabilities, and performance optimizations.',
    //       'Ensure proper documentation and adherence to coding standards.',
    //       'Check for code maintainability and readability.'
    //     ],
    //     instructionGuide: [
    //       'Code review instructions help maintain code quality and reduce technical debt in the long term.',
    //       'Ensures consistent development practices across the team.'
    //     ],
    //     reasonForEdit: [
    //       'Added security vulnerability checks',
    //       'Enhanced documentation requirements'
    //     ],
    //     jsonSchema: '{\n  "type": "object",\n  "properties": {\n    "issues": {\n      "type": "array",\n      "items": {\n        "type": "object",\n        "properties": {\n          "type": {"type": "string"},\n          "severity": {"type": "string"},\n          "description": {"type": "string"}\n        }\n      }\n    }\n  }\n}',
    //     createdAt: new Date('2024-01-10'),
    //     updatedAt: new Date('2024-01-18')
    //   }
    // ];
    
    this.prompts = {...data};
     this.search$.subscribe(term => {
      console.log(term);      
      const filteredPrompt = this.prompts.filter(i =>
        i.processStage.toLowerCase().includes(term.toLowerCase())
      ); 
      if(!term){
         this.promptsSubject.next([...data]);
      }
       this.promptsSubject.next([...filteredPrompt]);     
      
    });
    this.promptsSubject.next([...this.prompts]);
  }
    fetchUserDetails(emailId: string): Observable<any[]> {
    const obj = {
      view: 'userDetails',
      filter: {
        emailId: emailId,
      },
    };
    return this.http.post<any[]>(`${this.liquidUrl}`, obj).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((el: any) => {
        if (el.length) {         
          return el;
        }
      })
    );
  }

  submitNewPromptConfig(data:any): Observable<any>{
    const payload = {
       "view":"promptMangementConfig",
       "document": data
    }
    return this.http.post<any>(`${this.addNew}`,payload)
  }

    updatePromptConfig(id:string,data:any): Observable<any>{
    const payload = {
       "view":"promptMangementConfig",
          "filter":{
        "_id": id
    },
       "update": data
    }
    return this.http.post<any>(`${this.updateMany}`,payload)
  }

    markPromptItemAsInactive(id: string): Observable<any> {
    const payload = {
       "view":"promptMangementConfig",
          "filter":{
        "_id": id
    },
       "update": {
        "isActive": "I"
       }
    }

   return this.http.post<any>(`${this.updateMany}`,payload)
  }
}