import { ICatalog } from '../types/index';
import { Model } from './base/Model';
import { ICard } from '../types/index';
import { IEvents } from './base/events';

export class CardsData extends Model<ICatalog> {
	catalog: ICard[];
	preview: string | null; //id карточки для просмотра
	// preview: ICard | null
	button: boolean;

	

	setCatalog(items: ICard[]) {
		//метод для обновления каталога карточек
		this.catalog = items;
		this.events.emit('cards:changed');
	}


	setPreview(item: ICard) {
		this.preview = item.id;
		this.events.emit('preview:changed', item);
	}

	getPreview() {
		return this.preview;
	  }
	

	   getCard(id: string): ICard | undefined {
        return this.catalog.find(item => item.id === id);
    }

}
