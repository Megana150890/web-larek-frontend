import { CardsData } from './components/CardsData'
import { FormData } from './components/FormData'
import { BasketData } from './components/BasketData'
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
// import { BasketData } from './components/common/BasketData';
// import { CardsData } from './components/common/CardsData'
// import { FormData } from './components/common/FormData';

const events = new EventEmitter();

const basketData = new BasketData({}, events);
const cardsdData = new CardsData({}, events);
const formData = new FormData({}, events);
