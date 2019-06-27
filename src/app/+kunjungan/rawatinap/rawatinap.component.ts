import { Component, AfterViewInit, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import * as Prism from 'prismjs';
import { AppService } from '../../shared/app.service';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Chart ,Highcharts} from 'angular-highcharts';
@Component({
  selector: 'app-rawatinap',
  templateUrl: './rawatinap.component.html',
  styleUrls: ['./rawatinap.component.css']
})
export class RawatinapComponent implements AfterViewInit, OnInit {
  displayedColumns = ['tglmasuk', 'nocm', 'noregistrasi', 'namapasien', 'ruangperawatan',
    'kelas', 'jeniskelamin', 'kamar', 'nobed'];
  dataSource: MatTableDataSource<dataGridPasienDirawat>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public appservice: AppService) {
  }

  public now: Date = new Date();
  dataPasienDirawat: any;
  rekapPasienDirawat: any;
  chart: any;
  chart10Diagnosa: any;
  data10Diagnosa: any;

  colorNyieun = ['#7cb5ec', '#FF0000', '#C71585', '#434348', '#90ed7d', '#f7a35c',
    '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b',
    '#91e8e1', '#CD5C5C', '#FF69B4', '#FF8C00', '#9370DB', '#ADFF2F',
    '#00FF00', '#9ACD32', '#66CDAA', '#00FFFF', '#4682B4', '#800000',
    '#CD853F', '#191970', '#1E90FF', '#00CED1'];

  ngOnInit() {
    this.appservice.getTransaksi('eis/get-daftar-pasien-dirawat').subscribe(data => {
      this.dataPasienDirawat = data;
      this.dataSource = new MatTableDataSource(this.dataPasienDirawat.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.appservice.getTransaksi('eis/get-rekap-pasien-ri').subscribe(data => {
      this.rekapPasienDirawat = data;
    })
    //   chart 10 Besar Diagnosa
    this.appservice.getTransaksi('eis/get-topten-diagnosa').subscribe(data => {
      this.data10Diagnosa = data;

      var pie1 = 2;
      var series = [];
      var categories = [];
      var loopIndex = 0;
      for (var i in this.data10Diagnosa) {
        categories.push(this.data10Diagnosa[i].kddiagnosa);
        var dataz2 = [];
        dataz2.push({
          y: parseFloat(this.data10Diagnosa[i].jumlah),
          color: this.colorNyieun[i]
        });
        if (loopIndex < 10)
          series.push({
            name: this.data10Diagnosa[i].kddiagnosa,
            data: dataz2
          });
        loopIndex++;

      }
      this.chart10Diagnosa = new Chart({
        chart: {
          type: 'column',
        },

        title: {
          text: ''
        },
        xAxis: {
          categories: ["Jumlah "],
          labels: {
            align: 'center',
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          title: {
            text: 'Kunjungan Pasien'
          }
        },
        plotOptions: {
          column: {
            // url:"#",
            cursor: 'pointer',

            dataLabels: {
              enabled: true,
              color: this.colorNyieun[3],

              formatter: function () {
                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien';
              }
            },
            showInLegend: true
          }
        },
        tooltip: {
          formatter: function () {
            var point = this.point,
              s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pasien <br/>';
            return s;

          }
          // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          //     '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
          // footerFormat: '</table>',
          // shared: true,
          // useHTML: true
        },
        series: series,
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },

      })
    })
    // end
  }
  /**
  * @method ngAfterViewInit
  */
  ngAfterViewInit() {
    Prism.highlightAll();


  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }



}
export interface dataGridPasienDirawat {
  tglmasuk: string;
  nocm: string;
  noregistrasi: string;
  namapasien: string;
  ruangperawatan: string;
  kelas: string;
  jeniskelamin: string;
  kamar: string;
  nobed: string;

}
