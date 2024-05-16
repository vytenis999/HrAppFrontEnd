import { Component, OnInit } from '@angular/core';
import { TaxServiceService } from 'src/app/services/tax.service.service';
import { TaxReturn } from 'src/app/models/tax.model';
import { Tax } from 'src/app/models/tax.model';
import { dates } from 'src/app/models/tax.model';
import { empty } from 'rxjs';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {

  private taxreturn?: TaxReturn;
  private test?: Tax;

  dates: dates[] = [];
  selectedDate!: string;
  checkboxValue = false;
  year?: string;
  salary = '';
  salary_type = '1';
  npd = '1';
  npd_pats = '';
  pensija_papil = '0';
  pensija_kiekis!: string;
  ant_pop_x: string = '';
  darb_kaina: string = '';
  i_rankas_x: string = '';

  constructor(private taxservice: TaxServiceService) {
  }

  ngOnInit(): void {

    var currentDate = new Date().getFullYear();

      while (currentDate >= 2016) {

      var date: dates;
      date = {name: '', value: ''}
      date.name = currentDate.toString();
      date.value = currentDate.toString();
      this.dates.push(date);
      currentDate--;

    }
  }

  getTax() {

    this.test = {
      year: '2022',
      salary: this.salary,
      salary_type: '1',
      npd: '1',
      npd_pats: '0',
      pensija_papil: '0',
      pensija_kiekis: '0.027',
      ant_pop_x: '1',
      darb_kaina: '1',
      i_rankas_x: '1',
    }

    this.test.year = this.selectedDate;
    this.test.salary_type = this.salary_type;
    this.test.npd = this.npd;
    this.test.npd_pats = this.npd_pats;
    if (this.checkboxValue == true) this.test.pensija_papil = '1';
    if (this.pensija_kiekis != undefined) this.test.pensija_kiekis = this.pensija_kiekis;

    this.taxservice.getSalary(this.test).subscribe((val) => {

      this.ant_pop_x = val.ant_pop_x;
      this.darb_kaina = val.darb_kaina;
      this.i_rankas_x = val.i_rankas_x;

    });
  }
}
