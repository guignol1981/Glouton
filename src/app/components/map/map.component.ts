import {Component, OnInit} from '@angular/core';
import {GroupService} from "../../services/group.service";
import {Group} from "../../models/group/group";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    markers: Marker[] = [];
    zoom = 12;
    lat = 0;
    lng = 0;

    constructor(private groupService: GroupService) {
    }

    ngOnInit() {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition((position: Position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            });
        }

        this.groupService.getList().then((groups: Group[]) => {
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

}

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    groupId: string;
    draggable: boolean;
}