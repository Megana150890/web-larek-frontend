import { Form } from "./Form";
import { IContacts } from "../../types";
import { IEvents } from "../base/events";

export class FormContacts extends Form<IContacts> {

    constructor( container: HTMLFormElement, events: IEvents) {
        super(container, events)
    
        this.container.addEventListener('input', (evt) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof IContacts;
            const value = target.value;
            this.inputChange(field, value);
        });

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

        set email(value: string) {
            (this.container.elements.namedItem('email') as HTMLInputElement).value =
                     value;
         }
         set phone(value: string) {
            (this.container.elements.namedItem('phone') as HTMLInputElement).value =
                     value;
         }
         
    
}
