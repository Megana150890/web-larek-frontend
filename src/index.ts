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
            card.price = item.price ;
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
      .then((res) => {
        modal.render({
            content: sucsess.render({
                total: `Списано ${res.total} синапсов`,
				}),
            })
            basketData.clearBasket();
        })
        
        .catch((err) => {
			console.error(err);
		});
} )

events.on('order.button: sucsess', () => {
    modal.close();
})

