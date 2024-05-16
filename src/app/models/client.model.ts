export class Client {
    id?: number;
    name?: string;
    project?: string;
    comment?: string;
    willBeContacted?: string;
    candidates?: ClientCandidate[];
}

export class ClientCandidate {
    id?: number;
    name?: string;
    surName?: string;
    email?: string;
    technologies?: any;
}

export class Page{
    pages?: number;
    currentPage?: number;
    total?: number;
    data?: Client[];
}