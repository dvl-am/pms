import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  apiUrl = "";
  env = "";
  configObj: any;
  liquidUrl = "";


  constructor(private readonly httpClient: HttpClient) { }

  ensureInit(): Promise<unknown> {
    return new Promise((r, e) => {
      this.httpClient.get("assets/jsons/config.json").subscribe(
        (content) => {
          Object.assign(this, content);
          this.configObj = content;
          r(this);
        },
        (reason) => e(reason)
      );
    });
  }
  getAPIURL(isPrefixURL: boolean, prefixURLKey: string, mainURL: string) {
    if (isPrefixURL) {
      return `${this.configObj[prefixURLKey]}${this.configObj[mainURL]}`;
    } else {
      console.log('${this.configObj[mainURL]} : ', `${this.configObj[mainURL]}`)
      return `${this.configObj[mainURL]}`;
    }
  }
}
