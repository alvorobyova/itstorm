import {ElementRef, inject, Injectable, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private dialog = inject(MatDialog);
  private router = inject(Router);

  dialogRef: MatDialogRef<any> | null = null;

  openPopup(popupTemplate: TemplateRef<ElementRef>) {
    this.dialogRef = this.dialog.open(popupTemplate);
    this.dialogRef.backdropClick()
      .subscribe(() => {
        // this.dialogRef?.close();
        this.router.navigate(['/']);

        // this.closePopup();
      });

  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
    // window.location.reload();
  }
}
