import {AbstractControl} from '@angular/forms';
import * as moment from "moment";

export class MealFormDateValidation {

    static LimitDateShouldBeAtLeastToday(AC: AbstractControl) {
        let limitDateControl = AC.get('limitDate');
        let today = moment().startOf('day');

        if (limitDateControl.value && limitDateControl.value.getTime() >= today) {
            return null;
        } else {
            return {limitDateLessThanToday: true};
        }
    }

    static LimitDateShouldBeLowerThanDeliveryDate(AC: AbstractControl) {
        let limitDatecontrol = AC.get('limitDate');
        let deliveryDateControl = AC.get('deliveryDate');
        let deliveryDate = moment.utc(deliveryDateControl.value).startOf('day').format();
        let limitDate = moment.utc(limitDatecontrol.value).startOf('day').format();

        if (limitDate < deliveryDate) {
            return null;
        } else {
            return {limitDateIsEqualOrGreaterThanDeliveryDate: true};
        }
    }

    static deliveryDateShouldBeGreaterThanToday(AC: AbstractControl) {
        let deliveryDateControl = AC.get('deliveryDate');
        let today = moment().startOf('day');
        let deliveryDate = moment.utc(deliveryDateControl.value).startOf('day');

        if (deliveryDateControl.value && deliveryDate > today) {
            return null;
        } else {
            return {deliveryDateIsEqualOrLessThanToday: true};
        }
    }
}