import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectDataService } from 'src/app/core/service/project-data.service';
import { NgOpenCVService, OpenCVLoadResult } from 'ng-open-cv';
import { fromEvent, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Uploader } from 'src/app/core/state/uploader/uploader.model';
import { UploaderDataService } from 'src/app/core/state/uploader/uploader-data.service';
import { UploaderService } from 'src/app/core/state/uploader/uploader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detect-disorder',
  templateUrl: './detect-disorder.component.html',
  styleUrls: ['./detect-disorder.component.scss']
})
export class DetectDisorderComponent implements OnInit {
  openCVLoadResult: Observable<OpenCVLoadResult>;
  uploaderItems$: Observable<Uploader[]>;
  uploaderItemsLength: number;
  selectedFiles: FileList;
  progressInfos = [];
  message: string;
  diseasePercentage: any = 0;
  active: Number = 1;
  pointCount: Number;
  whiteDotsCount: number = 0;
  yellowDotsCount: number = 0;
  Output: number;
  imageUploadBoolean:number = 0;

  @ViewChild('fileInput')
  fileInput: ElementRef;
  @ViewChild('canvas')
  canvas: ElementRef;

  formGroup: FormGroup = new FormGroup({
    question_1: new FormControl('', [Validators.required]),
    question_2: new FormControl('', [Validators.required]),
    question_3: new FormControl('', [Validators.required])
  });

  constructor(private projectDataService: ProjectDataService,
    private ngOpenCVService: NgOpenCVService,
    private uploadService: UploaderDataService,
    private uploaderService: UploaderService,
    private router:Router) { }

  ngOnInit(): void {
    this.openCVLoadResult = this.ngOpenCVService.isReady$;
    if (this.uploadService.getFiles()) {
      this.message = 'Active';
    } else {
      this.message = 'Inactive';
    }
  }

  selectFiles(e): void {
    if (e.target.files.length) {
      const reader = new FileReader();
      const load$ = fromEvent(reader, 'load');
      load$
        .pipe(
          switchMap(() => {
            return this.ngOpenCVService.loadImageToHTMLCanvas(`${reader.result}`, this.canvas.nativeElement);
          })).subscribe(() => {},
          err => {
            console.log('Error loading image', err);
          });

      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e: any) => {
        var myImage = new Image();
        myImage.src = e.target.result;
        myImage.onload = function (ev: any) {
          let srcImg = cv.imread(myImage);
          console.log(srcImg);
          let dst = new cv.Mat();
          let dsize = new cv.Size(1000, 750);
          cv.resize(srcImg, dst, dsize, 0, 0, cv.INTER_AREA);
          cv.imshow("canvas", dst);
          // srcImg.delete();
          // dst.delete();
        };
      }
      const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    }
    this.progressInfos = [];
    this.selectedFiles = e.target.files;
  }

  uploadFiles(): void {
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    this.uploadService.upload(file).subscribe(
      (res: HttpEvent<any>) => {

        if (res.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * res.loaded / res.total);
        }
        if (res.type === HttpEventType.Response) {
          console.log('Upload complete');
          console.log(res.body);
          this.diseasePercentage = res.body.diseasePercentage;
          this.whiteDotsCount = res.body.whiteDotsCount;
          this.yellowDotsCount = res.body.yellowDotsCount;
          this.active = 1;
          this.imageUploadBoolean = 1;
          this.uploaderService.addUploaderItem({
            id: 1,
            diseasePercentage: this.diseasePercentage,
            whiteDotsCount: this.whiteDotsCount,
            yellowDotsCount: this.yellowDotsCount
          } as Uploader);

        }
      },
      (error) => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(error);
      }
    )
  }

  resetProject() {
    this.uploaderService.deleteUploaderItem(1);
    console.log("Clear Uploader DB");
  }

  onSubmit() {
    console.log(this.formGroup.value);
    const data =
    {
      question_1: this.formGroup.controls.question_1.value,
      question_2: this.formGroup.controls.question_2.value,
      question_3: this.formGroup.controls.question_3.value
    }


    if (this.formGroup.valid == true) {
      this.projectDataService.getPrediction(data).subscribe(res => {
        console.log(res);
        this.Output = res.predict;
        console.log('Succefully Added');
        this.formGroup.reset();
      });
    }
    else {
      console.log('Something wrong');
    }

  }

  reset() {
    window.location.reload();
  }
}

