import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
  SelectItem,
} from 'primeng/api';
import { CandidateService } from 'src/app/services/candidate.service';
import {
  Candidate,
  Technologies,
  Clients,
  Status,
  WhenWasContacted,
  Page,
} from 'src/app/models/candidate.model';
import { Table } from 'primeng/table';

import { ActivatedRoute, Router } from '@angular/router';
import { DecryptToken } from '../../decrypt-token';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-candidate-table',
  templateUrl: './candidate-table.component.html',

  styleUrls: ['./candidate-table.component.scss'],
})
export class CandidateTableComponent implements OnInit {
  role?: string;
  excelUrl = `https://localhost:7271/api/Candidate/Import`;
  //Candidate
  candidateDialog!: boolean;
  candidateEditDialog!: boolean;
  candidateTechnologyDialog!: boolean;
  candidates: Candidate[] = [];

  total: any;
  totalInDataBase!: number;
  AddOrEditCandidate!: Candidate;

  willBeContactedDate?: Date;
  whenWasContactedDate?: Date;
  file!: File;
  formData = new FormData();
  //Selected Candidate
  selectedCandidates: Candidate[] = [];
  submitted!: boolean;

  //Technology
  technology!: Technologies;
  technologyList: Technologies[] = [];
  technologyOptions: SelectItem<number>[] = [];
  filterTechnologyList: any;

  totalRecords!: number;
  //Client
  clientList: Clients[] = [];

  //Status
  statusList: Status[] = [];

  //WhenWasContacted
  whenWasContacted: WhenWasContacted[] = [];
  //Sorting
  whenWasContactedSort: number = 0;
  nameSort: number = 0;
  surnameSort: number = 0;
  willBeContactedSort: number = 0;

  @ViewChild('dt') table!: Table;

  // this.setCurrentpage(pageNumber) will set table to given page number
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  timeout?: any;
  nameFilter: any;
  // Pagination
  currentPage?: number;

  pages?: any;

  search: string = '';
  filterByNameLength: number = 1;
  filterStatus!: number;

  defaultClientsPagination: boolean = false;
  //Filter
  filterCandidateName: boolean = false;
  filterCandidateStatus: boolean = false;
  filterCandidateTechnology: boolean = false;
  filterCandidateDate: boolean = false;
  startDate: any;
  endDate: any;
  //Sort
  sortCandidateNameAse: boolean = false;
  sortCandidateNameDec: boolean = false;

  sortCandidateLastNameAse: boolean = false;
  sortCandidateLastNameDec: boolean = false;

  sortCandidateWhenContactAse: boolean = false;
  sortCandidateWhenContactDec: boolean = false;

  sortCandidateWillContactAse: boolean = false;
  sortCandidateWillContactDec: boolean = false;
  sortActive: boolean = false;
  selectAll: boolean = false;
  queryPage = '';
  checked: boolean | undefined;

