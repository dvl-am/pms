import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class LoaderService {
  apiLoader = new BehaviorSubject<boolean>(false);
  isError = new BehaviorSubject<any>({ message: "", status: "" });

  setLoading(value: boolean) {
    this.apiLoader.next(value);
  }
}
