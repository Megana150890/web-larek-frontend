export interface ICard {
	id: string;
    category: string;
	description: string;
    price: number | null;
    image:string;
	title: string;
	
}

export interface ICatalog {
    catalog: ICard[];
    preview: string;  //здесь хранится Id выбранной карточки
    button: boolean;
    setCatalog( items: ICard[]): void; //метод для обновления каталога карточек
     setPreview( items: ICard): void; //метод для установки картоки для предпросмотра
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
total: number;
addProduct(items: TProduct): void; //добавляет продукт в корзину
deleteProduct(Id: string): void; //удаляет продукт из корзины по id
clearBasket(): void; //очищает корзину
getTotal(): number
}

export interface IFormData { // интерфейс для работы с формамами
formErrors: TFormErrors; // объект с ошибками валидации
order: TForm; //данные формы заказа
button: boolean; //состояние кнопки
checkValidationPayment(error: string): void;
checkValidationContacts(error: string): void;
}

export interface IOrder {
    items: string[];
	phone: string;
	email: string;
	address: string;
	payment: string;
	total: number;
}


export type TFormErrors = Partial<Record<keyof TForm, string>>; //создаёт объект, где ключами являются поля формы TForm, а значениями — строки (ошибки)

export type TProduct = Pick<ICard, 'id' | 'title' | 'price'>;

export type TForm = IPayment &  IContacts ;

export interface IPage {
    cartCounterElement: HTMLElement; //элемент, отображающий количество товаров в корзине
    catalog: HTMLElement[] //галлерея товаров
    cartButtonElement: HTMLElement; // кнопка для открытия корзины.
}

