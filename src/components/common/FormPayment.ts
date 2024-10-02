import { IPayment } from '../../types';
import { IEvents } from '../base/events';
import { Form } from './Form';


export class FormPayment extends Form<IPayment> {
	protected _buttonsChoice: HTMLButtonElement[];
	protected _paymentSelectedState: boolean;
	protected _paymentValue: string;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttonsChoice = Array.from(container.querySelectorAll(`button[name]`));
		
		this._buttonsChoice.forEach((button) => {
			button.addEventListener('click', () => {
				this.toggleClass(button, 'button_alt-active');;
				this.choiceChange(
					button,
					this._buttonsChoice.find((b) => b !== button)
				);

				this._paymentSelectedState = true;
				this._paymentValue = button.name;
				this.events.emit('order.button:change');
			});
		});
	}

	set PaymentSelectedValue(value: string) {
		this._paymentValue = value;
	}
	get PaymentSelectedValue(): string {
		return this._paymentValue;
	}

	set paymentSelectedState(value: boolean) {
		this._paymentSelectedState = value;
	}

	get paymentSelectedState(): boolean {
		return this._paymentSelectedState;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	resetPaymentSelection() {
		this._buttonsChoice.forEach((button) => {
			button.classList.remove('button_alt-active');
		});
		this._paymentSelectedState = false;
		this._paymentValue = '';
	}
	choiceChange(
		selectedButton: HTMLButtonElement,
		otherButton: HTMLButtonElement
	) {
		if (selectedButton.classList.contains('button_alt-active')) {
			otherButton.classList.remove('button_alt-active');
		}
	}

}
