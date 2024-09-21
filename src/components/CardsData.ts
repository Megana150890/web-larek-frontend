import { ICatalog } from '../types/index';
import { Model } from './base/Model';
import { ICard } from '../types/index';
import { IEvents } from './base/events';

export class CardsData extends Model<ICatalog> {
	catalog: ICard[];
	preview: string | null; //id карточки для просмотра
	button: boolean;

	constructor(data: Partial<ICatalog>, events: IEvents) {
		super(data, events); //вызывает конструктор родительского класса
		this.catalog = data.catalog || [];
		this.preview = data.preview || '';
		this.button = data.button || false;
	}

	setCatalog(items: ICard[]): void {
		//метод для обновления каталога карточек
		this.catalog = items;
		this.events.emit('cards:changed', {catalog: this.catalog});
	}
	setPreview(item: ICard): void {
		//метод для установки картоки для предпросмотра
		if (item) {
			this.preview = item.id; //устанавливаем id карточки
		} else {
			this.preview = null;
		}

		this.events.emit('preview:changed', item);
	}

	// toggleButton(state: boolean) {
	//     this.button = state;
	// }
}
