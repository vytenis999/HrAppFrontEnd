import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import {  Input } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { CandidateService } from 'src/app/services/candidate.service';
import { Candidate,Technologies,Clients,Status } from 'src/app/models/candidate.model';

import { ActivatedRoute } from '@angular/router';
import { Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-candidate-create',
  templateUrl: './candidate-create.component.html',
  styleUrls: ['./candidate-create.component.scss']
})
export class CandidateCreateComponent implements OnInit {


  fileToUpload: File | null = null;
  files: any = [];
  file: any;
  formData = new FormData();

  candidate!: Candidate;
  candidates: Candidate[] = [];

  tempName?: string = '';
  tempSurname?: string = '';
  tempEmail?: string = '';
  tempPhone?: string = '';
  tempLinkedin?: string = '';
  tempComment?: string = '';
  tempStatusId?: string;
  tempOtherStatus?: string;
  tempSalary?: string = '';
  tempCVurl?: string = '';
  tempRecruiter?: string = '';
  tempWillBeContacted?: Date;
  tempTechnologies?: any;
  tempClients?: any;
  tempWhenWasContacted?: Date;
  tempTechnologyIds?: any;
  tempClientsIds?: any;

  submitted!: boolean;

  technology!: Technologies;
  technologyList: Technologies[] = [];


  clientList: Clients[] = [];

  statusList: Status[] = [];

  uploadedFiles: any[] = [];

  @ViewChild('modalContent', {static: true})

  modalContent!: TemplateRef<any>;

  technologyDialog!: boolean;
  deletedTechnology: any;
  newTechnology!: string;



  constructor(
    private candidateService: CandidateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.candidateService.getTechnologies().subscribe((res: any[]) => {
      this.technologyList = res;
    });

    this.candidateService.getClients().subscribe((res: any[]) => {
      this.clientList = res;
    });
    this.candidateService.getStatus().subscribe((res: any[]) => {
      this.statusList = res;
    });
  }

  openTechnologiesDialog() {
    this.technologyDialog = true;
  }

  closeTechologiesDialog() {
    this.technologyDialog = false;
  }
  errorMessage(error:any) {
    this.messageService.add({severity:'error', summary: `Klaida`, detail: `${error.error}`, life: 3000});
  }
  addTechnology(technology: Technologies) {
    this.technology = {
      id: this.technology?.id,
      technologyName: this.newTechnology,
    };
    this.candidateService.postTechnology(this.technology).subscribe(technology => this.technologyList.push(this.technology));
  }

  deleteTechnology(deleteTechnology: any) {
    this.candidateService.deleteTechnology(deleteTechnology).subscribe(res => {
    });
  }

  onChange(event: any) {
    this.file = event.target.files[0];
    this.formData.append("file", this.file, this.file.name);
  }

  cancelCandidate() {
  }

  saveCandidate() {
    this.submitted = true;

    if(this.tempWhenWasContacted && this.tempLinkedin && this.tempName && this.tempSurname){
      this.formData.append("Name", this.tempName || '');
      this.formData.append("Surname", this.tempSurname || '');
      this.formData.append("Email", this.tempEmail || '');
      this.formData.append("Phone", this.tempPhone || '');
      this.formData.append("Linkedin", this.tempLinkedin || '');
      this.formData.append("Comment", this.tempComment || '');
      this.formData.append("StatusId", this.tempStatusId || '');
      this.formData.append("OtherStatus", this.tempOtherStatus || '');
      this.formData.append("Salary", this.tempSalary|| '');
      this.formData.append("CVurl", '1');
      if(this.tempWillBeContacted != null){
        this.formData.append("WillBeContacted", this.formatDate(this.tempWillBeContacted).toString() || '');
      }
      if(this.tempTechnologies?.map((a: { id: any; }) => a.id) != null){
        this.formData.append("TechnologyIds", this.tempTechnologies?.map((a: { id: any; }) => a.id).toString());
      }else {
        this.formData.append("TechnologyIds", " ");
      }
      if(this.tempClients?.map((a: { id: any; }) => a.id)!= null){
        this.formData.append("ClientsIds", this.tempClients?.map((a: { id: any; }) => a.id).toString() || "");
      }else {
        this.formData.append("ClientsIds", " ");
      }
      if(this.tempWhenWasContacted != null){
        this.formData.append("WhenWasContacted", this.formatDate(this.tempWhenWasContacted).toString());
      }

      this.candidateService.postCandidates(this.formData).subscribe({
        next: (data) => {
          this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Kandidatas sukurtas', life: 3000});
          this.tempName = '';
          this.tempSurname = '';
          this.tempEmail = '';
          this.tempPhone = '';
          this.tempLinkedin = '';
          this.tempComment = '';
          this.tempStatusId = '';
          this.tempOtherStatus = '';
          this.tempSalary = '';
          this.tempTechnologies = [];
          this.tempClients = [];
          this.tempCVurl = '';
          this.tempRecruiter = '';
          this.tempWillBeContacted = undefined;
          this.tempWhenWasContacted = undefined;
          this.tempTechnologyIds = [];
          this.tempClientsIds = [];
          this.formData = new FormData();
          this.submitted = false;
        },
        error: (error) => {
          this.errorMessage(error);
        }});
    }

  }

  getStatusId() {
    return this.tempStatusId;
  }

  fillByLinkedIn(link:any){
    if(link.startsWith('https://www.linkedin.com/')){
      this.candidateService.checkLinkedIn(link).subscribe({
        next: (data) => {
          if(data == true){
            this.candidateService.postLinkedIn(link).subscribe({
              next: (data) => {
                this.tempName = data.name;
                this.tempSurname = data.surname;
              },
              error: (error) => {
                this.errorMessage(error);
              }
            });
          }else {
            this.messageService.add({severity:'error', summary: 'Klaida', detail: 'Toks kandidatas jau yra!', life: 3000});
            this.tempLinkedin = undefined;
          }
        },
        error: () => {}
      });
    }
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }


  formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ]
    );
  }

}
