import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {CategoriesType} from "../../../../types/categories.type";
import {createMask} from "@ngneat/input-mask";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input() title: string = '';
  @Input() button: string = '';
  @Input() form?: FormGroup;
  @Input() categories: CategoriesType[] = [];
  @Input() selectedService: string | undefined;
  @Input() description: string | undefined;
  @Input() services: { image: string; title: string; description: string; price: string; }[] = [];
  @Input() modalType: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() createRequest = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<void>();

  phoneInputMask = createMask('+7 (999) 999-99-99');

  close() {
    this.closeModal.emit();
  }

  closeModalAndCreateRequest() {
    this.createRequest.emit();
    this.formSubmitted.emit();

  }
}
