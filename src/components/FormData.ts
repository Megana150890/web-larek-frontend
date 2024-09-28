import { Model } from './base/Model';
import { TFormErrors } from '../types/index';
import { TForm } from '../types/index';
import { IFormData } from '../types/index';

export class FormData extends Model<IFormData> {
	order: TForm = {
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	formErrors: TFormErrors = {};
	button: boolean = false;

	setFormPayment(field: keyof TForm, value: string) {
		this.order[field] = value;

		if (this.checkValidationPayment()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setFormContacts(field: keyof TForm, value: string) {
		this.order[field] = value;
		if (this.checkValidationContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}
	// setPayment(payment: string): void {
	// 	this.order.payment = payment;
	// }

	// setAdress(adress: string): void {
	// 	this.order.address = adress;
	// }

	// setEmail(email: string): void {
	// 	this.order.email = email;
	// }

	// setPhone(phone: string): void {
	// 	this.order.phone = phone;
	// }

	checkValidationContacts() {
		const errors: typeof this.formErrors = {}; // Инициализация объекта ошибок

		if (this.order.email) {
			errors.email = 'Необходимо ввести почту';
		}
		if (this.order.phone) {
			errors.phone = 'Необходимо ввести телефон';
		}
		this.formErrors = errors; //сохранение ошибок
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0; //если нет ошибок, возращает true , форма валидна
	}

	checkValidationPayment() {
		const errors: typeof this.formErrors = {};
		
		if (this.order.payment) {
			errors.payment = 'Не выбран способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо ввести адресс';
		}

		this.formErrors = errors; //сохранение ошибок
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	resetForm() { 
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
		this.button = false;
		this.formErrors = {};
		this.events.emit('form:reset');
	}

}
