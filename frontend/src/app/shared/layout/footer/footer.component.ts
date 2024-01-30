import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalDataType} from "../../../../types/modal-data.type";
import {RequestType} from "../../../../types/request.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestsService} from "../../services/requests.service";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  private fb = inject(FormBuilder);
  private requestService = inject(RequestsService);
  private hotToastService = inject(HotToastService);

  callForm: FormGroup;
  showModal: boolean = false;
  modalType: string = '';
  modalData: ModalDataType = {title: '', button: '', form: undefined, selectedService: undefined};

  constructor() {
    this.callForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[А-Яа-я\s]*$/)]],
      phone: ['', Validators.required],
      type: ['consultation']
    });
    this.showModal = false;

  }

  openModal(type: string) {

    this.modalType = type;
    this.showModal = true;

    switch (type) {
      case 'thanks':
        this.modalData = {
          title: 'Спасибо за вашу заявку!',
          description: 'Мы свяжемся с вами при первой же возможности.',
          button: 'Ок',
          selectedService: undefined
        };
        break;
      case 'call':
        this.modalData = {
          title: 'Закажите бесплатную консультацию!',
          form: this.callForm,
          button: 'Заказать звонок',
          selectedService: undefined
        };
        break;
      default:
        this.showModal = false;
        break;
    }
  }

  createRequest() {
    if (this.callForm.valid && this.callForm.value.name && this.callForm.value.phone) {
      const requestParams: RequestType = {
        name: this.callForm.value.name,
        phone: this.callForm.value.phone,
        type: 'consultation',
      };

      this.requestService.createRequest(requestParams)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this.hotToastService.error(data.message);
            }

            this.showModal = false;
            this.callForm.reset();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              console.log(errorResponse.message);
              this.hotToastService.error('Произошла ошибка при отправке формы, попробуйте еще раз.');
            } else {
              this.hotToastService.error('Ошибка при оформлении заказа!');
            }
          }
        });
    } else {
      this.callForm.markAllAsTouched();
      this.hotToastService.warning('Необходимо заполнить все поля!');
    }
  }

  closeModal() {
    this.showModal = false;
  }

  formSubmitted() {
    this.showModal = false; //
    setTimeout(() => {
      this.openModal('thanks');
    }, 200);
  }
}
