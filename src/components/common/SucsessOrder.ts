import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface ISucsessOrder {
	total: string;
}

export class SucsessOrder extends Component<ISucsessOrder> {
	protected _button: HTMLButtonElement;
	protected _decription: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
		this._decription = ensureElement<HTMLElement>('.order-success__description', this.container);
		this._button.addEventListener('click', () =>
			this.events.emit('order.button: sucsess')
		);
	}
	set total(items: string) {
		this.setText(this._decription, items);
	}
}
