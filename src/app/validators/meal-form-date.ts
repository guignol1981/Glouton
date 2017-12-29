import {AbstractControl} from '@angular/forms';
export class MealFormDateValidation {

    static LogicDatesSelection(AC: AbstractControl) {
        let deliveryDateControl = AC.get('deliveryDate');
        let limitDateControl = AC.get('limitDate');
        let today = Date.now();
        let deliveryDateErrors = {};
        let limitDateErrors = {};

        if (deliveryDateControl.value <= today || limitDateControl.value <= today || deliveryDateControl.value <= limitDateControl.value) {
            if (deliveryDateControl.value <= today) {
                deliveryDateErrors['DateLessOrEqualThanToday'] = true;
            } else {
                deliveryDateErrors['DateLessOrEqualThanToday'] = false;
            }

            if (limitDateControl.value <= today) {
                limitDateErrors['DateLessOrEqualThanToday'] = true;
            } else {
                limitDateErrors['DateLessOrEqualThanToday'] = false;
            }

            if (deliveryDateControl.value <= limitDateControl.value) {
                deliveryDateErrors['LogicDatesSelection'] = true;
                limitDateErrors['LogicDatesSelection'] = true;
            } else {
                deliveryDateErrors['LogicDatesSelection'] = false;
                limitDateErrors['LogicDatesSelection'] = false;
            }
            deliveryDateControl.setErrors(deliveryDateErrors);
            limitDateControl.setErrors(limitDateErrors);
        } else {
            return null;
        }
    }
}