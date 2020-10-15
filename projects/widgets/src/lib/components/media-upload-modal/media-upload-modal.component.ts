import {Component, HostListener, Input, OnInit, OnDestroy} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {MatDialogRef} from '@angular/material/dialog';
import {DjangoRestFrameworkEndpointService, UploadService} from '@thecodeblogs/blog/core';

@Component({
    selector: 'app-media-upload-modal',
    templateUrl: './media-upload-modal.component.html',
    styleUrls: ['./media-upload-modal.component.css']
})
export class MediaUploadModalComponent implements OnInit, OnDestroy {

    imgLink;
    socketSub;
    error;
    public uploader: FileUploader = new FileUploader(
        {
            url: UploadService.upload_endpoint,
            itemAlias: 'file',
            authToken: '',
            headers: [
                {name: 'X-CSRFToken', value: MediaUploadModalComponent.getCookie('csrftoken')},
            ],
            additionalParameter: {'csrf_token': MediaUploadModalComponent.getCookie('csrftoken')},
            removeAfterUpload: true,
            allowedMimeType: [
                'image/jpeg',
                'image/gif',
                'image/png',
                'image/jpg',
                'video/mp4',
                'video/webm',
                'video/ogg',
            ],
        }
    )
    uploadId;
    uploading = false;
    @Input() file;

    constructor(
        public dialogRef: MatDialogRef<MediaUploadModalComponent>,
        private uploadService: UploadService
    ) {
    }

    poller;

    pollForCompletion() {
        this.uploadService.get(this.uploadId).subscribe((response) => {
            if(response.processed) {
                this.imgLink = response.path_to_file;
                clearInterval(this.poller);
                this.poller = null;
                this.uploading = false;
            }
        });
    }

    static getCookie(name: string) {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }

    ngOnInit(): void {
        this.uploader.onCompleteItem = (item, response) => {
            const responseObj = JSON.parse(response)
            this.uploadId = responseObj.id;
            this.poller = setInterval(this.pollForCompletion.bind(this), 2000);
        }

        this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
            this.error = 'This file is not a supported mimetype.'
            this.uploading = false;
        }

        if (this.file) {
            this.uploader.addToQueue([this.file])
            this.uploader.uploadAll();
            this.uploading = true;
        }
    }

    onFileSelected(e) {
        this.uploader.uploadAll();
        this.uploading = true;
    }

    buildHost(url) {
        return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + url;
    }

    close() {
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        if (this.socketSub) {
            this.socketSub.complete();
            this.socketSub = null;
        }
    }

    blobToFile(theBlob, fileName) {
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }

    @HostListener('document:paste', ['$event'])
    onPaste(e) {
        if (e instanceof ClipboardEvent) {
            const files = e.clipboardData.files
            if (files) {
                if (files.length < 1) {
                    // const items = e.clipboardData.items;
                    // for(let i = 0; i < items.length; i++) {
                    //     const item = items[i];
                    //     item.getAsString((text) => {
                    //         try {
                    //             const url = new URL(text);
                    //             if(url) {
                    //                 fetch(text)
                    //                     .then(res => res.blob()) // Gets the response and returns it as a blob
                    //                     .then(blob => {
                    //                         const file = this.blobToFile(blob, 'web-created')
                    //                         this.uploader.addToQueue([file])
                    //                         this.uploader.uploadAll();
                    //                         this.uploading = true;
                    //                     });
                    //             }
                    //         } catch(e) {
                    //
                    //         }
                    //     });
                    // }
                } else if (files.length > 1) {
                    console.log('Multiple files detected')
                } else {
                    for (let i = 0; i < files.length; i++) {
                        this.uploader.addToQueue([files[i]])
                    }
                    this.uploader.uploadAll();
                    this.uploading = true;
                }
            } else {
                console.log('Stuff not working')
            }
        }
    }
}
