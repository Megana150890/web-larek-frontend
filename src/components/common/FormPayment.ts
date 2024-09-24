import { IPayment } from "../../types";
import { Form } from "./Form";

 export class FormPayment extends Form<IPayment> {

    payment: string;
    adress: string;


 }