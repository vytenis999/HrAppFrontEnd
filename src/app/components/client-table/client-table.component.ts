import { Component, OnInit } from '@angular/core';
import {Client, ClientCandidate, Page} from "../../models/client.model";
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.scss']
})
export class ClientTableComponent implements OnInit {

  userDialog!: boolean;

  clientCandidateDialog!: boolean

  clientOverSizedTextDialog!: boolean;

  text: string = "";

  clients: Client[] = [];

  client!: Client;

  clientCandidates?: any;

  selectedClients: Client[] = [];

  selectedClientsId: any[] = [];

  submitted!: boolean;

  currentPage?: number;

  pages?: any;

  total: any;

  search: string = "";

  filterByNameLength: number = 3;

  defaultClientsPagination: boolean = false;

  SearchClientsPagination: boolean = false;

  willBeContacted?: Date;

  constructor(private clientService: ClientService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  showClientOverSizedTextDialog(text: string) {
    this.text = text;
    this.clientOverSizedTextDialog = true;
  }

  ngOnInit() {
    this.getCandidates();
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

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  FilterByName(value: any, page:any) {
    this.clientService.get(`/filter/${value}?pageNumber=${page}`).subscribe({
      next: (data) => {
        this.clients = data.data || [];
        this.currentPage = data.currentPage;
        this.pages = data.pages;
        this.total = data.total;
        this.SearchClientsPagination = true;
        this.defaultClientsPagination = false;
      },
      error: (error) => {
        this.warningMessage(error);
      }
    });
  }

  DefaultListPagination(page: any) {
    this.clientService.get(`?pageNumber=${page}`).subscribe({
      next: (data) => {
        this.clients = data.data || [];
        this.currentPage = data.currentPage;
        this.pages = data.pages;
      },
      error: (error) => {
        console.log(error.status);
      }
    });
  }

  Search(value: any) {
    if(value.value.length >= this.filterByNameLength) {
      this.search = value.value;
      this.FilterByName(this.search, 1);
    } else if(value.value.length <= 0) {
      this.getCandidates();
      this.search = value.value;
    }

  }
  
  Up(page?: any) {
    const n = page + 1;
    if(n > this.pages) {
      //error
    } else {

      if(this.SearchClientsPagination == true) {
        this.FilterByName(this.search, n);
      }

      if(this.defaultClientsPagination == true) {
        this.DefaultListPagination(n);
      }
    }
  }

  Down(page: any) {
    const n = page - 1;
    if(n <= 0) {
      //error
    } else {
      if(this.SearchClientsPagination == true) {
        this.FilterByName(this.search, n);
      }
      
      if(this.defaultClientsPagination == true) {
        this.DefaultListPagination(n);
      }
    }
  }

  getCandidates() {
    this.clientService.get(``).subscribe({
      next: (data) => {
        this.clients = data.data || [];
        this.currentPage = data.currentPage;
        this.pages = data.pages;
        this.total = data.total;
        this.defaultClientsPagination = true;
        this.SearchClientsPagination = false;
      },
      error: (error) => {
        this.warningMessage(error);
        if(error.status === 404) {
          this.clients = [];
        }
      }
    });
  }

  errorMessage(error:any) {
    this.messageService.add({severity:'error', summary: `Klaida`, detail: `${error.error}`, life: 3000});
  }
  warningMessage(error:any){
    this.messageService.add({severity:'warn', summary: `Pranešimas`, detail: `${error.error}`, life: 3000});
  }

  editClientCandidate(client: Client) {
    this.client = {...client};
    this.clientCandidates = client.candidates;
    this.clientCandidateDialog = true;
  }

  deleteClientCandidate(clientCandidate: ClientCandidate) {
    this.confirmationService.confirm({
      message: 'Ar tikrai norite ištrinti šį kandidatą?',
      header: 'Patvirtinti',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.deleteClientCandidate(this.client.id, clientCandidate.id).subscribe({
          next: () => {
            this.clientCandidates = this.client.candidates?.filter(c => c.id !== clientCandidate.id);
            this.client.candidates = this.clientCandidates;
            const indexOfClient = this.clients.findIndex(c => c.id == this.client.id);
            this.clients.splice(indexOfClient,1,this.client);
            this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Kandidatas ištrintas', life: 3000});
          },
          error: (error) => {
            this.errorMessage(error);
          }
        });
      }
    });
  }

  openNew() {
    this.client = {};
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectedClients() {
    this.selectedClients.forEach(c => this.selectedClientsId.push(c.id));
    this.confirmationService.confirm({
      message: 'Ar tikrai norite ištrinti šiuos klientus?',
      header: 'Patvirtinti',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.deleteMany(this.selectedClientsId).subscribe({
          next: () => {
            console.log(this.selectedClients.length);
            this.total = this.total - this.selectedClients.length;
            this.clients = this.clients.filter(val => !this.selectedClients.includes(val));
            this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Klientai ištrinti', life: 3000});
          },
          error: (error) => {
            this.errorMessage(error);
          }
        });
      }
    });
  }

   editClient(client: Client) {
     this.client = {...client};
     this.userDialog = true;
   }
    deleteClient(client: Client) {
      this.confirmationService.confirm({
        message: 'Ar tikrai norite ištrinti šį vartotoją?',
        header: 'Patvirtinti',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.clientService.delete(client.id).subscribe({
            next: () => {
              const indexOfClient = this.clients.findIndex(c => c.id == client.id);
              this.clients.splice(indexOfClient,1);
              this.total--;
              this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Klientas ištrintas', life: 3000});
            },
            error: (error) => {
              this.errorMessage(error);
            }
          });
        }
      });
  }

  hideDialog() {
    this.userDialog= false;
    this.submitted = false;
  }

  saveClient() {
    if(this.willBeContacted != undefined) {
      let date = this.formatDate(this.willBeContacted);
      this.client.willBeContacted = `${date[0]}-${date[1]}-${date[2]}`;
    }
    const clientKeys = Object.keys(this.client);
    if(clientKeys.find(x => x == "id") == undefined) {
      this.submitted = true;
      this.clientService.create(this.client).subscribe({
        next: (data) => {
          this.willBeContacted = undefined;
          this.clients.push({id: data.id, name: data.name, project: data.project, comment: data.comment, willBeContacted: data.willBeContacted, candidates: data.candidates});
          this.total++;
          this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Klientas pridėtas', life: 3000});
        },
        error: (error) => {
          this.errorMessage(error);
        }
      });
      this.userDialog = false;
      this.client = {};
    } else {
      if(this.willBeContacted != undefined) {
        let date = this.formatDate(this.willBeContacted);
        this.client.willBeContacted = `${date[0]}-${date[1]}-${date[2]}`;
      }
      this.submitted = true;
      const editedClientCandidates = this.client.candidates;
      this.clientService.update(this.client.id, this.client).subscribe({
        next: (data) => {
          this.willBeContacted = undefined;
          const indexOfClient = this.clients.findIndex(c => c.id == data.id);
          this.clients.splice(indexOfClient,1,{id: data.id, name: data.name, project: data.project, comment: data.comment,willBeContacted: data.willBeContacted , candidates: editedClientCandidates});
          this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Klientas redaguotas', life: 3000});
        },
        error: (error) => {
          this.errorMessage(error);
        }
      });
      this.userDialog = false;
      this.client = {};
    }
  }

}
