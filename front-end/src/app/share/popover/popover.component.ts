import {
  Component,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from "@angular/core";
import { PopoverManagementService } from "src/app/services/popover-management.service";

@Component({
  selector: "app-popover",
  templateUrl: "./popover.component.html",
  styleUrls: ["./popover.component.scss"],
})
export class PopoverComponent implements OnInit {
  @HostBinding("style.top")
  @Input()
  top: string;

  @Input() id: string = "";

  isOpen = false;
  popover: any;

  constructor(private popoverManagementService: PopoverManagementService) {}

  async ngOnInit() {
    if (this.id)
      this.popover = await this.popoverManagementService.get(this.id);
  }

  @HostListener("click", ["$event"])
  click(e: MouseEvent) {
    e.stopPropagation();
    console.log(e);
  }
}
