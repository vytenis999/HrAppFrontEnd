import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {Candidate, Technologies, Page, CandidateLinkedIn} from '../models/candidate.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  readonly rootUrl = environment.apiUrl;
  private _urlCandidate:string = this.rootUrl + '/Candidate';
  private _urlTechnology:string = this.rootUrl + '/Technology';
  private _urlStatus:string = this.rootUrl + '/Status';
  private _urlClient:string = this.rootUrl + '/Client';
  constructor(private http: HttpClient) { }
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  options = {headers: this.headers};

  getCandidates(url:string):Observable<Page>{
    return  this.http.get<Page>(this._urlCandidate+url,this.options);
  }
  getTechnologies():Observable<any[]>{

    return this.http.get<any>(this._urlTechnology,this.options)
  }
  getClients():Observable<any[]>{

    return this.http.get<any>(this._urlClient + '/GetClientList',this.options)
  }
  getStatus():Observable<any[]>{

    return this.http.get<any>(this._urlStatus, this.options)
  }

  postCandidates(candidate :any){

      return this.http.post<Candidate>(this._urlCandidate,candidate);
  }

  postTechnology(technology:Technologies){

    return this.http.post<string>(this._urlTechnology,technology,this.options);
  }

  deleteTechnology(id:any){

    return this.http.delete<any>(this._urlTechnology+`/${id}`,this.options);
  }
  // Filters
  postTechFilter(arrayId:any,page:any){
    return this.http.post<Page>(this._urlCandidate+'/filter/technologies'+`?pageNumber=${page}`,arrayId,this.options);
  }
  getStatusFilter(id:any,page:any){
    return this.http.get<Page>(this._urlCandidate+'/filter/status'+`/${id}?pageNumber=${page}`,this.options);
  }
  getNameSurnameFilter(name:string,page:any){
    return this.http.post<Page>(this._urlCandidate+'/filter/NameAndSurname'+`/${name}?pageNumber=${page}`,this.options);
  }
  getDateFilter(date1:any,date2:any,page:any){
    return this.http.get<Page>(this._urlCandidate+'/filter/date'+`/${date1}/${date2}?pageNumber=${page}`,this.options);
  }
  //Sorting
  getNameSortAse(page:any){
    return this.http.get<Page>(this._urlCandidate+'/returnCandidateListNameAsending'+`?pageNumber=${page}`,this.options);
  }
  getNameSortDec(page:any){
    return this.http.get<Page>(this._urlCandidate+'/returnCandidateListNameDesending'+`?pageNumber=${page}`,this.options);
  }
  getLastNameSortAse(page:any){
    return this.http.get<Page>(this._urlCandidate+'/returnCandidateListSurNameAsending'+`?pageNumber=${page}`,this.options);
  }
  getLastNameSortDec(page:any){
    return this.http.get<Page>(this._urlCandidate+'/returnCandidateListSurNameDesending'+`?pageNumber=${page}`,this.options);
  }
  getWhenSortAse(page:any){
    return this.http.get<Page>(this._urlCandidate+'/returnCandidateListWhenContactAsending'+`?pageNumber=${page}`,this.options);
  }
  getWhenSortDec(page:any){
    return this.http.get<Page>(this._urlCandidate+'/returnCandidateListWhenContactDesending'+`?pageNumber=${page}`,this.options);
  }
  getWillSortAse(page:any){
    return this.http.get<Page>(this._urlCandidate+'/returnCandidateListWillContactAsending'+`?pageNumber=${page}`,this.options);
  }
  getWillSortDec(page:any){
    return this.http.get<Page>(this._urlCandidate+'/returnCandidateListWillContactDesending'+`?pageNumber=${page}`,this.options);
  }
  
  // Delete
  deleteCandidate(id:any):Observable<any>{
      return this.http.delete(this._urlCandidate+`/${id}`,this.options);
  }
  deleteCandidateArray(idArray:any){
    return this.http.post(this._urlCandidate+'/multidelete',idArray,this.options);
  }


  // Edit
  editCandidate(id:Int32Array,edit:any){
    return this.http.patch(this._urlCandidate+`/${id}`,edit,this.options)
    .pipe(catchError((err)=>{return NEVER;}));
  }
  // Files
  getOffer(id:Int32Array){
      return this.http.get(this.rootUrl+'/Offer'+`/${id}`,{observe:'response',responseType:'blob'});
  }
  getCandidateListFile(){
    return this.http.get(this._urlCandidate+'/DownloadCandidatesListFile',{observe:'response',responseType:'blob'})
  }
  getCandidateCV(url:string){
    url=url.replace('/','%2F');
    return this.http.get(this._urlCandidate+'/DownloadCandidateCV'+`/${url}`,{observe:'response',responseType:'blob'});
  }
  patchCandidateCV(formData:any){
    return this.http.patch(this._urlCandidate+'/FileUpdate',formData)
  }

  postCVFile(id:any,file:any){
    return this.http.post(this._urlCandidate+'/UploadFile'+`/${id}`,file,this.options);
  }

  postLinkedIn(link:any){
    link = link.toString();
    return this.http.post<CandidateLinkedIn>(this._urlCandidate + '/LinkedIn', JSON.stringify(link), this.options);
  }

  checkLinkedIn(link:any){
    link = link.toString();
    return this.http.post<boolean>(this._urlCandidate + '/CheckLinkedIn', JSON.stringify(link), this.options);
  }
}
