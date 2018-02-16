import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from "ng2-bootstrap-modal";
import {GroupService} from "../../services/group.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Group} from "../../models/group/group";

@Component({
    selector: 'app-group-form',
    templateUrl: './group-form.component.html',
    styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent extends DialogComponent<null, boolean> implements OnInit {
    form: FormGroup;

    constructor(dialogService: DialogService,
                private groupService: GroupService) {
        super(dialogService);
    }

    ngOnInit() {
        document.getElementsByTagName('body')[0].classList.add('modal-open');

        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.minLength(5)])
        });
    }

    onSubmit() {
        let group = <Group>this.form.value;
        this.groupService.create(group).then(() => {
            document.getElementsByTagName('body')[0].classList.remove('modal-open');
            this.result = true;
            this.close();
        });
    }

}
