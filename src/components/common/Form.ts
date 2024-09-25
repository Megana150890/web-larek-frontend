import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IFormError {
	validate: boolean;
	errors: string[];
}

export class Form<T> extends Component<IFormError> {
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor( protected container:  HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submitButton = container.querySelector<HTMLButtonElement>(
			'button[type=submit]'
		);
		this._errors = container.querySelector('.form__errors');

		this.container.addEventListener('input', (evt) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.inputChange(field, value);
		});

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	set validate(value: boolean) {
		this._submitButton.disabled = !value; //Если value (true), кнопка будет активной, так как !value будет false.
	}

	protected inputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

    render(data: Partial<T> & IFormError) {
		const { validate, errors, ...inputs } = data;
		super.render({ validate, errors }); //передает в род.класс валидоность и ошибки
		Object.assign(this, inputs); //обновляем поля формы на основе переданных данных
		return this.container;
	}
}
