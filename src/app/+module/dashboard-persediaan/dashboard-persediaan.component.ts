import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Highcharts, Chart } from 'angular-highcharts';
import { AppService } from 'src/app/shared/app.service';
import * as Prism from 'prismjs';
import { MessageService, Message, LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-dashboard-persediaan',
  templateUrl: './dashboard-persediaan.component.html',
  styleUrls: ['./dashboard-persediaan.component.css'], styles: [`
  /* Column Priorities */
  @media only all {
      th.ui-p-6,
      td.ui-p-6,
      th.ui-p-5,
      td.ui-p-5,
      th.ui-p-4,
      td.ui-p-4,
      th.ui-p-3,
      td.ui-p-3,
      th.ui-p-2,
      td.ui-p-2,
      th.ui-p-1,
      td.ui-p-1 {
          display: none;
      }
  }
  
  /* Show priority 1 at 320px (20em x 16px) */
  @media screen and (min-width: 20em) {
      th.ui-p-1,
      td.ui-p-1 {
          display: table-cell;
      }
  }
  
  /* Show priority 2 at 480px (30em x 16px) */
  @media screen and (min-width: 30em) {
      th.ui-p-2,
      td.ui-p-2 {
          display: table-cell;
      }
  }
  
  /* Show priority 3 at 640px (40em x 16px) */
  @media screen and (min-width: 40em) {
      th.ui-p-3,
      td.ui-p-3 {
          display: table-cell;
      }
  }
  
  /* Show priority 4 at 800px (50em x 16px) */
  @media screen and (min-width: 50em) {
      th.ui-p-4,
      td.ui-p-4 {
          display: table-cell;
      }
  }
  
  /* Show priority 5 at 960px (60em x 16px) */
  @media screen and (min-width: 60em) {
      th.ui-p-5,
      td.ui-p-5 {
          display: table-cell;
      }
  }
  
  /* Show priority 6 at 1,120px (70em x 16px) */
  @media screen and (min-width: 70em) {
      th.ui-p-6,
      td.ui-p-6 {
          display: table-cell;
      }
  }
`],
  providers: [MessageService]
})
export class DashboardPersediaanComponent implements OnInit, AfterViewInit {
  public now: Date = new Date();
  colors = Highcharts.getOptions().colors;
  loadingInfoStok: boolean;
  columnStok: any[];
  columnStokDetail: any[];
  resultDataStok: any;
  dataSourceStok: any;
  dataSourceDetailStok: any;
  showDetailStok: boolean = false;
  totalAll: any;
  constructor(public httpservice: AppService, private messageService: MessageService) { }

  ngOnInit() {

    this.columnStok = [
      { field: 'namaproduk', header: 'Nama Produk' },
      { field: 'satuanstandar', header: 'Satuan' },
      { field: 'qtyproduk', header: 'Stok Tersedia' }
    ];

    this.columnStokDetail = [
      { field: 'namaruangan', header: 'Ruangan' },
      { field: 'namaproduk', header: 'Nama Produk' },
      { field: 'satuanstandar', header: 'Satuan' },
      { field: 'qtyproduk', header: 'Stok' }
    ];

    this.getInfoStok();
  }

  selectedGridStok(row) {
    let data = this.resultDataStok.data
    let datas = []
    this.totalAll = 0;
    // this.jumlahna = 0
    for (let i in data) {
      if (row.namaproduk == data[i].namaproduk) {
        // this.jumlahna = this.jumlahna + parseFloat(data[i].jumlah)
        // data[i].total = parseFloat(data[i].jumlah) * parseFloat(data[i].tarif)
        // this.totalTotal = this.totalTotal + parseFloat(data[i].total)
        datas.push(data[i])
      }
    }

    // for (let a in datas) {
    //   datas[a].tariff = 'Rp.' + Highcharts.numberFormat(datas[a].tarif, 0, '.', ',')
    //   datas[a].totall = 'Rp.' + Highcharts.numberFormat(datas[a].total, 0, '.', ',')
    // }
    // this.totalAll = 'Rp.' + Highcharts.numberFormat(this.totalTotal, 0, '.', ',')
    console.log(datas)
    for(let i in datas){
      datas[i].qtyproduk = Highcharts.numberFormat( datas[i].qtyproduk, 0, '.', ',')
    }
    this.dataSourceDetailStok = datas
    this.showDetailStok = true
    this.messageService.add({ severity: 'info', summary: 'Selected :', detail: row.dokter });
  }
  getInfoStok() {
    this.loadingInfoStok = true;
    this.httpservice.getTransaksi('eis-persediaan/get-info-stok').subscribe(data => {
      this.resultDataStok = data
      let array = this.resultDataStok.data
      let sama = false
      let groupingArr = []
      for (let i = 0; i < array.length; i++) {
        sama = false
        for (let x = 0; x < groupingArr.length; x++) {
          if (array[i].namaproduk == groupingArr[x].namaproduk) {
            sama = true;
            groupingArr[x].qtyproduk = parseFloat(array[i].qtyproduk) + parseFloat(groupingArr[x].qtyproduk)
          }
        }
        if (sama == false) {
          let result = {
            namaproduk: array[i].namaproduk,
            satuanstandar: array[i].satuanstandar,
            qtyproduk: parseFloat(array[i].qtyproduk),
          }
          groupingArr.push(result)
        }
      }
      console.log(groupingArr)
      for(let i in groupingArr){
        groupingArr[i].qtyproduk = Highcharts.numberFormat( groupingArr[i].qtyproduk, 0, '.', ',')
      }
      this.loadingInfoStok = false;
      this.dataSourceStok = groupingArr
    })
  }
  /**
        * @method ngAfterViewInit
        */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}

