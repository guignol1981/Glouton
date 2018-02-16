import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {GroupService} from "../../services/group.service";
import {DialogService} from "ng2-bootstrap-modal";
import {GroupFormComponent} from "../group-form/group-form.component";
import {Group} from "../../models/group/group";

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
    form: FormGroup;
    foundGroups: Group[];

    constructor(private dialogService: DialogService,
                private groupServivce: GroupService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(null)
        });
        this.form.valueChanges.subscribe(data => {
            this.groupServivce.getByName(data['name']).then(groups => {
                this.foundGroups = groups;
            });
        });
    }

    createGroup() {
        this.dialogService.addDialog(GroupFormComponent, null, {backdropColor: 'rgba(0, 0, 0, 0.5)'})
            .subscribe((isConfirmed) => {
                if (isConfirmed) {
                    console.log('test');
                }
            });
    }

}
