import { IBasket } from '../types';
import { Model } from './base/Model';
import { TProduct } from '../types';
import { IEvents } from './base/events';

export class BasketData extends Model<IBasket> {
	listProduct: TProduct[] = []; //список продуктов
	count: number = 0; //количество товаров в корзине
	product: string[] = []; //массив названий продуктов, которые добавлены в корзину
	total: number;

	constructor(data: Partial<IBasket>, events: IEvents) {
		super(data, events);
		this.listProduct = data.listProduct || [];
		this.count = this.listProduct.length;
		this.product = this.listProduct.map((item) => item.title);
	}

	addProduct(item: TProduct): void {
		this.listProduct.push(item);
		this.product.push(item.title);
		this.count = this.listProduct.length;
		this.events.emit('basket: changed', {listProduct: this.listProduct});
	}

	deleteProduct(id: string): void {
		this.listProduct = this.listProduct.filter((item) => item.id !== id);
		this.product = this.listProduct.map((item) => item.title); //обновляет список продуктов после удаления
		this.count = this.listProduct.length;
		this.events.emit('basket: changed', {listProduct: this.listProduct});
	}

	clearBasket(): void {
		this.listProduct = [];
		this.product = [];
		this.count = 0;
		this.events.emit('basket: changed', {listProduct: this.listProduct});
	}

	getTotal(): number {
		return this.listProduct.reduce((total, item) => total + item.price, 0);
	}
}
