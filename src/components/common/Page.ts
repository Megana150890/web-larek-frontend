import { Component } from '../base/Component';
import { IPage } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Page extends Component<IPage> {
	protected _cartCounterElement: HTMLElement;
	// protected _catalog: HTMLElement;
	protected _cardList: HTMLElement;
	protected _cartButtonElement: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _count: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._cartCounterElement = ensureElement('.header__basket-counter');
		this._cardList = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._cartButtonElement = ensureElement<HTMLElement>('.header__basket');
		this._cartButtonElement.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set cartCounterElement(value: number) {
		this.setText(this._cartCounterElement, String(value));
	}

	set cardList(items: HTMLElement[]) {
		this._cardList.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked'); // Добавляет класс блокировки
		} else {
			this._wrapper.classList.remove('page__wrapper_locked'); // Убирает класс блокировки
		}
	}
}
