import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {GroupService} from "../../services/group.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GoogleMapService} from "../../services/google-map.service";
import {Group} from "../../models/group/group";
import {GeoData} from "../../models/geo-data/geo-data";

@Component({
    selector: 'app-group-form',
    templateUrl: './group-form.component.html',
    styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent extends DialogComponent<null, boolean> implements OnInit {
    form: FormGroup;
    geoData = new GeoData();
    nameIsAvailable = false;

    constructor(dialogService: DialogService,
                private groupService: GroupService,
                private googleMapService: GoogleMapService) {
        super(dialogService);
    }

    ngOnInit() {
        document.getElementsByTagName('body')[0].classList.add('modal-open');

        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            description: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            address: new FormControl('', [Validators.required, Validators.minLength(3)]),
        });

        this.form.valueChanges.subscribe(data => {
            if (this.form.get('name').valid) {
                this.groupService.checkAvailability(data['name']).then(isAvailable => {
                    this.nameIsAvailable = isAvailable;
                });
            }
            if (this.form.get('address').valid) {
                this.googleMapService.getGeoData(data['address']).then(geoData => {
                    this.geoData = geoData;
                });
            }
        });
    }

    onSubmit() {
        let group = <Group>this.form.value;
        group.geoData = this.geoData;
        this.groupService.create(group).then(() => {
            document.getElementsByTagName('body')[0].classList.remove('modal-open');
            this.result = true;
            this.close();
        });
    }

}
