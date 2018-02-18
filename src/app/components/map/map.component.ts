import {Component, OnInit} from '@angular/core';
import {GroupService} from "../../services/group.service";
import {Group} from "../../models/group/group";
import {JoinGroupAlertComponent} from "../join-group-alert/join-group-alert.component";
import {DialogService} from "ng2-bootstrap-modal";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    groups: Group[] = [];
    markers: Marker[] = [];
    zoom = 12;
    lat = 0;
    lng = 0;

    constructor(private groupService: GroupService,
                private dialogService: DialogService) {
    }

    ngOnInit() {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition((position: Position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            });
        }

        this.groupService.getList().then((groups: Group[]) => {
            this.groups = groups;
            groups.forEach(group => {
                this.markers.push({
                    lat: +group.geoData.lat,
                    lng: +group.geoData.lng,
                    label: group.name,
                    groupId: group._id,
                    draggable: false
                });
            });
        });
    }

    joinGroup(id) {
        let groupToJoin = null;
        this.groups.forEach(group => {
            if (group._id === id) {
                groupToJoin = group;
            }
        });

        this.dialogService.addDialog(JoinGroupAlertComponent, {group: groupToJoin}, {backdropColor: 'rgba(0, 0, 0, 0.5)'})
            .subscribe((isConfirmed) => {
                if (isConfirmed) {
                    console.log('ok');
                }
            });
    }

}

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    groupId: string;
    draggable: boolean;
}