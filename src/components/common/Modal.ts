import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModal {
content: HTMLElement
}

export class Modal extends Component<IModal> {
    _container: HTMLElement;
    _closeButton: HTMLButtonElement
    _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
        this._container = container;
        this._content = container.querySelector('.modal__content');
        this._closeButton = container.querySelector('.modal__close');
        this._closeButton.addEventListener('click' ,this.close.bind(this))
        this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this.content.replaceChildren(value)
    }

open() {
    this.container.classList.add('.modal_active')
    this.events.emit('order: open')
}

    close() {
        this.container.classList.remove('.modal_active');
        this.events.emit('modal: close');
      }

      render(data: IModal): HTMLElement {
		super.render(data) // Устанавливаем новое содержимое модального окна
		this.open();
		return this._container;
	}
} 