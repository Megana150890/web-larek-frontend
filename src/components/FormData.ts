import { Model } from './base/Model';
import { TFormErrors } from '../types/index';
import { TForm } from '../types/index';
import { IFormData } from '../types/index';

export class FormData extends Model<IFormData> {
	order: TForm = {
		payment: '',
		adress: '',
		email: '',
		phone: '',
	};

	formErrors: TFormErrors = {};
	button: boolean = false;

	// constructor(data: Partial<IFormData>,  events: IEvents) {
	// 	super (data, events)
	// 	this.formErrors = data.formErrors || {};
	// 	this.order = data.order || {payment: '', adress: '', email: '', phone: ''}
	// this.button = data.button || false;
	// }

	setPayment(payment: string): void {
		this.order.payment = payment;
	}

	setAdress(adress: string): void {
		this.order.adress = adress;
	}

	setEmail(email: string): void {
		this.order.email = email;
	}

	setPhone(phone: string): void {
		this.order.phone = phone;
	}

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
		if (!this.order.adress) {
			errors.adress = 'Необходимо ввести адресс';
		}

		this.formErrors = errors; //сохранение ошибок
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
