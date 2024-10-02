import { IBasket, ICard } from '../types';
import { Model } from './base/Model';


export class BasketData extends Model<IBasket> {
	listProduct: ICard[] = []; //список продуктов
	count: number = 0; //количество товаров в корзине


	getCardsId(): string[] {
		return this.listProduct.map(card => card.id)
	  }

	addProduct(card: ICard): void {
		// добавляет продукт в корзину
		const isProductInBasket = this.listProduct.some(
			(product) => product.id === card.id
		);
		if (!isProductInBasket) {
			this.listProduct.push(card);
			this.updateCount()
			this.events.emit('basket:changed');
		}
	}

	deleteProduct(id: string): void {
		this.listProduct = this.listProduct.filter((element) => element.id !== id);
	
		this.updateCount()
		this.emitChanges('basket:changed', { listProduct: this.listProduct });
	}

// Метод для обновления количества товаров в корзине
updateCount(): void {
    this.count = this.listProduct.length;
	this.emitChanges('basket:changed', {count: this.count});
}

	 getTotalBasketPrice() {
		return this.listProduct.reduce((sum, next) => sum + next.price, 0);
	}


	clearBasket() {
		this.listProduct= [];
		this.count = 0;
		this.events.emit('basket:changed')
	}
}
