import { IBasket } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasketView {
list : HTMLElement;
total: string
}


export class Basket extends Component<IBasketView> {
 protected _list: HTMLElement;
 protected _submitButton: HTMLButtonElement
 protected _total: HTMLElement

constructor( container: HTMLElement, protected event: IEvents) {
    super(container)

    this._list = container.querySelector('.basket__list');
    this._total = container.querySelector('.basket__price');
    this._submitButton = container.querySelector('.basket__button')
}

}