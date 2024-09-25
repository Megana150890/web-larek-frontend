import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface ISucsessOrder {
    total: string;
}



export class SucsessOrder extends Component<ISucsessOrder> {
    protected _button: HTMLButtonElement;
    protected _decription: HTMLElement;

    constructor(container: HTMLElement, protected events:IEvents) {
        super(container)
        this._button = document.querySelector('.order-success__close');
        this._decription = document.querySelector('.order-success__description')
        this._button.addEventListener('click', () =>
       this.events.emit('order.button: sucsess') )
    }
    set total (items:string) {
this.setText(this._decription, items)
    }

}

