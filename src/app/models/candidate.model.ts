
export class Candidate  {
    id!: Int32Array;
    name:string='';
    surname:string='';
    email?:string='';
    phone?:string='';
    linkedin?:string='';
    comment?:string='';
    statusId?:any;
    otherStatus?:string;
    salary?:string;
    cVurl!:string;
    recruiter?:string='';
    willBeContacted:any;
    technologies?:any;
    clients?:any;
    whenWasContacted:any;
    technologyIds?:any;
    clientsIds?:any;
    file?:any;
  }


  export class Technologies{
    id?:Int32Array;
    technologyName:string="";
  }

  export class Clients{
    id?:Int32Array;
    name:string='';
    comment?:string='';
  }
  export class Status{
    id?:any;
    value?:string='';
  }
  export class WhenWasContacted{
    id?:Int32Array;
    date?:Date;
  }
  export class Page{
    pages?:number;
    currentPage?:number;
    total?: number;
    data?:Candidate[];
  }
  export class CandidateLinkedIn{
  name?:string;
  surname?:string;
  }
