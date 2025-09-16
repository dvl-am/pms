import { Component, OnInit } from "@angular/core";
import { LoaderService } from "../../services/loader/loader.service";

@Component({
  selector: "app-loader",
  standalone: true,
  imports: [],
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.css",
})
export class LoaderComponent implements OnInit {
  showLoader = false;
  showError = false;
  errorStatus: any = { message: "", status: "" };

  constructor(private readonly loaderService: LoaderService,) { }

  ngOnInit(): void {
    this.loaderService.apiLoader.subscribe((loaderState: boolean) => {
      this.showLoader = loaderState;
    });

    this.loaderService.isError.subscribe((errorDetails: any) => {
      this.errorStatus = {
        ...this.errorStatus,
        message: errorDetails?.message,
        status: errorDetails?.status,
      };
      this.onError();
    });
  }

  onError() {
    if (this.errorStatus.message && this.errorStatus.message !== "") {
      this.showError = true;

      const alertData = {
        type: "Error",
        defaultMessage: this.errorStatus.message,
        title: "ALERT",
        primaryButtonName: "",
        secondaryButtonName: "",
      };
      
   
    }
  }

  closeErrorDialog() {
    this.showError = false;
  }
}
