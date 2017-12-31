import {AbstractControl} from '@angular/forms';
export class MealFormParticipantValidation {

    static LogicParticipantsSelection(AC: AbstractControl) {
        let minParticipants = AC.get('minParticipants');
        let maxParticipants = AC.get('maxParticipants');

        if (minParticipants.value > maxParticipants.value) {
            return {minParticipantsGreaterThanMaxParticipants: true};
        } else {
            return null;
        }
    }

    static minMinParticipants(AC: AbstractControl) {
        let minParticipants = AC.get('minParticipants');

        if (minParticipants.value < 1) {
            return {minMinParticipantsLessThanOne: true};
        } else {
            return null;
        }
    }
}