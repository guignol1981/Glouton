import {User} from "../user/user";
export class Meal {
    constructor(public _id: string = null,
                public title: string = '',
                public description: string = '',
                public cook: User = new User(),
                public participants: User[] = [],
                public image: string = '',
                public deliveryDate: Date = new Date(),
                public limitDate: Date = new Date(),
                public creationDate: Date = new Date(),
                public minParticipants: Number = null,
                public maxParticipants: Number = null,
                public status: string = '') {
    }

    isConfirmed() {
        return (this.participants.length >= this.minParticipants) && this.limitDate.getTime() < Date.now();
    }

    canJoin(user: User) {
        return !this.asJoined(user) && !this.isFull() && !this.isCook(user) && this.limitDate.getTime() >= Date.now();
    }

    canLeave(user: User) {
        return this.asJoined(user) && this.limitDate.getTime() > Date.now();
    }

    isFull() {
        return this.participants.length >= this.maxParticipants;
    }

    asJoined(user: User) {
        let asJoined = false;

        this.participants.forEach((participant) => {
            if (participant._id === user._id) {
                asJoined = true;
            }
        });

        return asJoined;
    }

    isCook(user: User) {
        return (this.cook._id === user._id);
    }

}
