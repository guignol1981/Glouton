import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GroupService} from "../../services/group.service";
import {Group} from "../../models/group/group";
import {JoinGroupAlertComponent} from "../join-group-alert/join-group-alert.component";
import {DialogService} from "ng2-bootstrap-modal";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    @Output() groupClicked: EventEmitter<Group> = new EventEmitter<Group>();
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
                    draggable: false,
                    group: group
                });
            });
        });
    }

    onGroupClicked(group) {
        this.groupClicked.emit(group);
    }
}

interface Marker {
    lat: number;
    lng: number;
    draggable: boolean;
    group: Group;
}