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

Интерфейс для работы с формами

```
export interface IFormGeneral { // интерфейс для работы с формами
formErrors: TFormErrors; // объект с ошибками валидации
order: TForm; //данные формы заказа
button: boolean; //состояние кнопки
checkValidationPayment(error: string): void;
checkValidationContacts(error: string): void;
}
```

Тип для хранения ошибок форм

```
export type TFormErrors = Record<keyof TForm, string>;
```

Данные товара для добавления в корзину

```
export type TProduct = Pick<ICard, 'id' | 'title' | 'price'>;
```
Данные, используемые в формах

```
export type TForm = IContacts & IPayment;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   


### `Слой данных`

#### Класс CardsData

 Класс отвечает за хранение и логику работы с данными карточек(продуктов).\
Конструктор класса принимает инстант брокера событий\
 В полях класса хранятся следующие данные:
- _cards: ICard[]; - массив объектов карточек
- _preview: string;  здесь хранится Id выбранной карточки
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

#### Класс Basket
Класс отвечает за работу с корзиной.\
В полях класса хранятся следующие данные:
- listProduct: TProduct[] -  список продуктов
- count: number - количество товаров в корзине
- product: string[]-  список названий продуктов.

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- addProduct(items: TProduct): void- добавляет продукт в корзину
- deleteProduct(Id: string): void- удаляет продукт из корзины по id
- clearBasket(): void- очищает корзину

#### Класс IFormGeneral
Класс отвечает за работу с формами.\
В полях класса хранятся следующие данные:
- formErrors: TFormErrors - объект с ошибками валидации
- order: TForm - данные формы заказа
- button: boolean - состояние кнопки

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- checkValidationPayment(error: string): void - выполняют валидацию формы Payment.
- checkValidationContacts(error: string): void - выполняют валидацию формы Contacts.


### `Классы представления`
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует класс модальное окно, общее для всех форм, внутри меняются только темплейты. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. 

- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет найдено модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс Basket 

Класс расширяет класс Modal и отвечает за отображение модального окна корзины.
В полях класса отображены: 
- list: HTMLElement - список для отображения карточек(товаров)
- button: HTMLButtonElement - кнопка для оформелния заказа
- total: HTMLElement - общая стоимость всех товаров

Методы:
- 
