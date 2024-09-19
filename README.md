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
     button: boolean;
     setCatalog( items: ICard[]): void;
     setPreview( items: ICard): void;
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

## `Архитектура приложения`

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### `Базовый код`

#### `Класс Api`
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### `Класс EventEmitter`
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### `Класс Model`
Абстрактный класс для управления данными и событиями в приложении.

#### `Класс Component` 
Класс дженерик, предназначен для использования в качестве базового класса для создания компонентов пользовательского интерфейса. Он содержит методы для работы с компонентами отображения. Содержит метод render() -метод рендеринга элемента и методы для работы с элементами. Он принимает контейнер HTMLElement, который будет использоваться для отображения компонента.\


### `Слой данных`

#### `Класс CardsData`

 Класс отвечает за хранение и логику работы с данными карточек(продуктов).\
Конструктор класса принимает инстант брокера событий\
 В полях класса хранятся следующие данные:
- catalog: ICard[]; - массив объектов карточек
- preview: string | nill;  здесь хранится Id выбранной карточки
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

#### `Класс BasketGeneral`
Класс отвечает за работу с корзиной.\
В полях класса хранятся следующие данные:
- listProduct: TProduct[] -  список продуктов
- count: number - количество товаров в корзине
- product: string[]-  список названий продуктов.

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- addProduct(items: TProduct): void- добавляет продукт в корзину
- deleteProduct(Id: string): void- удаляет продукт из корзины по id
- clearBasket(): void- очищает корзину

#### `Класс IFormGeneral`
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

#### `Класс Page`
Это класс главной страницы. Расширяет базовый класс Component. Показывает галлерею товаров,  элемент счётчика товаров в корзине, и иконка корзины, при нажатии на которую открывается модальное окно с содержимым корзины.

Поля:
- cartCounterElement: HTMLElement; //элемент, отображающий количество товаров в корзине
- catalog: HTMLElement[] //галлерея товаров
- cartButtonElement: HTMLElement — кнопка для открытия корзины
- _wrapper - обертка страницы

Методы:
- set counter() - устанавливает значение счетчика товаров в корзине
- set catalog() - устанавливает элементы каталога товаров
- set locked() - сеттер для состония основного контента

#### `Класс Modal`
Реализует класс модальное окно, общее для всех форм, внутри меняются только темплейты. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. 

- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет найдено модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### `Класс Basket` 

Класс расширяет класс Modal и отвечает за отображение модального окна корзины.
В полях класса отображены: 
- list: HTMLElement - список для отображения карточек(товаров)
- submitButton: HTMLButtonElement - кнопка для оформелния заказа
- total: HTMLElement - общая стоимость всех товаров

Методы:
- set items() - сеттер для установелния товаров в корзине
- set total() - устанавливает общую стоимость
- set selected() -устанавливает состояние кнопки

#### `Класс Card`
Класс отвечает за отображение карточки. В нем содержится категория, цена, название, изображение, описание. Класс используется для отображения всех карточек на главной странице. В конструктор передается DOM-элемент темплейта- это позволяет  формировать карточки разных вариантов верстки.\

Поля класса содержат элементы разметки карточки.\
- _description - пояснение
- _price - цена картчоки
- _title - название карточки
- _category - категория
- _image 

В методах отображены все методы - сеттеры для всех свойств карточки.

#### `Класс Form`
Общий класс для форм, который овтечает за валидацию и отображение ошибок

Поля класса содержат:
- _errors:HTMLElement - элемент для отображения ошибок
- submitButton: HTMLButtonElement - кнопака для подтверждения

В методах отображены все методы - сеттеры для установки валидации формы и ошибок

#### `Класс FormPayment` 
Расширяет класс Form. Содержит поля данных о форме оплаты и адресе доставки.\

Поля класса содержат:
- _buttons: HTMLButtonElement[]; - массив кнопок(онлайн/при получении)
- _isPaymentSelected: boolean = false; - первоначальное состояние кнопок, когда не выбран метод оплаты

Методы- сеттеры для установки данных из поля address и сеттер для установки кнопки\
Конструктор: constructor(container: HTMLFormElement, events: IEvents)

#### `Класс FormContacts`
Расширяет класс Form. Содержит поля данных о почте и телефоне.\
Конструктор: constructor(container: HTMLFormElement, events: IEvents)\
Методы -сеттеры  для установки значений phone и email.

#### `Класс SucsessOrder`
Реализует класс модальное окно, отвечающее за успешный заказ.
Расширяеть класс Modal. На кнопку вешается слушатель событияю

Поля класса:
- _description: HTMLElement - 
- buttonSucsess: HTMLButtinElement - кнопка

Методы:
- setTotal -  который устанавливает значение итоговой суммы заказа

### `Слой коммуникации`

#### `Класс AppApi`
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## `Взаимодействие компонентов`
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `cards:changed` - изменение массива карточек
- `preview:changed` -изменение выбранной для просотра карточки
- `basket: changed` - изменение в корзине
- `formErrors:change` - вызывается в форме и возвращает ошибки
- `form:reset` - очитска форм
- `order:validation` - состояние формы заказа, если все поля заполнены правильно
- `contacts:validation` - состояние формы контактных данных, если все поля заполнены правильно

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*

- `modal: open` - открытие модального окна
- `modal: close` - закрытие модального окна
- `order: open` - открытие модального окна заказа,  вызывается при нажатии на кнопку оформить в корзине
- `order.button: sucsess` - кнопка подтверждения успешного выполненного заказа
- `card:add` - добавление товара в корзину
- `сard: delete` - удаление товара из корзины
- `basket: open` - открытие модального окна корзины
- `card:select` - выбор карточки для отображения в модальном окне
- `contacts:submit` - кнопка подтверждения контактных данных
- `order:submit` - кнопка подтверждения  оплаты
- `order.address:change` - изменение поля ввода адреса
- `contacts.phone.change` - именение в поле ввода телефона
- `contacts.email.change` - именение в поле ввода почты
- `payment.button:change` - вызывается при изменении способа оплаты в форме заказа
