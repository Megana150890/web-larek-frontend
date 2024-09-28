import { IBasket, ICard } from '../types';
import { Model } from './base/Model';
import { TProduct } from '../types';
import { TTotal } from '../types';

export class BasketData extends Model<IBasket> {
	listProduct: ICard[] = []; //список продуктов
	count: number; //количество товаров в корзине
	products: string[] = []; //массив названий продуктов, которые добавлены в корзину
	total: number;

	addProduct(card: ICard): void {
		// добпавляет продукт в корзину

		const isProductInBasket = this.listProduct.some(
			(product) => product.id === card.id
		);
		if (!isProductInBasket) {
			this.listProduct.push(card);
			// this.toggleProductInBasket(card.id);
			// this.updateProductList();
			this.events.emit('basket:changed');
		}
	}

	deleteProduct(id: string): void {
		this.listProduct = this.listProduct.filter((element) => element.id !== id);
		// this.setIndex();
		// this.updateProductList();
		this.emitChanges('basket:changed', { listProduct: this.listProduct });
	}

	// toggleProductInBasket(id: string) { //не давет добавить повторно товар
	// 	if (!this.products.includes(id)) {
	// 		this.products.push(id);
	// 	} else {
	// 		this.products = this.products.filter((item) => item !== id);
	// 	}
	// }
	getTotal(): number {
		this.total = this.products.reduce((a, c) => {
			const item = this.listProduct.find((it) => it.id === c);
			if (!item || item.price === null) {
				return a;
			}
			return a + Number(item.price);
		}, 0);
		return this.total;
	}

	// setIndex() {
	// 	this.listProduct.forEach((product, index) => {
	// 		//обновляет каждый индекс продутка и количество товаров
	// 		product.index = index + 1;
	// 	});
	// 	this.count = this.listProduct.length;
	// }

	getOrderList(): TTotal {
		// возвращает объект с итоговой суммой и списком продуктов
		return {
			total: this.getTotal(),
			items: this.products,
		};
	}

	clearBasket() {
		this.listProduct = [];
		this.products = [];
		// this.setIndex();
		this.emitChanges('basket:changed', { listProduct: this.listProduct });
	}

	// updateProductList() {
	// 	this.products = this.listProduct.map((product) => product.id);
	// }

	// updateProductList() {
	// 	if (this.listProduct.length === 0) {
	// 		this.products = [];
	// 	} else {
	// 		this.products = this.listProduct.map((product) => product.id);
	// 	}
	// }
}
