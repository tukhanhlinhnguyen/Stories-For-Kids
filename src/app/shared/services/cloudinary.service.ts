import { Injectable, Input, NgZone } from '@angular/core';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  uploader: FileUploader;
  @Input()
  responses: Array<any>;
  title: string;
  fileUploadUrl: string;
  imageUploaded: boolean = false;
  hasBaseDropZoneOver: boolean = false;
  constructor(
    private cloudinary: Cloudinary,
    private zone: NgZone,
    ) { 
    this.responses = [];
    this.title = '';
  }

 

  ngOnInit(){
  }

  uploadToCloudinary(){
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      autoUpload: true,
      isHTML5: true,
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ],
    };

    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      this.responses = [];
      this.title = '';
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      let tags = 'myphotoalbum';
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `myphotoalbum,${this.title}`;
      }
      form.append('folder', 'angular_sample');
      form.append('tags', tags);
      form.append('file', fileItem);
      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };
  
    const upsertResponse = fileItem => {
      this.zone.run(() => {
        const existingId = this.responses.reduce((prev, current, index) => {
          
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
        } else {
          this.responses.push(fileItem);
        }
      });
      this.fileUploadUrl = this.responses[0]?.data.secure_url;
      this.imageUploaded = true;

    };
  
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>{
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );
     
    }
  
    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );
    }
  }

  updateTitle(value: string){
    this.title = value;
  }

  deleteImage = function (data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body, options).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.result}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };
  
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  
  
  getFileProperties(fileProperties: any){
    
    if(!fileProperties){
      return null;
    }
  
    // console.log(key + ": " + fileProperties[key])
    Object.keys(fileProperties).map((key) => 
      console.log(key + ": " + fileProperties[key])
    );
  
    return Object.keys(fileProperties)
    .map((key) => ({ 'key': key, 'value': fileProperties[key] }))
  }
}
