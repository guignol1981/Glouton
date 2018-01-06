import { Component, OnInit } from '@angular/core';
import {Version} from '../../models/version/version';
import {VersionService} from '../../models/version/version.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  versions: Version[] = [];

  constructor(private versionService: VersionService) { }

  ngOnInit() {
    this.versionService.getList().then(data => this.versions = data);
  }

}
