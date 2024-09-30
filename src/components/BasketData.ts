import { IBasket, ICard } from '../types';
import { Model } from './base/Model';


export class BasketData extends Model<IBasket> {
	listProduct: ICard[] = []; //список продуктов
	count: number = 0; //количество товаров в корзине
	total: number;





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

	getTotal(): number {
		this.total = this.listProduct.reduce((a, c) => {
		if(!c || c.price === null){
			return a;
		} return a + Number (c.price);
	}, 0);
		return this.total;
	}



}
