import {User} from "../user/user";
export class Meal {
    public cook: User;
    public participants: User[] = [];

    constructor(public _id: string = null,
                public title: string = '',
                public description: string = '',
                public imageUrl: string = '',
                cookData: any = null,
                public date: Date = new Date(),
                public limitDate: Date = new Date(),
                public minParticipants: number = 0,
                public maxParticipants: number = 0,
                participantsData: any[] = [],
                public creationDate: Date = new Date()) {
        if (cookData) {
            this.cook = new User(cookData._id, cookData.name, cookData.email);
        }
        if (participantsData) {
            participantsData.forEach(data => {
                this.participants.push(new User(data._id, data.name, data.email));
            });
        }
    }

    isConfirmed() {
        return this.participants.length >= this.minParticipants && this.limitDate < Date.now();
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
