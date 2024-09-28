import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { TProduct } from '../../types';
import { createElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

import { ensureElement } from '../../utils/utils';

interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface IBasketView {
	list: HTMLElement[];
	title: HTMLElement;
	total: HTMLElement;
	button: HTMLButtonElement;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	// buttonDisable(state: boolean) {
	// 	this.setDisabled(this._button, state);
	// }
}


