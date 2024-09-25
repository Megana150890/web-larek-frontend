import { IPayment } from '../../types';
import { IEvents } from '../base/events';
import { Form } from './Form';

class FormPayment extends Form<IPayment> {
	protected _buttonsChoice: HTMLButtonElement[];
	protected _paymentSelect = false;
	protected _paymentValue = '';

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttonsChoice = Array.from(container.querySelectorAll('button[name="payment"]'));
		this._buttonsChoice.forEach((button) => {
			button.addEventListener('click', () => this.handleButtonClick(button));
		});
	}

	protected handleButtonClick(button: HTMLButtonElement) {
		this.toggleClass(button, 'button_alt-active');
		this.choiceChange(button);
		this._paymentSelect = true;
		this._paymentValue = button.name;
		this.events.emit('payment.button:change');
	}

	protected choiceChange(selectedButton: HTMLButtonElement) { //сбрасывает активный класс у всех кнопок, кроме выбранной
		this._buttonsChoice.forEach((button) => {
			if (button !== selectedButton) {
				button.classList.remove('button_alt-active');
			}
		});
	}

	set PaymentSelectedValue(value: string) {
		this._paymentValue = value;
	}

	get PaymentSelectedValue(): string {
		return this._paymentValue;
	}

	set paymentSelectedState(value: boolean) {
		this._paymentSelect = value;
	}

	get paymentSelectedState(): boolean {
		return this._paymentSelect;
	}

	set adress(value: string) {
      		(this.container.elements.namedItem('address') as HTMLInputElement).value =
      			value;
      	}

	resetPaymentSelection() { // сбрвсывает активный класс у кнопок и очищает
		this._buttonsChoice.forEach((button) => button.classList.remove('button_alt-active'));
		this._paymentSelect = false;
		this._paymentValue = '';
	}
}

