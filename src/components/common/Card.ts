import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index: HTMLElement;
	protected _id: HTMLElement;

	constructor(
		protected containerName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._description = container.querySelector('.card__text');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector('.card__image');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._index = container.querySelector('.basket__item-index');
		this._button = container.querySelector(
			'.card__button'
		) as HTMLButtonElement | null;

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number) {
		value === null
			? this.setText(this._price, 'Бесценно')
			: this.setText(this._price, `${value} синапсов`);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set button(element: HTMLButtonElement) {
		this._button = element;
	}

	// get button(): HTMLButtonElement {
	// 	return this.button;
	// }

	setCategory() {
		switch (true) {
			case this._category.textContent === 'софт-скил':
				this._category.classList.add('card__category_soft');
				break;
			case this._category.textContent === 'другое':
				this._category.classList.add('card__category_other');
				break;
			case this._category.textContent === 'хард-скил':
				this._category.classList.add('card__category_hard');
				break;
			case this._category.textContent === 'дополнительное':
				this._category.classList.add('card__category_additional');
				break;
			case this._category.textContent === 'кнопка':
				this._category.classList.add('card__category_button');
				break;
		}
	}
}
