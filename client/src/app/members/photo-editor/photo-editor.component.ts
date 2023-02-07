import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {

  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user: User) => {
      this.user = user
    })
  }
  @Input() member!: Member;
  user!: User
  uploader!: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  ngOnInit(): void {
    this.initializeUploader();
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    }
  }
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPicture(id: any) {
    this.memberService.setMainPhoto(id).pipe(take(1)).subscribe(x => {
      console.log(x);
      let newPhoto = this.member.photos.find(x => x.id == id);
      let currentMain = this.member.photos.find(x => x.isMain);
      if (newPhoto && currentMain) {
        this.member.photos[this.member.photos.indexOf(currentMain)].isMain = false;
        this.member.photos[this.member.photos.indexOf(newPhoto)].isMain = true;
        this.member.photoUrl = newPhoto.url;
        this.user.photoUrl = newPhoto.url;
        this.accountService.setCurrentUser(this.user);
      }
    });
  }
  deletePhoto(id: any) {
    if (this.member.photos.length == 1) {
      this.toastr.error("must leave at least on photo");
    }
    this.memberService.deletePhoto(id).pipe(take(1)).subscribe(x => {
      let photo = this.member.photos.filter(m => m.id == id)
      if (photo[0].isMain) {
        this.member.photos[0].isMain = true;
        this.user.photoUrl = this.member.photos[0].url;
        this.accountService.setCurrentUser(this.user);
      }
      let index = this.member.photos.indexOf(photo[0]);
      this.member.photos.splice(index, 1)
    });
  }
}