  constructor(
    private candidateService: CandidateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private decryptionToken: DecryptToken,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit() {
    this.decrypt();
    this.candidateService.getCandidates(``).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.defaultClientsPagination = true;
        this.filterCandidateName = false;
        this.sortArrayWhenWasContacted();
        this.total = res.total;
        this.totalInDataBase = this.total;
      },
      error: (error) => {
        this.warningMessage(error);
        if (error.status === 404) this.candidates = [];
      },
    });

    this.candidateService.getTechnologies().subscribe((res: any[]) => {
      this.technologyList = res;
    });
    this.candidateService.getClients().subscribe((res: any[]) => {
      this.clientList = res;
    });
    this.candidateService.getStatus().subscribe((res: any[]) => {
      this.statusList = res;
    });
    // this.candidateService.getWhenWasContacted()
  }

  decrypt() {
    let decryptCl = new DecryptToken(this.jwtHelper);
    this.role = decryptCl.getUserProfileRole(this.role);
  }
  sortArrayWhenWasContacted() {
    this.candidates.forEach((element) => {
      element.whenWasContacted = element.whenWasContacted.sort(
        (a: any, b: any) => (a < b ? -1 : a > b ? 1 : 0)
      );
    });
  }
  clearFilterTech() {
    this.sortArrayWhenWasContacted();
    this.filterTechnologyList = null;
    this.clearFilters(1);
  }

  getFilterTechnology(x: any, n: number) {
    this.filterTechnologyList = x;
    if (x.length != 0 && x != null) {
      this.candidateService
        .postTechFilter(this.filterTechnologyList, n)
        .subscribe({
          next: (res) => {
            this.candidates = res.data || [];
            this.currentPage = res.currentPage;
            this.pages = res.pages;
            this.filterCandidateTechnology = true;
            this.total = res.total;
            this.totalInDataBase = this.total;

            this.filterCandidateDate = false;
            this.filterCandidateStatus = false;
            this.filterCandidateName = false;
            this.defaultClientsPagination = false;
            this.sortCandidateNameAse = false;
            this.sortCandidateNameDec = false;
            this.sortCandidateLastNameAse = false;
            this.sortCandidateLastNameDec = false;
            this.sortCandidateWillContactAse = false;
            this.sortCandidateWillContactDec = false;
            this.sortCandidateWhenContactAse = false;
            this.sortCandidateWhenContactDec = false;
          },
          error: (error) => {
            this.warningMessage(error);
          },
        });
    } else {
      this.clearFilters(1);
      this.filterTechnologyList = null;
    }
  }

  getFilterStatus(x: any, n: number) {
    this.filterStatus = x;
    if (x != null) {
      this.candidateService.getStatusFilter(this.filterStatus, n).subscribe({
        next: (res) => {
          this.candidates = res.data || [];
          this.currentPage = res.currentPage;
          this.pages = res.pages;
          this.filterCandidateStatus = true;
          this.total = res.total;
          this.totalInDataBase = this.total;

          this.filterCandidateName = false;
          this.filterCandidateTechnology = false;
          this.filterCandidateDate = false;
          this.defaultClientsPagination = false;
          this.sortCandidateNameAse = false;
          this.sortCandidateNameDec = false;
          this.sortCandidateLastNameAse = false;
          this.sortCandidateLastNameDec = false;
          this.sortCandidateWillContactAse = false;
          this.sortCandidateWillContactDec = false;
          this.sortCandidateWhenContactAse = false;
          this.sortCandidateWhenContactDec = false;
        },
        error: (error) => {
          this.warningMessage(error);
        },
      });
    } else {
      this.clearFilters(1);
      this.filterStatus = 0;
    }
  }

  clearFilters(x: any): void {
    this.candidateService.getCandidates(`?pageNumber=${x}`).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;
        this.defaultClientsPagination = true;

        this.filterCandidateStatus = false;
        this.filterCandidateTechnology = false;
        this.filterCandidateDate = false;
        this.filterCandidateName = false;
        this.sortCandidateNameAse = false;
        this.sortCandidateNameDec = false;
        this.sortCandidateLastNameAse = false;
        this.sortCandidateLastNameDec = false;
        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = false;
        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = false;
        this.sortArrayWhenWasContacted();
      },
      error: (error) => {
        this.warningMessage(error);
        if (error.status === 404) this.candidates = [];
      },
    });
  }
  errorMessage(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: `Klaida`,
      detail: `${error.error}`,
      life: 3000,
    });
  }
  warningMessage(error: any) {
    this.messageService.add({
      severity: 'warn',
      summary: `Pranešimas`,
      detail: `${error.error}`,
      life: 3000,
    });
  }
  onUpload(event: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Failas įkeltas',
      life: 3000,
    });
    this.clearFilters(1);
  }
  showMoreTech(candidate: Candidate) {
    this.AddOrEditCandidate = { ...candidate };
    this.candidateTechnologyDialog = true;
  }
  hideTechnologyDialog() {
    this.candidateTechnologyDialog = false;
  }
  triggerSearch() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getNameSurname(this.nameFilter, 1);
    }, 1000);
  }

  getNameSurname(x: string, n: number) {
    const sleep = (ms: number | undefined) =>
      new Promise((r) => setTimeout(r, ms));
    if (x.length >= 3) {
      const waitASecond = async () => {
        await sleep(500);
        this.candidateService.getNameSurnameFilter(x, n).subscribe({
          next: (res) => {
            this.candidates = res.data || [];
            this.currentPage = res.currentPage;
            this.pages = res.pages;
            this.total = res.total;
            this.totalInDataBase = this.total;

            this.filterCandidateName = true;
            this.filterCandidateStatus = false;
            this.filterCandidateTechnology = false;
            this.filterCandidateDate = false;
            this.defaultClientsPagination = false;
            this.sortCandidateNameAse = false;
            this.sortCandidateNameDec = false;
            this.sortCandidateLastNameAse = false;
            this.sortCandidateLastNameDec = false;
            this.sortCandidateWillContactAse = false;
            this.sortCandidateWillContactDec = false;
            this.sortCandidateWhenContactAse = false;
            this.sortCandidateWhenContactDec = false;
          },
          error: (error) => {
            this.candidates = [];
            // this.warningMessage(error);
          },
        });
      };
      waitASecond();
    } else {
      this.clearFilters(1);
    }
  }
  getFilterDate(page: any) {
    let date1: any;
    let date2: any;
    if (this.startDate != undefined)
      date1 = this.formatDate(this.startDate).toString();
    if (this.endDate != undefined)
      date2 = this.formatDate(this.endDate).toString();
    this.candidateService.getDateFilter(date1, date2, page).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;
        this.filterCandidateDate = true;

        this.filterCandidateName = false;
        this.filterCandidateStatus = false;
        this.filterCandidateTechnology = false;
        this.defaultClientsPagination = false;
        this.sortCandidateNameAse = false;
        this.sortCandidateNameDec = false;
        this.sortCandidateLastNameAse = false;
        this.sortCandidateLastNameDec = false;
        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = false;
        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }
  clearFilterDate() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.clearFilters(1);
  }

  updateTable() {
    if (this.currentPage == undefined) {
      //error
    } else {
      if (this.filterCandidateName == true) {
        this.getNameSurname(this.nameFilter, this.currentPage);
      }
      if (this.filterCandidateStatus == true) {
        this.getFilterStatus(this.filterStatus, this.currentPage);
      }
      if (this.filterCandidateTechnology == true) {
        this.getFilterTechnology(this.filterTechnologyList, this.currentPage);
      }
      if (this.filterCandidateDate == true) {
        this.getFilterDate(this.currentPage);
      }
      if (this.defaultClientsPagination == true) {
        this.clearFilters(this.currentPage);
      }
    }
  }

  deleteSelectedCandidates() {
    let selectedId: Int32Array[] = [];
    this.selectedCandidates.forEach((element) => {
      selectedId.push(element.id);
    });
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected candidates?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.candidateService
          .deleteCandidateArray(selectedId)
          .subscribe((res) => {
            this.updateTable();
          });
        this.messageService.add({
          severity: 'success',
          summary: 'Įvykdyta sėkminga!',
          detail: 'Candidates Deleted',
          life: 3000,
        });
        if (
          this.pages == 1 &&
          this.candidates.length == this.selectedCandidates.length
        ) {
          this.candidates = [];
        }
      },
    });
  }

  editCandidate(candidate: Candidate) {
    this.AddOrEditCandidate = { ...candidate };
    if (this.AddOrEditCandidate.willBeContacted != null)
      this.willBeContactedDate = new Date(
        this.AddOrEditCandidate.willBeContacted
      );
    else {
      this.willBeContactedDate = undefined;
      this.whenWasContactedDate = undefined;
    }
    this.candidateDialog = true;
  }
  deleteCandidate(candidate: Candidate) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + candidate.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.candidates = this.candidates.filter(
          (val) => val.id !== candidate.id
        );
        if (candidate.id != undefined) {
          this.candidateService
            .deleteCandidate(candidate.id)
            .subscribe((res) => {
              this.updateTable();
            });
          this.messageService.add({
            severity: 'success',
            summary: 'Įvykdyta sėkminga!',
            detail: 'Candidate Deleted',
            life: 3000,
          });
        }
      },
    });
  }

  hideDialog() {
    this.submitted = false;
    this.candidateDialog = false;
    this.willBeContactedDate = undefined;
    this.whenWasContactedDate = undefined;
    this.updateTable();
  }
  moveIfSorting(n: number) {
    if (this.sortCandidateNameAse == true) {
      this.sortNameAse(n);
    }
    if (this.sortCandidateNameDec == true) {
      this.sortNameDec(n);
    }
    if (this.sortCandidateLastNameAse == true) {
      this.sortSurnameAse(n);
    }
    if (this.sortCandidateLastNameDec == true) {
      this.sortSurnameDec(n);
    }
    if (this.sortCandidateWhenContactAse == true) {
      this.sortWhenWasContactedAse(n);
    }
    if (this.sortCandidateWhenContactDec == true) {
      this.sortWhenWasContactedDec(n);
    }
    if (this.sortCandidateWillContactAse == true) {
      this.sortWillBeContactedAse(n);
    }
    if (this.sortCandidateWillContactDec == true) {
      this.sortWillBeContactedDec(n);
    }
  }
  moveIfFilter(n: number) {
    if (this.defaultClientsPagination == true) {
      this.clearFilters(n);
    }
    if (this.filterCandidateName == true) {
      this.getNameSurname(this.nameFilter, n);
    }
    if (this.filterCandidateStatus == true) {
      this.getFilterStatus(this.filterStatus, n);
    }
    if (this.filterCandidateTechnology == true) {
      this.getFilterTechnology(this.filterTechnologyList, n);
    }
    if (this.filterCandidateDate == true) {
      this.getFilterDate(n);
    }
  }

  Up(page?: any) {
    const n = page + 1;
    if (n > this.pages) {
      //error
    } else {
      if (this.sortActive == false) this.moveIfFilter(n);
      if (this.sortActive == true) this.moveIfSorting(n);
    }
  }

  Down(page: any) {
    const n = page - 1;
    if (n <= 0) {
      //error
    } else {
      if (this.sortActive == false) this.moveIfFilter(n);
      if (this.sortActive == true) this.moveIfSorting(n);
    }
  }

  First() {
    const n = 1;
    if (n <= 0) {
      //error
    } else {
      if (this.sortActive == false) this.moveIfFilter(n);
      if (this.sortActive == true) this.moveIfSorting(n);
    }
  }

  Last() {
    const n = this.pages;
    if (n <= 0) {
      //error
    } else {
      if (this.sortActive == false) this.moveIfFilter(n);
      if (this.sortActive == true) this.moveIfSorting(n);
    }
  }

  updateCandidate() {
    let whenString = null;
    let willString = null;

    if (this.whenWasContactedDate != undefined)
      whenString = this.formatDate(this.whenWasContactedDate).toString();

    if (this.willBeContactedDate != undefined)
      willString = this.formatDate(this.willBeContactedDate).toString();

    if (this.AddOrEditCandidate.id) {
      this.candidates = [...this.candidates];
      this.candidates[this.findIndexByIndex(this.AddOrEditCandidate.id)] =
        this.AddOrEditCandidate;
      this.AddOrEditCandidate = {
        id: this.AddOrEditCandidate.id,
        name: this.AddOrEditCandidate.name,
        surname: this.AddOrEditCandidate.surname,
        email: this.AddOrEditCandidate.email,
        phone: this.AddOrEditCandidate.phone,
        linkedin: this.AddOrEditCandidate.linkedin,
        comment: this.AddOrEditCandidate.comment,
        statusId: this.AddOrEditCandidate.statusId,
        otherStatus: this.AddOrEditCandidate.otherStatus,
        salary: this.AddOrEditCandidate.salary,
        cVurl: this.AddOrEditCandidate.cVurl,
        recruiter: this.AddOrEditCandidate.recruiter,
        willBeContacted: willString,
        technologyIds: this.AddOrEditCandidate?.technologies.map(
          (a: { id: any }) => a.id
        ),
        clientsIds: this.AddOrEditCandidate?.clients.map(
          (a: { id: any }) => a.id
        ),
        whenWasContacted: whenString,
      };
      this.candidateService
        .editCandidate(this.AddOrEditCandidate.id, this.AddOrEditCandidate)
        .subscribe({
          next: (res) => {
            this.updateTable();
            this.messageService.add({
              severity: 'success',
              summary: 'Įvykdyta sėkminga!',
              detail: 'Kandidatas atnaujintas',
              life: 3000,
            });
          },
          error: (error) => {
            this.errorMessage(error);
          },
        });
      this.willBeContactedDate = undefined;
      this.whenWasContactedDate = undefined;
      this.candidateDialog = false;
      // this.updateTable();
    }
  }

  findIndexByIndex(id: Int32Array): number {
    let index = -1;
    for (let i = 0; i < this.candidates.length; i++) {
      if (this.candidates[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  // OFFER
  downloadFile() {
    this.confirmationService.confirm({
      message: 'Ar tikrai norite sukurti darbo pasiūlymus?',
      header: 'Patvirtinti',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedCandidates.forEach((element) => {
          this.candidateService.getOffer(element.id).subscribe({
            next: (res) => {
              let fileName = res.headers
                .get('content-disposition')
                ?.split(';')[1]
                .split('=')[1];

              let blob: Blob = res.body as Blob;
              if (fileName != null) {
                let a = document.createElement('a');
                a.download = fileName;
                a.href = window.URL.createObjectURL(blob);
                a.click();
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Įvykdyta sėkminga!',
                detail: 'Pasiūlymai sukurti',
                life: 3000,
              });
            },
            error: (error) => {
              this.errorMessage(error);
            },
          });
        });
      },
    });
  }

  onChange(event: any) {
    this.file = event.target.files[0];

    this.formData.append('Id', this.AddOrEditCandidate.id.toString());
    this.formData.append('CVurl', this.AddOrEditCandidate.cVurl);
    this.formData.append('file', this.file, this.file.name);
    this.candidateService.patchCandidateCV(this.formData).subscribe({
      next: (res) => {
        this.updateTable();

        this.messageService.add({
          severity: 'success',
          summary: 'Įvykdyta sėkminga!',
          detail: 'CV Įkeltas',
          life: 3000,
        });
      },
      error: (error) => {
        this.errorMessage(error);
      },
    });
    this.formData = new FormData();
  }

  downloadFileCV() {
    if (this.AddOrEditCandidate.cVurl != undefined) {
      this.confirmationService.confirm({
        message: 'Ar tikrai norite atsisiųsti CV?',
        header: 'Patvirtinti',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.candidateService
            .getCandidateCV(this.AddOrEditCandidate.cVurl)
            .subscribe({
              next: (res) => {
                let fileName = res.headers
                  .get('content-disposition')
                  ?.split(';')[1]
                  .split('=')[1];

                fileName?.replace('"', '');
                fileName = fileName?.replace(/^"(.+)"$/, '$1');
                let blob: Blob = res.body as Blob;
                if (fileName != null) {
                  let a = document.createElement('a');
                  a.download = fileName;
                  a.href = window.URL.createObjectURL(blob);
                  a.click();
                }
                this.messageService.add({
                  severity: 'success',
                  summary: 'Įvykdyta sėkminga!',
                  detail: 'CV atsiųstas',
                  life: 3000,
                });
              },
              error: (error) => {
                this.errorMessage(error);
              },
            });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Klaida',
        detail: 'Nerasta CV nuoroda',
        life: 3000,
      });
    }
  }

  downloadCandidateExcel() {
    this.confirmationService.confirm({
      message: 'Ar tikrai norite atsisiųsti kandidatų failą?',
      header: 'Patvirtinti',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.candidateService.getCandidateListFile().subscribe({
          next: (res) => {
            let fileName = res.headers
              .get('content-disposition')
              ?.split(';')[1]
              .split('=')[1];
            let blob: Blob = res.body as Blob;
            if (fileName != null) {
              let a = document.createElement('a');
              a.download = fileName;
              a.href = window.URL.createObjectURL(blob);
              a.click();
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Įvykdyta sėkmingai',
              detail: 'Kandidatų failas eksportuotas',
              life: 3000,
            });
          },
          error: (error) => {
            this.errorMessage(error);
          },
        });
      },
    });
  }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ];
  }

  sortNameAse(x: number) {
    this.candidateService.getNameSortAse(x).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;

        this.sortCandidateNameAse = true;
        this.sortCandidateNameDec = false;

        this.sortCandidateLastNameAse = false;
        this.sortCandidateLastNameDec = false;
        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = false;
        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }
  sortNameDec(x: number) {
    this.candidateService.getNameSortDec(x).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;

        this.sortCandidateNameDec = true;
        this.sortCandidateNameAse = false;

        this.sortCandidateLastNameAse = false;
        this.sortCandidateLastNameDec = false;
        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = false;
        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }

  sortName(x: number) {
    this.nameSort += 1;

    let sortName = document.getElementById('sortName');
    if (sortName != null && this.nameSort == 1) {
      this.buttonAse(sortName);
      this.sortNameAse(x);
    } else if (sortName != null && this.nameSort == 2) {
      this.buttonDec(sortName);
      this.sortNameDec(x);
    } else if (sortName != null && this.nameSort == 3) {
      this.buttonDefault(sortName);
      this.updateTable();
      this.nameSort = 0;
    }
  }
  sortSurnameAse(x: number) {
    this.candidateService.getLastNameSortAse(x).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;

        this.sortCandidateLastNameAse = true;
        this.sortCandidateLastNameDec = false;

        this.sortCandidateNameAse = false;
        this.sortCandidateNameDec = false;
        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = false;
        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }
  sortSurnameDec(x: number) {
    this.candidateService.getLastNameSortDec(x).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;

        this.sortCandidateLastNameAse = true;
        this.sortCandidateLastNameDec = false;

        this.sortCandidateNameDec = false;
        this.sortCandidateNameAse = false;
        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = false;
        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }

  sortSurname(x: number) {
    this.surnameSort += 1;

    let sortSurname = document.getElementById('sortSurname');
    if (sortSurname != null && this.surnameSort == 1) {
      this.buttonAse(sortSurname);
      this.sortSurnameAse(x);
    } else if (sortSurname != null && this.surnameSort == 2) {
      this.buttonDec(sortSurname);
      this.sortSurnameDec(x);
    } else if (sortSurname != null && this.surnameSort == 3) {
      this.buttonDefault(sortSurname);
      this.updateTable();
      this.surnameSort = 0;
    }
  }
  sortWillBeContactedAse(x: number) {
    this.candidateService.getWillSortAse(x).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;

        this.sortCandidateWillContactAse = true;
        this.sortCandidateWillContactDec = false;

        this.sortCandidateNameDec = false;
        this.sortCandidateNameAse = false;
        this.sortCandidateLastNameAse = false;
        this.sortCandidateLastNameDec = false;
        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }
  sortWillBeContactedDec(x: number) {
    this.candidateService.getWillSortDec(x).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;

        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = true;

        this.sortCandidateNameDec = false;
        this.sortCandidateNameAse = false;
        this.sortCandidateLastNameAse = false;
        this.sortCandidateLastNameDec = false;
        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }

  sortWillBeContacted(x: number) {
    this.willBeContactedSort += 1;
    let sortWillBeContacted = document.getElementById('sortWillBeContacted');
    if (sortWillBeContacted != null && this.willBeContactedSort == 1) {
      this.buttonAse(sortWillBeContacted);
      this.sortWillBeContactedAse(x);
    } else if (sortWillBeContacted != null && this.willBeContactedSort == 2) {
      this.buttonDec(sortWillBeContacted);
      this.sortWillBeContactedDec(x);
    } else if (sortWillBeContacted != null && this.willBeContactedSort == 3) {
      this.buttonDefault(sortWillBeContacted);
      this.updateTable();
      this.willBeContactedSort = 0;
    }
  }
  sortWhenWasContactedAse(n: number) {
    this.candidateService.getWhenSortAse(n).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;

        this.sortCandidateWhenContactAse = true;
        this.sortCandidateWhenContactDec = false;

        this.sortCandidateNameDec = false;
        this.sortCandidateNameAse = false;
        this.sortCandidateLastNameAse = false;
        this.sortCandidateLastNameDec = false;
        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }
  sortWhenWasContactedDec(n: number) {
    this.candidateService.getWhenSortDec(n).subscribe({
      next: (res) => {
        this.candidates = res.data || [];
        this.currentPage = res.currentPage;
        this.pages = res.pages;
        this.total = res.total;
        this.totalInDataBase = this.total;

        this.sortCandidateWhenContactAse = false;
        this.sortCandidateWhenContactDec = true;

        this.sortCandidateNameDec = false;
        this.sortCandidateNameAse = false;
        this.sortCandidateLastNameAse = false;
        this.sortCandidateLastNameDec = false;
        this.sortCandidateWillContactAse = false;
        this.sortCandidateWillContactDec = false;
      },
      error: (error) => {
        this.warningMessage(error);
      },
    });
  }
  sortWhenWasContacted(x: number) {
    this.whenWasContactedSort += 1;
    let sortDate = document.getElementById('sortWhenWasContacted');
    if (sortDate != null && this.whenWasContactedSort == 1) {
      this.buttonAse(sortDate);
      this.sortWhenWasContactedAse(x);
    } else if (sortDate != null && this.whenWasContactedSort == 2) {
      this.buttonDec(sortDate);
      this.sortWhenWasContactedDec(x);
    } else if (sortDate != null && this.whenWasContactedSort == 3) {
      this.buttonDefault(sortDate);
      this.updateTable();
      this.whenWasContactedSort = 0;
    }
  }
  buttonAse(changeHTML: any) {
    changeHTML.classList.remove('pi-sort-alt'); //remove the class
    changeHTML.classList.add('pi-sort-amount-up-alt'); //add the class
    changeHTML.classList.add('text-blue-500');
    this.sortActive = true;
  }
  buttonDec(changeHTML: any) {
    changeHTML.classList.remove('pi-sort-amount-up-alt'); //remove the class
    changeHTML.classList.add('pi-sort-amount-down'); //add the class
    this.sortActive = true;
  }
  buttonDefault(changeHTML: any) {
    changeHTML.classList.remove('pi-sort-amount-down'); //remove the class
    changeHTML.classList.remove('text-blue-500'); //remove the class
    changeHTML.classList.add('pi-sort-alt'); //add the class
    this.sortActive = false;
  }
}
