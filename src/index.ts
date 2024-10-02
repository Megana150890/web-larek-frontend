import { ICard, IContacts} from './types/index';
import { CardsData } from './components/CardsData';
import { FormData } from './components/FormData';
import { BasketData } from './components/BasketData';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { AppApi } from './components/base/api';
import { Card } from './components/common/Card';
import { Page } from './components/common/Page';
import { ICatalog } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { FormPayment } from './components/common/FormPayment'; 
import { IPayment } from './types/index';
import { TForm } from './types/index';
import { FormContacts } from './components/common/FormContacts';
import { SucsessOrder } from './components/common/SucsessOrder';




const events = new EventEmitter();
const page = new Page(document.body, events);
events.onAll((event) => {
    console.log(event.eventName, event.data);
});


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate= ensureElement<HTMLTemplateElement>('#card-preview');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const sucsessTemplate = ensureElement<HTMLTemplateElement>('#success');


const basketData = new BasketData({}, events);
const cardsdData = new CardsData({}, events);
const formData = new FormData({}, events);

const modal = new  Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), {
	onClick: () => {
		events.emit('order:open');
	},
});
const order = new FormPayment (cloneTemplate(orderTemplate), events);
const contacts = new FormContacts(cloneTemplate(contactsTemplate), events)
const sucsess = new SucsessOrder(cloneTemplate(sucsessTemplate), events)




const api = new AppApi(CDN_URL, API_URL);
// Получаем карточки с сервера
api
	.getCatalogApi()
	.then(cardsdData.setCatalog.bind(cardsdData))
	.catch((err) => {
		console.error(err);
	});

//



    events.on('cards:changed', () => {
       page.cardList = cardsdData.catalog.map((item) => {
            const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
                onClick: () => events.emit('card:select', item),
            });
            card.title = item.title;
            card.category = item.category;
            card.image = item.image;
            card.price = item.price + ' ' ;
            card.setCategory();
            return card.render();
        });
    });



events.on('card:select', (item: ICard) => {
	cardsdData.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
	const cardinModal = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
// modal.render({ content: cardinModal.render(card) })
modal.render({
    content: cardinModal.render({
        title: item.title,
        image: item.image,
        category: item.category,
        description:item.description,
        price: item.price ,
        id: item.id,
    }),
});

// cardinModal.setCategory();


});


events.on('card:add', (card: ICard) => {
    basketData.addProduct(card)
})

events.on('сard:delete', (card: ICard) => {
    basketData.deleteProduct(card.id)
})

events.on('basket:changed', () => {
	const cardArray = basketData.listProduct.map((item, index) => {

		const card = new Card ('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('сard:delete', item),
		});
	

		return card.render({
			title: item.title,
			index: index + 1,
			price: item.price  ,
		});
	});


basket.items = cardArray;
console.log(cardArray);
console.log(basketData.listProduct)
    basket.total =  basketData.getTotalBasketPrice();

    page.cartCounterElement =  basketData.count;
	
});



    events.on('basket:open', () => {
        modal.render({
            content: basket.render(),
        });
    });


    events.on('order:open', () => {
        modal.render({
            content: order.render({
                payment: '',
                address: '',
                valid: false,
                errors: [],
            }),
        });
    });

    
    
    events.on('order.button:change', () => {
        formData.order.payment = order.PaymentSelectedValue;
        formData.checkValidationPayment();
        if (formData.button && formData.order.address) {
            events.emit('order:validation', formData.order);
        }
    });


    
events.on(
	'order.address:change',
	(data: { field: keyof IPayment; value: string }) => {
		formData.setFormPayment(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContacts; value: string }) => {
		formData.setFormContacts(data.field, data.value);
	}
);


events.on('formErrors:change', (errors: Partial<TForm>) => {
	const { email, phone, address, payment: button } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(';');

	order.paymentSelectedState && (order.valid = !address);
	order.errors = Object.values({ address, button })
		.filter((i) => !!i)
		.join(';');
});


events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors:[],
        }),
    })
})

 
events.on('contacts:submit', () =>{
 
    api.postOrder({
        items: basketData.getCardsId(),
        total: basketData.getTotalBasketPrice(),
        ...formData.order
      })
      .then(() => {
        modal.render({
            content: sucsess.render({
                total: `Списано ${basketData.getTotalBasketPrice()} синапсов`,
				}),
            })
        })
        //   basketData.clearBasket();
} )

