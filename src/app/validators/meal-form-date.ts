import {AbstractControl} from '@angular/forms';
export class MealFormDateValidation {

    static LogicDatesSelection(AC: AbstractControl) {
        let deliveryDateControl = AC.get('deliveryDate');
        let limitDateControl = AC.get('limitDate');
        let today = Date.now();
        let deliveryDateErrors = {};
        let limitDateErrors = {};

        deliveryDateErrors['DateLessOrEqualThanToday'] = deliveryDateControl.value <= today;
        limitDateErrors['DateLessOrEqualThanToday'] = limitDateControl.value <= today;
        deliveryDateErrors['LogicDatesSelection'] = deliveryDateControl.value < limitDateControl.value;
        limitDateErrors['LogicDatesSelection'] = deliveryDateControl.value < limitDateControl.value;
        deliveryDateControl.setErrors(deliveryDateErrors);
        limitDateControl.setErrors(limitDateErrors);
    }
}