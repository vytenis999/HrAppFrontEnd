export interface Tax {
    year: string;
    salary: string;
    salary_type: string;
    npd: string;
    npd_pats: string;
    pensija_papil: string;
    pensija_kiekis: string;
    ant_pop_x: string,
    darb_kaina: string,
    i_rankas_x: string,
    
}
 export interface TaxReturn {
     npd: string;
     pnpd: string; 
     paj_mok:string;
      psd_darbuotojo:string; 
      sodra_3:string;
      i_rankas_x:string;
       sodra_31:string;
       darb_kaina:string;
       ant_pop_x:string;
       tarif_psd_darbuotojo:string; 
       tarif_sodra_darbuotojo:string; 
       tarif_sodra_darbdavio:string;
       tarif_paj_mok:string;
        message:string;
}

export interface dates {
  name: string,
  value: string,
}
