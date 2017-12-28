import {AbstractControl} from '@angular/forms';
export class MealFormDateValidation {

    static LogicDatesSelection(AC: AbstractControl) {
        let dateControl = AC.get('date');
        let limitDateControl = AC.get('limitDate');
        let today = Date.now();
        let deliveryDateErrors = {};
        let limitDateErrors = {};

        if (dateControl.value <= today || limitDateControl.value <= today || dateControl.value <= limitDateControl.value) {
            if (dateControl.value <= today) {
                deliveryDateErrors['DateLessOrEqualThanToday'] = true;
            } else {
                deliveryDateErrors['DateLessOrEqualThanToday'] = false;
            }

            if (limitDateControl.value <= today) {
                limitDateErrors['DateLessOrEqualThanToday'] = true;
            } else {
                limitDateErrors['DateLessOrEqualThanToday'] = false;
            }

            if (dateControl.value <= limitDateControl.value) {
                deliveryDateErrors['LogicDatesSelection'] = true;
                limitDateErrors['LogicDatesSelection'] = true;
            } else {
                deliveryDateErrors['LogicDatesSelection'] = false;
                limitDateErrors['LogicDatesSelection'] = false;
            }
            dateControl.setErrors(deliveryDateErrors);
            limitDateControl.setErrors(limitDateErrors);
        } else {
            return null;
        }
    }
}