events.on('order.button: sucsess', () => {
        basketData.clearBasket();
    modal.close();
})


//проверки

// const producttlist =
//     [
//             {
//                 "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
//                 "description": "Если планируете решать задачи в тренажёре, берите два.",
//                 "image": "/5_Dots.svg",
//                 "title": "+1 час в сутках",
//                 "category": "софт-скил",
//                 "price": 750
//             },
//             {
//                 "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
//                 "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
//                 "image": "/Shell.svg",
//                 "title": "HEX-леденец",
//                 "category": "другое",
//                 "price": 1450
//             },
//             {
//                 "id": "b06cde61-912f-4663-9751-09956c0eed67",
//                 "description": "Будет стоять над душой и не давать прокрастинировать.",
//                 "image": "/Asterisk_2.svg",
//                 "title": "Мамка-таймер",
//                 "category": "софт-скил",
//                 "price": null
//             },
//             {
//                 "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
//                 "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
//                 "image": "/Soft_Flower.svg",
//                 "title": "Фреймворк куки судьбы",
//                 "category": "дополнительное",
//                 "price": 2500
//             },
//             {
//                 "id": "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
//                 "description": "Если орёт кот, нажмите кнопку.",
//                 "image": "/mute-cat.svg",
//                 "title": "Кнопка «Замьютить кота»",
//                 "category": "кнопка",
//                 "price": 2000
//             },
//             {
//                 "id": "f3867296-45c7-4603-bd34-29cea3a061d5",
//                 "description": "Чтобы научиться правильно называть модификаторы, без этого не обойтись.",
//                 "image": "Pill.svg",
//                 "title": "БЭМ-пилюлька",
//                 "category": "другое",
//                 "price": 1500
//             },
//             {
//                 "id": "54df7dcb-1213-4b3c-ab61-92ed5f845535",
//                 "description": "Измените локацию для поиска работы.",
//                 "image": "/Polygon.svg",
//                 "title": "Портативный телепорт",
//                 "category": "другое",
//                 "price": 100000
//             },
//             {
//                 "id": "6a834fb8-350a-440c-ab55-d0e9b959b6e3",
//                 "description": "Даст время для изучения React, ООП и бэкенда",
//                 "image": "/Butterfly.svg",
//                 "title": "Микровселенная в кармане",
//                 "category": "другое",
//                 "price": 750
//             },
//             {
//                 "id": "48e86fc0-ca99-4e13-b164-b98d65928b53",
//                 "description": "Очень полезный навык для фронтендера. Без шуток.",
//                 "image": "Leaf.svg",
//                 "title": "UI/UX-карандаш",
//                 "category": "хард-скил",
//                 "price": 10000
//             },
//             {
//                 "id": "90973ae5-285c-4b6f-a6d0-65d1d760b102",
//                 "description": "Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.",
//                 "image": "/Mithosis.svg",
//                 "title": "Бэкенд-антистресс",
//                 "category": "другое",
//                 "price": 1000
//             }
//         ]

// cardsdData.catalog = producttlist;

// const testSection = document.querySelector('.gallery');

// const card = new Card('card', cardCatalogTemplate);

// cardsdData.setCatalog(producttlist);
// console.log(cardsdData.getCards())
// console.log(cardsdData.getCard("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"))
// console.log(cardsdData.getCard("c101ab44-ed99-4a54-990d-47agtgha2bb4e7d9"))

// basketData.addProduct({id: '848e86fc0-ca99-4e13-b164-b98d65928b53', title: "UI/UX-карандаш", price: 10000 });
// basketData.addProduct({id: '90973ae5-285c-4b6f-a6d0-65d1d760b102', title: "Бэкенд-антистресс", price: 1000 });
// console.log(basketData.product)
// // basketData.deleteProduct('90973ae5-285c-4b6f-a6d0-65d1d760b102')
// console.log(basketData.product)
// // basketData.clearBasket();
// console.log(basketData.product)
// console.log(basketData.getTotal())
// // basketData.getTotal();

// formData.setPayment('');
// formData.setAdress('4кевке');
// formData.setEmail('example@mail.com');
// formData.setPhone('+123456789');

// // Проверяем валидацию
// const isContactsValid = formData.checkValidationContacts(); // проверка контактов
// const isPaymentValid = formData.checkValidationPayment();   // проверка оплаты и адреса

// if (isContactsValid && isPaymentValid) {
//     console.log('Форма валидна');
// } else {
//     console.log('Ошибки валидации:', formData.formErrors);
// }
