import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Overlay, OverlayModule } from "@angular/cdk/overlay";
import { PopoverComponent } from "./popover.component";
import { MatIconModule } from "@angular/material/icon";
import { TrustHTMLModule } from "../trust-html/trust-html.module";

@NgModule({
  imports: [CommonModule, OverlayModule, MatIconModule, TrustHTMLModule],
  declarations: [PopoverComponent],
  exports: [PopoverComponent],
  providers: [Overlay],
})
export class PopoverModule {}
