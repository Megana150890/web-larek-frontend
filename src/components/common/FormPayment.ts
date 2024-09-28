import { IPayment } from '../../types';
import { IEvents } from '../base/events';
import { Form } from './Form';


export class FormPayment extends Form<IPayment> {
	protected _buttonsChoice: HTMLButtonElement[];
	protected _paymentSelect: boolean = false;
	protected _paymentValue: string = '';

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttonsChoice = Array.from(container.querySelectorAll(`button[name]`));
		
		this._buttonsChoice.forEach((button) => {
			button.addEventListener('click', () => {
				this.handlePaymentSelection(button);
			});
		});
	}

	// Устанавливаем выбранное значение оплаты
	set PaymentSelectedValue(value: string) {
		this._paymentValue = value;
	}

	// Возвращаем выбранное значение оплаты
	get PaymentSelectedValue(): string {
		return this._paymentValue;
	}

	// Устанавливаем состояние выбора оплаты
	set paymentSelectedState(value: boolean) {
		this._paymentSelect = value;
	}

	// Возвращаем состояние выбора оплаты
	get paymentSelectedState(): boolean {
		return this._paymentSelect;
	}

	// Устанавливаем значение адреса
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	// Сброс выбора оплаты
	resetPaymentSelection() {
		this._buttonsChoice.forEach((button) => {
			button.classList.remove('button_alt-active');
		});
		this._paymentSelect = false;
		this._paymentValue = '';
	}

	// Обработка выбора кнопки
	private handlePaymentSelection(button: HTMLButtonElement) {
		this.resetPaymentSelection(); // Сбрасываем все выборы
		this.toggleClass(button, 'button_alt-active');
		this._paymentSelect = true;
		this._paymentValue = button.name;
		this.events.emit('order.button:change');
	}
}
