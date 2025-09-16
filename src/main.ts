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
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  template: `
  <app-loader></app-loader>
  <router-outlet></router-outlet>

  `,
  styleUrls: ['./app.component.css']
})
export class App  {

}

bootstrapApplication(App,appConfig);