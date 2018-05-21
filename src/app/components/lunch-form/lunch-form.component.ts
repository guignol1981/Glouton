import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LunchService} from '../../models/lunch/lunch.service';
import {Lunch} from '../../models/lunch/lunch';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../models/user/user';
import {LunchImageService} from '../../services/lunch-image.service';
import {UserService} from '../../models/user/user.service';
import {LunchFormDateValidation} from '../../validators/lunch-form-date';
import {LunchFormParticipantValidation} from '../../validators/lunch-form-participants';
import {CropperSettings, ImageCropperComponent} from 'ng2-img-cropper';
import {NotificationsService} from 'angular2-notifications';
import {DatepickerOptions} from 'ng2-datepicker';
import * as moment from 'moment';
import {LunchType} from "../../models/lunch/lunch-type.enum";
import {GroupService} from "../../services/group.service";
import {Group} from "../../models/group/group";

@Component({
    selector: 'app-lunch-form',
    templateUrl: './lunch-form.component.html',
    styleUrls: ['./lunch-form.component.scss']
})
export class LunchFormComponent implements OnInit {
    @Input() editMode = false;
    @Output() updated: EventEmitter<Lunch> = new EventEmitter<Lunch>();
    @ViewChild('cropper', undefined)
    groups: Group[] = [];
    cropper: ImageCropperComponent;
    lunch: Lunch;
    user: User;
    form: FormGroup;
    data: any;
    cropperSettings: CropperSettings;
    useOwnPicture = false;
    lunchType = LunchType;

    deliveryDateOptions: DatepickerOptions = {
        minDate: moment().startOf('day').add(1, 'day').startOf('day').toDate()
    };

    limitDateOptions: DatepickerOptions = {
        minDate: moment().startOf('day').toDate()
    };

    constructor(private lunchService: LunchService,
                public authenticationService: AuthenticationService,
                public imageService: LunchImageService,
                public userService: UserService,
                public lunchImageService: LunchImageService,
                private notificationService: NotificationsService,
                private groupService: GroupService) {
    }

    ngOnInit() {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.noFileInput = true;

        this.data = {};

        // this.getUserGroupsAsync().then((groups: Group[]) => {
        //     this.groups = groups;
        //     if (!this.editMode) {
        //         this.lunch = new Lunch();
        //         this.userService.getConnectedUser().then(user => {
        //             this.user = user;
        //             this.initForm();
        //         });
        //     }
        // });

    }

    @Input()
    initFromEdit(user: User, lunch: Lunch) {
        this.user = user;
        this.lunch = lunch;
        this.initForm();
    }

    @Input()
    initFromDate(date, user: User) {
        this.user = user;
        this.lunch = new Lunch();
        this.lunch.deliveryDate = date.toDate();
        this.lunch.limitDate = moment(date).subtract(1, 'day').toDate();
        this.initForm();
    }

    getUserGroupsAsync() {
        return this.groupService.getUserGroup();
    }

    fileChangeListener($event) {
        let image: any = new Image();
        let file: File = $event.target.files[0];
        let myReader: FileReader = new FileReader();
        let me = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            me.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    initForm() {
        this.form = new FormGroup({
            title: new FormControl(this.lunch.title, [Validators.required, Validators.minLength(5)]),
            description: new FormControl(this.lunch.description, [Validators.required, Validators.minLength(15)]),
            contribution: new FormControl(this.lunch.contribution, [Validators.required, Validators.min(0)]),
            deliveryDate: new FormControl(this.lunch.deliveryDate, Validators.required),
            deliveryHour: new FormControl(this.lunch.deliveryHour, [Validators.required, Validators.min(0), Validators.max(24)]),
            limitDate: new FormControl(this.lunch.limitDate, Validators.required),
            minParticipants: new FormControl(this.lunch.minParticipants, [Validators.required, Validators.min(1)]),
            maxParticipants: new FormControl(this.lunch.maxParticipants, [Validators.required, Validators.min(1)]),
            groups: new FormControl(this.lunch.group ? this.lunch.group._id :  null),
            type: new FormControl(this.lunch.type)
        }, {
            validators: [
                LunchFormDateValidation.LimitDateShouldBeAtLeastToday,
                LunchFormDateValidation.LimitDateShouldBeLowerThanDeliveryDate,
                LunchFormDateValidation.deliveryDateShouldBeGreaterThanToday,
                LunchFormParticipantValidation.LogicParticipantsSelection,
                LunchFormParticipantValidation.minMinParticipants
            ]
        });
    }

    toggleUseOwnPicture() {
        this.useOwnPicture = !this.useOwnPicture;
        this.data.image = null;
    }

    onSubmit(closeButton) {
        let me = this;
        let saveLunch = function (imageData) {
            let lunch = <Lunch>me.form.value;
            let hasParticipants = me.lunch.participants.length > 0;

            lunch._id = me.lunch._id;
            lunch.image = imageData ? JSON.parse(imageData['_body']).image : lunch.image;
            lunch.participants = me.lunch.participants;
            lunch.cook = me.user;

            me.lunchService.save(lunch)
                .then((updatedLunch) => {
                    if (me.editMode) {
                        if (hasParticipants && updatedLunch.participants.length === 0) {
                            me.notificationService.warn('participants have been removed', 'we warned them!');
                        }

                        me.notificationService.success(`Lunch proposition updated!`);
                    } else {
                        me.notificationService.success(`Lunch proposition created!`);
                    }

                    me.updated.emit(updatedLunch);
                    closeButton.click();
                });
        };
        if (!me.editMode && me.useOwnPicture) {
            me.lunchImageService.postImage(me.data.image).subscribe(data => {
                saveLunch(data);
            });
        } else {
            saveLunch(null);
        }
    }

    formControlIsInvalid(formControlName: string) {
        let formControl = this.form.get(formControlName);
        return !formControl.valid && !formControl.pristine;
    }


    close() {
        this.useOwnPicture = false;
        if (this.cropper) {
            this.cropper.reset();
        }
        this.lunch = new Lunch();
        this.initForm();
    }

}
