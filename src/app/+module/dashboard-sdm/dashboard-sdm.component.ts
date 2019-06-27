import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Highcharts, Chart } from 'angular-highcharts';
import { AppService } from 'src/app/shared/app.service';
import * as Prism from 'prismjs';
import { MessageService, Message, LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-dashboard-sdm',
  templateUrl: './dashboard-sdm.component.html',
  styleUrls: ['./dashboard-sdm.component.css'],
  styles: [`
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
export class DashboardSdmComponent implements AfterViewInit, OnInit {
  public now: Date = new Date();
  colors = Highcharts.getOptions().colors;
  chartStatusPegawai: any;
  chart: any;
  chartKelompokJabatan: any;
  chartJK: any;
  chartUnitKerja: any;
  chartUsia: any;
  chartPendidikan: any;
  resultData: any;
  resultDataLayanan: any;
  totalPaegawai: number = 0;
  totalAktif: number = 0;
  totalNonAktif: number = 0;
  totalPensiun: number = 0;
  cols: any[];
  columnPopupLayanan: any[];
  dataSourceLayanan: any;
  dataSourceLayananDetails: any;
  showDetailDokter: boolean = false;
  loadingLayananGrid: boolean;
  totaltarif: any;
  totalTotal: any;
  jumlahna: any;
  apiTimer: any;
  counter = 10;

  constructor(public httpservice: AppService, private messageService: MessageService) {
  }
  ngOnInit() {
    this.apiTimer = setInterval(() => {
      this.getData()
      this.getLayananDokter()
    }, (this.counter * 6000)); //60 detik


    this.getData();
    this.getLayananDokter()
    this.cols = [
      { field: 'dokter', header: 'Dokter' },
      { field: 'count', header: 'Jumlah Layanan' }
    ];

    this.columnPopupLayanan = [
      { field: 'tglpelayanan', header: 'Tgl' },
      { field: 'nocm', header: 'No RM' },
      { field: 'namapasien', header: 'Nama Pasien' },
      { field: 'dokter', header: 'Dokter' },
      { field: 'layanan', header: 'Nama Layanan' },
      { field: 'tariff', header: 'Tarif' },
      { field: 'jumlah', header: 'Jumlah' },
      { field: 'totall', header: 'Total' }

    ];
  }
  /**
     * @method ngAfterViewInit
     */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
  selectedGridDokter(row) {
    let rows = row;
    let data = this.resultDataLayanan.data
    let datas = []
    this.totaltarif = 0;
    this.totalTotal = 0;
    this.jumlahna = 0
    for (let i in data) {
      if (row.iddokter == data[i].iddokter) {
        // this.totaltarif =  this.totaltarif + parseFloat(data[i].tarif)

        this.jumlahna = this.jumlahna + parseFloat(data[i].jumlah)
        data[i].total = parseFloat(data[i].jumlah) * parseFloat(data[i].tarif)
        this.totalTotal = this.totalTotal + parseFloat(data[i].total)

        datas.push(data[i])
      }
    }

    for (let a in datas) {

      datas[a].tariff = 'Rp.' + Highcharts.numberFormat(datas[a].tarif, 0, '.', ',')
      datas[a].totall = 'Rp.' + Highcharts.numberFormat(datas[a].total, 0, '.', ',')
    }
    this.totalTotal = 'Rp.' + Highcharts.numberFormat(this.totalTotal, 0, '.', ',')
    console.log(datas)
    this.dataSourceLayananDetails = datas
    this.showDetailDokter = true
    this.messageService.add({ severity: 'info', summary: 'Selected :', detail: row.dokter });
  }
  getData() {
    this.httpservice.getTransaksi('eis-sdm/get-count-pegawai').subscribe(data => {
      this.resultData = data

      /**
     * @method chart Kategori Pegawai
     */
      let jumlahKatPegawai = this.resultData.kategoripegawai
      // let sama = false
      // let jumlahKatPegawai = []
      // for (let i = 0; i < kategoriPegawai.length; i++) {
      //   // for (let i in kategoriPegawai) {
      //   kategoriPegawai[i].total = 0
      //   if (kategoriPegawai[i].kategorypegawai == null) {
      //     kategoriPegawai[i].kategorypegawai = '-'
      //   }
      //   sama = false
      //   for (let x = 0; x < jumlahKatPegawai.length; x++) {
      //     // for (let x in jumlahKatPegawai) {
      //     if (jumlahKatPegawai[x].kategorypegawai == kategoriPegawai[i].kategorypegawai) {
      //       sama = true;

      //       jumlahKatPegawai[x].total = parseFloat(jumlahKatPegawai[x].total) + 1
      //     }
      //   }
      //   if (sama == false) {
      //     let result = {
      //       kategorypegawai: kategoriPegawai[i].kategorypegawai,
      //       total: parseFloat(kategoriPegawai[i].total),
      //     }
      //     jumlahKatPegawai.push(result)
      //   }
      // }

      // console.log(jumlahKatPegawai)
      // asupkeun kana series data di CHART
      let seriesKatPegawai = []
      let slice = true
      let totalAll = 0
      for (let z in jumlahKatPegawai) {
        if (jumlahKatPegawai[z].kategorypegawai == null)
          jumlahKatPegawai[z].kategorypegawai = '-'
        totalAll = totalAll + parseFloat(jumlahKatPegawai[z].total)
        let datana = [];
        datana.push({
          y: parseFloat(jumlahKatPegawai[z].total),
          color: this.colors[z],
          drilldown: jumlahKatPegawai[z].kategorypegawai
        });
        seriesKatPegawai.push({
          name: jumlahKatPegawai[z].kategorypegawai,
          y: parseFloat(jumlahKatPegawai[z].total),
          sliced: slice,
          selected: slice
        });
        slice = false;
      }
      console.log(seriesKatPegawai)
      // total Pegawai kabeh

      let statusPegawaiss = this.resultData.statuspegawai
      let totalAktifs = 0
      let totalNonAktifs = 0
      let totalPensiuns = 0
      for (let s in statusPegawaiss) {
        if (statusPegawaiss[s].statuspegawai == 'Aktif') {
          totalAktifs = parseFloat(statusPegawaiss[s].total)
        }
        // if (statusPegawaiss[s].statuspegawai == 'Pensiun') {
        //   totalPensiuns = parseFloat(statusPegawaiss[s].total)
        // }
        if (statusPegawaiss[s].statuspegawai != 'Aktif') {
          totalNonAktifs = totalNonAktifs + parseFloat(statusPegawaiss[s].total)
        }

      }
      this.totalAktif = totalAktifs
      this.totalNonAktif = totalNonAktifs //this.totalPaegawai - totalAktifs - totalPensiuns
      this.totalPensiun = totalPensiuns
      this.totalPaegawai = totalAktifs + totalNonAktifs + totalPensiuns
      // total Pegawai kabeh

      this.chartStatusPegawai = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: '',
        },
        tooltip: {
          formatter: function (e) {
            let point = this.point,
              s = this.percentage.toFixed(2) + ' %';//this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';
            return s;

          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';// this.percentage.toFixed(2) + ' %';
              }
            },
            showInLegend: true
          },

        },
        credits: {
          text: 'Total : ' + totalAll
          // enabled: false
        },
        legend: {
          enabled: true,
          borderRadius: 5,
          borderWidth: 1
        },
        series: [{
          type: 'pie',
          name: 'Total',
          // colorByPoint: true,
          data: seriesKatPegawai

        }]
      })

      /**
      * @method Endchart Kategori Pegawai
      */

      /**
     * @method chart Kelompok Pegawai
     */
      let jumlahkelompokJabatan = this.resultData.kelompokjabatan
      // let samateu = false
      // let jumlahkelompokJabatan = []
      // for (let i in arrKelompokJabatan) {
      //   arrKelompokJabatan[i].total = 0
      //   if (arrKelompokJabatan[i].namakelompokjabatan == null) {
      //     arrKelompokJabatan[i].namakelompokjabatan = '-'
      //   }
      //   samateu = false
      //   for (let x in jumlahkelompokJabatan) {
      //     if (jumlahkelompokJabatan[x].namakelompokjabatan == arrKelompokJabatan[i].namakelompokjabatan) {
      //       samateu = true;
      //       jumlahkelompokJabatan[x].total = parseFloat(jumlahkelompokJabatan[x].total) + 1
      //     }
      //   }
      //   if (samateu == false) {
      //     let result = {
      //       namakelompokjabatan: arrKelompokJabatan[i].namakelompokjabatan,
      //       total: parseFloat(arrKelompokJabatan[i].total),
      //     }
      //     jumlahkelompokJabatan.push(result)
      //   }
      // }

      // console.log(jumlahkelompokJabatan)
      // asupkeun kana series data di CHART
      let serieskelompokJabatan = []
      let slices = true

      for (let z in jumlahkelompokJabatan) {
        if (jumlahkelompokJabatan[z].namakelompokjabatan == null)
          jumlahkelompokJabatan[z].namakelompokjabatan = '-'
        let datana = [];
        datana.push({
          y: parseFloat(jumlahkelompokJabatan[z].total),
          color: this.colors[z],
          drilldown: jumlahkelompokJabatan[z].namakelompokjabatan
        });
        serieskelompokJabatan.push({
          name: jumlahkelompokJabatan[z].namakelompokjabatan,
          y: parseFloat(jumlahkelompokJabatan[z].total),
          sliced: slices,
          selected: slices
        });
        slices = false;
      }
      console.log(serieskelompokJabatan)
      this.chartKelompokJabatan = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: '',
        },
        tooltip: {
          formatter: function (e) {
            let point = this.point,
              s = this.percentage.toFixed(2) + ' %';//this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';
            return s;

          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';// this.percentage.toFixed(2) + ' %';
              }
            },
            showInLegend: true
          },

        },
        credits: {
          text: 'Total : ' + totalAll
          // enabled: false
        },
        legend: {
          enabled: true,
          borderRadius: 5,
          borderWidth: 1
        },
        series: [{
          type: 'pie',
          name: 'Total',
          // colorByPoint: true,
          data: serieskelompokJabatan

        }]
      })

      /**
    * @method Endchart Kelompok Pegawai
    */

      /**
      * @method chart Jenis Kelamin
      */
      let jumlahJK = this.resultData.jeniskelamin
      // let samateusih = false
      // let jumlahJK = []
      // for (let i in arrJK) {
      //   arrJK[i].total = 0
      //   if (arrJK[i].jeniskelamin == null) {
      //     arrJK[i].jeniskelamin = '-'
      //   }
      //   samateusih = false
      //   for (let x in jumlahJK) {
      //     if (jumlahJK[x].jeniskelamin == arrJK[i].jeniskelamin) {
      //       samateusih = true;
      //       jumlahJK[x].total = parseFloat(jumlahJK[x].total) + 1
      //     }
      //   }
      //   if (samateusih == false) {
      //     let result = {
      //       jeniskelamin: arrJK[i].jeniskelamin,
      //       total: parseFloat(arrJK[i].total),
      //     }
      //     jumlahJK.push(result)
      //   }
      // }

      // console.log(jumlahJK)
      // asupkeun kana series data di CHART
      let seriesJK = []
      let slicess = true

      for (let z in jumlahJK) {
        if (jumlahJK[z].jeniskelamin == null)
          jumlahJK[z].jeniskelamin = '-'
        let datana = [];
        datana.push({
          y: parseFloat(jumlahJK[z].total),
          color: this.colors[z],
          drilldown: jumlahJK[z].jeniskelamin
        });
        seriesJK.push({
          name: jumlahJK[z].jeniskelamin,
          y: parseFloat(jumlahJK[z].total),
          sliced: slicess,
          selected: slicess
        });
        slicess = false;
      }
      this.chartJK = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: '',
        },
        tooltip: {
          formatter: function (e) {
            let point = this.point,
              s = this.percentage.toFixed(2) + ' %';//this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';
            return s;

          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';// this.percentage.toFixed(2) + ' %';
              }
            },
            showInLegend: true
          },

        },
        credits: {
          text: 'Total : ' + totalAll
          // enabled: false
        },
        legend: {
          enabled: true,
          borderRadius: 5,
          borderWidth: 1
        },
        series: [{
          type: 'pie',
          name: 'Total',
          // colorByPoint: true,
          data: seriesJK

        }]
      })

      /**
    * @method Endchart Jenis Kelamin
    */


      /**
    * @method chartunitKerja
    */
      let jumlahUnitKerja = this.resultData.unitkerjapegawai
      // let samateusihah = false
      // let jumlahUnitKerja = []
      // for (let i in arrUnitKerja) {
      //   arrUnitKerja[i].total = 0
      //   if (arrUnitKerja[i].unitkerja == null) {
      //     arrUnitKerja[i].unitkerja = '-'
      //   }
      //   samateusihah = false
      //   for (let x in jumlahUnitKerja) {
      //     if (jumlahUnitKerja[x].unitkerja == arrUnitKerja[i].unitkerja) {
      //       samateusihah = true;
      //       jumlahUnitKerja[x].total = parseFloat(jumlahUnitKerja[x].total) + 1
      //     }
      //   }
      //   if (samateusihah == false) {
      //     let result = {
      //       unitkerja: arrUnitKerja[i].unitkerja,
      //       total: parseFloat(arrUnitKerja[i].total),
      //     }
      //     jumlahUnitKerja.push(result)
      //   }
      // }

      // console.log(jumlahUnitKerja)
      // asupkeun kana series data di CHART
      let seriesUnitKerja = []
      let slicesss = true

      for (let z in jumlahUnitKerja) {
        if (jumlahUnitKerja[z].unitkerja == null)
          jumlahUnitKerja[z].unitkerja = '-'
        let datana = [];
        datana.push({
          y: parseFloat(jumlahUnitKerja[z].total),
          color: this.colors[z],
          drilldown: jumlahUnitKerja[z].unitkerja
        });
        seriesUnitKerja.push({
          name: jumlahUnitKerja[z].unitkerja,
          y: parseFloat(jumlahUnitKerja[z].total),
          sliced: slicesss,
          selected: slicesss
        });
        slicesss = false;
      }
      this.chartUnitKerja = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: '',
        },
        tooltip: {
          formatter: function (e) {
            let point = this.point,
              s = this.percentage.toFixed(2) + ' %';//this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';
            return s;

          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';//this.percentage.toFixed(2) + ' %';
              }
            },
            showInLegend: true
          },

        },
        credits: {
          text: 'Total : ' + totalAll
          // enabled: false
        },
        legend: {
          enabled: false,
          borderRadius: 5,
          borderWidth: 1
        },
        series: [{
          type: 'pie',
          name: 'Total',
          // colorByPoint: true,
          data: seriesUnitKerja

        }]
      })
      //   this.chartUnitKerja = new Chart({
      //     chart: {
      //         zoomType: 'x',
      //         spacingRight: 20
      //     },
      //     title: {
      //         text: ''
      //     },

      //     xAxis: {
      //         categories: '',
      //         crosshair: true,
      //         // type: 'datetime',
      //         //  maxZoom: 24 * 3600 * 1000, // fourteen days
      //         title: {
      //             text: null
      //         }
      //     },
      //     yAxis: {
      //         title: {
      //             text: 'Jumlah Pasien'
      //         }
      //     },
      //     tooltip: {
      //         shared: true
      //     },
      //     legend: {
      //         enabled: true,
      //         borderRadius: 5,
      //         borderWidth: 1,
      //         // backgroundColor:undefined
      //     },
      //     plotOptions: {
      //         area: {
      //             fillColor: {
      //                 linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      //                 stops: [
      //                     [0, Highcharts.getOptions().colors[0]],
      //                     // [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
      //                     [1, Highcharts.Color(Highcharts.getOptions().colors[0])]
      //                 ]
      //             },
      //             lineWidth: 1,
      //             marker: {
      //                 enabled: true
      //             },
      //             shadow: false,
      //             states: {
      //                 hover: {
      //                     lineWidth: 1
      //                 }
      //             },
      //             threshold: null
      //         },
      //         column: {
      //             cursor: 'pointer',

      //             dataLabels: {
      //                 enabled: true,
      //                 color: this.colors[1],

      //                 formatter: function () {
      //                     return Highcharts.numberFormat(this.y, 0, '.', ',');
      //                 }
      //             },
      //             showInLegend: true
      //         },

      //     },
      //     credits: {
      //         enabled: false
      //     },

      //     series: [{
      //         type: 'column',
      //         name: 'Unit Kerja',
      //         // pointInterval: 24 * 3600 * 1000,
      //         // pointStart: Date.UTC(parseFloat(this.arr[2]), parseFloat(this.arr[1]) - 1, parseFloat('01')),
      //         data: seriesUnitKerja,

      //     },

      //     ]

      // })
      /**
    * @method EndchartUNITKERJA
    */
      /**
       * @method chartUSIA
       */
      let jumlahUsia = this.resultData.usia

      // asupkeun kana series data di CHART
      let seriesUsia = []
      for (let z in jumlahUsia) {
        let datana = [];
        datana.push({
          y: parseFloat(jumlahUsia[z].total),
          color: this.colors[z],
        });

        seriesUsia.push({
          name: jumlahUsia[z].usia,
          data: datana
        });
      }

      this.chartUsia = new Chart({
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
            text: 'Usia'
          }
        },
        plotOptions: {
          column: {
            // url:"#",
            cursor: 'pointer',

            dataLabels: {
              enabled: true,
              color: this.colors[1],

              formatter: function () {
                return Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pegawai';
              }
            },
            showInLegend: true
          }
        },
        tooltip: {
          formatter: function () {
            let point = this.point,
              s = this.x + ':' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' Pegawai <br/>';
            return s;

          }
          // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          //     '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
          // footerFormat: '</table>',
          // shared: true,
          // useHTML: true
        },
        series: seriesUsia,
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: true,
          borderRadius: 5,
          borderWidth: 1
        },

      })

      // console.log(seriesKatPegawai)

      // this.chartUsia = new Chart({
      //   chart: {
      //     plotBackgroundColor: null,
      //     plotBorderWidth: null,
      //     plotShadow: false,
      //     type: 'bar'
      //   },
      //   title: {
      //     text: '',
      //   },
      //   tooltip: {
      //     formatter: function (e) {
      //       let point = this.point,
      //         s = this.percentage.toFixed(2) + ' %';//this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';
      //       return s;

      //     }
      //   },
      //   plotOptions: {
      //     pie: {
      //       allowPointSelect: true,
      //       cursor: 'pointer',
      //       dataLabels: {
      //         enabled: true,
      //         color: '#000000',
      //         connectorColor: '#000000',
      //         formatter: function () {
      //           return this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';// this.percentage.toFixed(2) + ' %';
      //         }
      //       },
      //       showInLegend: true
      //     },

      //   },
      //   credits: {
      //     text: 'Total : ' + totalAll
      //     // enabled: false
      //   },
      //   legend: {
      //     enabled: true,
      //     borderRadius: 5,
      //     borderWidth: 1
      //   },
      //   series: [{
      //     type: 'bar',
      //     name: 'Total',
      //     // colorByPoint: true,
      //     data: seriesUsia

      //   }]
      // })

      /**
      * @method EndchartUSIA
      */
      /**
      * @method chartPendidikan
      */
      let jumlahPendidikan = this.resultData.pendidikan


      // asupkeun kana series data di CHART
      let seriesPendidikan = []
      let slicesssss = true

      for (let z in jumlahPendidikan) {
        if (jumlahPendidikan[z].pendidikan == null)
          jumlahPendidikan[z].pendidikan = 'Tidak di isi'
        let datana = [];
        datana.push({
          y: parseFloat(jumlahPendidikan[z].total),
          color: this.colors[z],
          drilldown: jumlahPendidikan[z].pendidikan
        });
        seriesPendidikan.push({
          name: jumlahPendidikan[z].pendidikan,
          y: parseFloat(jumlahPendidikan[z].total),
          // sliced: slicesssss,
          // selected: slicesssss
        });
        slicesssss = false;
      }
      // console.log(seriesKatPegawai)

      this.chartPendidikan = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: '',
        },
        tooltip: {
          formatter: function (e) {
            let point = this.point,
              s = this.percentage.toFixed(2) + ' %';//this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';
            return s;

          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return this.key + ': ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';// this.percentage.toFixed(2) + ' %';
              }
            },
            showInLegend: true
          },

        },
        credits: {
          text: 'Total : ' + totalAll
          // enabled: false
        },
        legend: {
          enabled: true,
          borderRadius: 5,
          borderWidth: 1
        },
        series: [{
          type: 'pie',
          name: 'Total',
          // colorByPoint: true,
          data: seriesPendidikan

        }]
      })

      /**
      * @method EndchartPENDIIKAN
      */
    })
  }
  //   loadCarsLazy(event: LazyLoadEvent) {
  //     this.loadingLayananGrid = true;

  //     //in a real application, make a remote request to load data using state metadata from event
  //     //event.first = First row offset
  //     //event.rows = Number of rows per page
  //     //event.sortField = Field name to sort with
  //     //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
  //     //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

  //     //imitate db connection over a network
  //     setTimeout(() => {
  //         if (this.dataSourceLayanan) {
  //             // this.cars = this.dataSourceLayanan.slice(event.first, (event.first + event.rows));
  //             this.loadingLayananGrid = false;
  //         }
  //     }, 1000);
  // }
  getLayananDokter() {
    this.loadingLayananGrid = true;
    let awal = this.now.toLocaleDateString() + ' 00:00';
    let akhir = this.now.toLocaleDateString() + ' 23:59';
    this.httpservice.getTransaksi('laporan/get-detail-layanan?tglAwal=' + '2018-06-10 00:00' + '&tglAkhir=' + '2018-06-10 23:00' +
      '&idDept=&idRuangan=&idKelompok=&idDokter=&tindakan=&kondisi=&kelas=&PetugasPe=').subscribe(data => {
        this.resultDataLayanan = data
        let arrayDok = this.resultDataLayanan.data
        let sama = false
        let groupingDok = []
        for (let i = 0; i < arrayDok.length; i++) {
          arrayDok[i].count = 1
          sama = false
          for (let x = 0; x < groupingDok.length; x++) {
            if (groupingDok[x].dokter == arrayDok[i].dokter) {
              sama = true;
              groupingDok[x].count = parseFloat(arrayDok[x].count) + parseFloat(groupingDok[x].count)
            }
          }
          if (sama == false) {
            let result = {
              iddokter: arrayDok[i].iddokter,
              dokter: arrayDok[i].dokter,
              count: parseFloat(arrayDok[i].count),
            }
            groupingDok.push(result)
          }
        }
        console.log(groupingDok)
        this.loadingLayananGrid = false;
        this.dataSourceLayanan = groupingDok
      })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceLayanan.filter = filterValue;
  }
  /**
  * @method EndOfFile
  */

}

