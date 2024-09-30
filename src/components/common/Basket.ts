import { Component } from '../base/Component';
import { IEvents } from '../base/events';
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
		this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

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
		this.updateButtonState(total); // Обновляем состояние кнопки при изменении total
	}

	buttonDisable(state: boolean) {
		this.setDisabled(this._button, state);
	}

	updateButtonState(total: number): void {
		// Если стоимость корзины 0, деактивируем кнопку
		if (total === 0) {
			this.buttonDisable(true);  // Деактивировать кнопку
		} else {
			this.buttonDisable(false);  // Активировать кнопку
		}
	}


}