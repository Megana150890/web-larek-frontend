export interface ICard {
	id: string;
	description: string;
    price: number;
    image:string;
	title: string;
	category: string;
}

export interface ICatalog {
    cards: ICard[];
    preview: string;
}

export interface IPayment {
    payment: string;
    adress: string;
}

export interface IContacts {
    email: string;
    phone: string;
}

export interface IBasket {
listProduct: TProduct[]; // список продуктов
count: number; // количество товаров в корзине
product: string[]; // список названий продуктов
addProduct(items: TProduct): void; //добавляет продукт в корзину
deleteProduct(Id: string): void; //удаляет продукт из корзины по id
clearBasket(): void; //очищает корзину
}


export type TProduct = Pick<ICard, 'id' | 'title' | 'price'>;

export type TForm = IContacts & IPayment;