import { ICard } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Components";
import { IEvents } from "../base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _description: HTMLElement;
    protected _price: HTMLElement;
    protected _image:HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
    protected button: HTMLButtonElement;

   constructor( protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this._description =  container.querySelector('.card__text');
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = container.querySelector('.card__image');
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._category = container.querySelector('.card__category')
    this.button = container.querySelector('.card__button')
   }
  
}