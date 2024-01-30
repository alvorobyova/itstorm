import {FormGroup} from "@angular/forms";

export type ModalDataType = {
  title: string,
  form?: FormGroup,
  button: string,
  selectedService?: string | undefined,
  description?: string | undefined
}
