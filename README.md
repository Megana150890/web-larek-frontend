# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Данные и типы данных, используемые в приложении

Карточка товара

```
export interface ICard {
	id: string;
	description: string;
    price: number;
    image:string;
	title: string;
	category: string;
}
```
Интерфейс для модели данных карточек

```
export interface ICatalog {
    cards: ICard[];
    preview: string;
}
```

Интерфейс для оплаты товара

```
export interface IPayment {
    payment: string;
    adress: string;
}
```
Интерфейс контактных данных покупателя

```
export interface IContacts {
    email: string;
    phone: string;
}
```

Интерфейс корзины

```
export interface IBasket {
listProduct: TProduct[]; // список продуктов
count: number; // количество товаров в корзине
product: string[]; // список названий продуктов
addProduct(items: TProduct): void; //добавляет продукт в корзину
deleteProduct(Id: string): void; //удаляет продукт из корзины по id
clearBasket(): void; //очищает корзину
}
```

Данные товара для добавления в корзину

```
export type TProduct = Pick<ICard, 'id' | 'title' | 'price'>;
```
Данные, используемые в формах

```
export type TForm = IContacts & IPayment;
```