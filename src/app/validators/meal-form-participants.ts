import {AbstractControl} from '@angular/forms';
export class MealFormParticipantValidation {

    static LogicParticipantsSelection(AC: AbstractControl) {
        let minParticipants = AC.get('minParticipants');
        let maxParticipants = AC.get('maxParticipants');

        if (minParticipants.value > maxParticipants.value) {
            minParticipants.setErrors({LogicParticipantsSelection: true});
        } else {
            minParticipants.setErrors(null);
            return null;
        }
    }
}