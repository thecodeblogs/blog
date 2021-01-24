import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {VisitorProfile} from '../data/visitor-profile';
import {DjangoRestFrameworkEndpointService} from '../services/django-rest-framework-endpoint.service';

@Injectable({
    providedIn: 'root'
})
export class VisitorProfileService extends DjangoRestFrameworkEndpointService<VisitorProfile> {
    endpoint = '/blog_api/visitor_profiles/';

    constructor(
        public http: HttpClient,
        public deviceDetectorService: DeviceDetectorService
    ) {
        super(http);
    }

    getVisitorProfile(): VisitorProfile {
        const deviceInfo = this.deviceDetectorService.getDeviceInfo();

        const vp = new VisitorProfile();

        vp.telemetry = deviceInfo;

        vp.name = deviceInfo.os;
        vp.family = deviceInfo.browser;
        vp.version = deviceInfo.browser_version;

        return vp;
    }
}
