import { Component, AfterViewInit, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import * as Prism from 'prismjs';
import { AppService } from '../../shared/app.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Chart, Highcharts } from 'angular-highcharts';



@Component({
  selector: 'app-rawatjalan',
  templateUrl: './rawatjalan.component.html',
  styleUrls: ['./rawatjalan.component.css']
})


export class RawatJalanComponent implements OnInit, AfterViewInit {
  public now: Date = new Date();
  tglAwal: Date;

  displayedColumnsRekap = ['tahunregis', 'total', 'diperiksa', 'belumperiksa', 'batalregistrasi'];
  displayedColumns = ['namaruangan', 'total', 'belumperiksa', 'diperiksa', 'batalregistrasi'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<dataGridInfoRuangan>;
  dataSourceRekap: MatTableDataSource<dataGridRekap>;
  constructor(public appservice: AppService) {
  }
  gridInfoKedatangan: any;
  dataRekap: any;

  ngOnInit() {

    this.appservice.getTransaksi('eis/get-rekap-kunjungan-rawatjalan').subscribe(data => {
      this.dataRekap = data;
      this.dataSourceRekap = new MatTableDataSource(this.dataRekap.result);
      this.dataSourceRekap.paginator = this.paginator;
      this.dataSourceRekap.sort = this.sort;
    })
    this.appservice.getTransaksi('eis/get-info-kunjungan-rawatjalan').subscribe(data3 => {
      this.gridInfoKedatangan = data3;
      this.dataSource = new MatTableDataSource(this.gridInfoKedatangan);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  /**
 * @method ngAfterViewInit
 */
  ngAfterViewInit() {
    Prism.highlightAll();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;


  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  applyFilterRekap(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceRekap.filter = filterValue;
  }


}
export interface dataGridInfoRuangan {
  namaruangan: string;
  belumperiksa: string;
  diperiksa: string;
  batalregistrasi: string;
  total: string;
}



export interface dataGridRekap {
  tahunregis: string;
  total: string;
  diperiksa: string;
  belumperiksa: string;
  batalregistrasi: string;

}