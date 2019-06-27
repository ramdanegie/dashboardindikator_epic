import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Prism from 'prismjs';

import { Chart, Highcharts, MapChart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppService } from 'src/app/shared/app.service';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { FormControl } from '@angular/forms';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-dashboard-ikt',
    templateUrl: './dashboard-ikt.component.html',
    styleUrls: ['./dashboard-ikt.component.css'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        ConfirmationService
    ],
})
export class DashboardIktComponent implements AfterViewInit, OnInit {
    apiTimer: any;
    counter = 10;
    colors = Highcharts.getOptions().colors;
    colorNyieun = ['#7cb5ec', '#75b2a3', '#9ebfcc', '#acdda8', '#d7f4d2', '#ccf2e8',
        '#468499', '#088da5', '#00ced1', '#3399ff', '#00ff7f',
        '#b4eeb4', '#a0db8e', '#999999', '#6897bb', '#0099cc', '#3b5998',
        '#000080', '#191970', '#8a2be2', '#31698a', '#87ff8a', '#49e334',
        '#13ec30', '#7faf7a', '#408055', '#09790e'];
    public now: Date = new Date();
    chartOnlineSMS: any;
    chartVisite: any;
    chartKTT: any;
    chartBLU: any;
    chartIDO: any;
    chartKejadianPendarahan: any;
    chartSepsis: any;
    chartBBLSR: any;
    chartTindakanOperasi: any;
    chartKetepatanIndeksiPasien: any;
    chartKRK: any;
    chartERT: any;
    chartWTRJ: any;
    chartWTE: any;
    chartWTPR: any;
    chartWTPL: any;
    chartPRM: any;
    chartPB: any;
    jamSekarang: any;
    categoriesMonth = ['Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV'];
    resultApiIndikator: any;
    loading: boolean;
    dataSource: any;
    column: any[];
    showLoading: boolean = false;
    listChart: any;
    moment: _moment.Moment
    date = new FormControl(moment());
    chartItems: any;
    constructor(public appservice: AppService) { }

    ngOnInit() {

        // this.apiTimer = setInterval(() => {
        //     this.getdate()
        // }, (1000)); //60 detik
        this.getData(this.date.value.year())
        this.column = [
            { field: 'namaindikator', header: 'Indikator' },
            { field: 'target', header: 'Target' },
            { field: 'capaian', header: 'Capaian' },
            { field: 'tanggal', header: 'Bulan' },
            { field: 'tahun', header: 'Tahun' },
            { field: 'pic', header: 'PIC' },


        ];


    }
    chosenYearHandler(normalizedYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
        this.getData(this.date.value.year())
    }

    getData(tahun) {
        this.showLoading = true
        //   setTimeout(function () {this.getdate() }, 1000);
        this.appservice.getTransaksi('rensar/get-indikator-ikt?tahun=' + tahun).subscribe(data => {
            this.resultApiIndikator = data
            for (let i = 0; i < this.resultApiIndikator.data.length; i++) {
                if (parseFloat(this.resultApiIndikator.data[i].capaian) >= 80) {
                    this.resultApiIndikator.data[i].warnacapaian = '#63ff00'
                }
                if (parseFloat(this.resultApiIndikator.data[i].capaian) > 61 && parseFloat(this.resultApiIndikator.data[i].capaian) < 80) {
                    this.resultApiIndikator.data[i].warnacapaian = '#ffe800'
                }
                if (parseFloat(this.resultApiIndikator.data[i].capaian) <= 60) {
                    this.resultApiIndikator.data[i].warnacapaian = 'red'
                }

            }
            this.makeChartOnlineSMS()
            this.makeChartVisite()
            this.makeChartKTTP()
            this.makeChartBLU()
            this.makechartPRM()
            this.makechartPB()
            this.showLoading = false
            this.setDataSource()

            this.listChart = [
                {
                    'title': 'Kelengkapan dan Ketepatan Rekam Medik Dalam Waktu 24 jam ', 'classTitle': 'box box-success', 'color': 'info',
                    'chart': this.chartPRM
                },
                {
                    'title': 'Modernisasi Pengelolaan BLU (penerapan BIOS)', 'classTitle': 'box box-info', 'color': 'danger',
                    'chart': this.chartBLU
                },
                {
                    'title': 'Ketepatan Jam Visite Dokter Spesialis', 'classTitle': 'box box-warning', 'color': '#8a2be2',
                    'chart': this.chartVisite
                },
                {
                    'title': 'Sistem Antrian Pasien Rawat Jalan (Online/SMS)', 'classTitle': 'box box-danger', 'color': 'rgb(255, 40, 141)',
                    'chart': this.chartOnlineSMS
                },
                {
                    'title': 'Informasi Ketersediaan Tempat Tidur', 'classTitle': 'box box-primary', 'color': 'rgb(255, 195, 0)',
                    'chart': this.chartKTT
                },
                {
                    'title': 'Rasio PNBP Terhadap Biaya Operasional (PB)', 'classTitle': 'box box-default', 'color': '#00a65a',
                    'chart': this.chartPB
                }
            ]

            // for (let i in this.listChart){
            //     this.listChart[i].nameChart = this.chartItems
            // }
        })
    }
    setDataSource() {
        var arr = this.resultApiIndikator.data

        if (arr.length > 0) {

            let samateuuu = false
            let groupData = [];
            let totaltarget = 0
            let totalcapaian = 0
            for (let i = 0; i < arr.length; i++) {
                samateuuu = false
                for (let x in groupData) {
                    if (groupData[x].namaindikator == arr[i].namaindikator) {
                        groupData[x].namaindikator = arr[i].namaindikator
                        groupData[x].pic = arr[i].pic
                        groupData[x].satuan = arr[i].satuan
                        groupData[x].urutan = arr[i].urutan
                        samateuuu = true;
                    }

                }
                if (samateuuu == false) {
                    let result = {
                        namaindikator: arr[i].namaindikator,
                        pic: arr[i].pic,
                        target: arr[i].target,
                        capaian: arr[i].capaian,
                        satuan: arr[i].satuan,
                        urutan: arr[i].urutan,
                    }
                    groupData.push(result)
                }
            }
            for (let i = 0; i < arr.length; i++) {
                var tw1 = 0
                var tw2 = 0
                var tw3 = 0
                var tw4 = 0
                for (let z = 0; z < groupData.length; z++) {
                    if (arr[i].namaindikator == groupData[z].namaindikator) {

                        if (arr[i].category == 'Triwulan 1') {
                            groupData[z].tw1 = parseFloat(arr[i].capaian)
                            groupData[z].jantarget = arr[i].target
                        }
                        if (arr[i].category == 'Triwulan 2')
                            groupData[z].tw2 = parseFloat(arr[i].capaian)
                        if (arr[i].category == 'Triwulan 3')
                            groupData[z].tw3 = parseFloat(arr[i].capaian)
                        if (arr[i].category == 'Triwulan 4')
                            groupData[z].tw4 = parseFloat(arr[i].capaian)

                    }
                }
            }
            for (let i in groupData) {
                groupData[i].totalcapaian = (parseFloat(groupData[i].tw1 == undefined ? 0 : groupData[i].tw1) + parseFloat(groupData[i].tw2 == undefined ? 0 : groupData[i].tw2)
                    + parseFloat(groupData[i].tw3 == undefined ? 0 : groupData[i].tw3) + parseFloat(groupData[i].tw4 == undefined ? 0 : groupData[i].tw4)) / 4
                groupData[i].totalcapaian = groupData[i].totalcapaian.toFixed(2)
                if (groupData[i].satuan == '%')
                    groupData[i].totalcapaian = groupData[i].totalcapaian + groupData[i].satuan
                groupData[i].jantarget = groupData[i].jantarget + groupData[i].satuan

            }
            groupData.sort(function (obj1, obj2) {
                // Ascending: first urutan less than the previous
                return obj1.urutan - obj2.urutan;
            });
            this.dataSource = groupData
        }


    }
    getdate() {
        var today = new Date();
        var h: any = today.getHours();
        var m: any = today.getMinutes();
        var s: any = today.getSeconds();
        if (h < 10) {
            h = "0" + h;
        }
        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }

        var months: any = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        var myDays: any = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        var date: any = new Date();
        var day: any = date.getDate();
        var month: any = date.getMonth();
        var thisDay: any = date.getDay(),
            thisDay = myDays[thisDay];
        var yy: any = date.getYear();
        var year = (yy < 1000) ? yy + 1900 : yy;

        var tgl = (thisDay + ', ' + day + ' ' + months[month] + ' ' + year);
        var jam = (h + ":" + m + ":" + s + " WIB");
        // $("#timer").html(tgl + ' ' + jam);
        // setTimeout(function () {this.getdate() }, 1000);
        var el: HTMLElement = document.getElementById('timer');
        // console.log(el)
        this.jamSekarang = tgl + ' ' + jam

    }
    makeChartOnlineSMS() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Online/SMS') > -1) {
                seriesCapaian.push({
                    y: parseFloat(data[i].capaian),
                    // color: data[i].warnacapaian
                })
                seriesTarget.push({
                    y: parseFloat(data[i].target),
                    color: data[i].warnagrafik
                })
                var color1 = data[i].warnagrafik;
            }
        }

        this.chartOnlineSMS = new Chart({
            chart: {
                zoomType: 'xy',
                // backgroundColor: '#FCFFC5',

            },
            title: {
                text: ''
            },

            subtitle: {
                text: 'Target & Capaian'
            },
            xAxis: [{
                categories: this.categoriesMonth,
                crosshair: true
            }],
            yAxis: [{
                labels: {
                    // format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Persentase',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '',
                    style: {
                        color: color1
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: color1
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
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
            plotOptions: {

                spline: {
                    // url:"#",
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        color: this.colors[1],

                        formatter: function () {
                            return this.y //'Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',');
                        }
                    },
                    showInLegend: true
                },
                column: {
                    // url:"#",
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        color: this.colors[1],

                        formatter: function () {
                            return this.y //'Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',');
                        }
                    },
                    showInLegend: true
                },

                series: {
                    cursor: 'pointer',
                }
            },
            series: [
                {
                    name: 'Target',
                    type: 'area',
                    yAxis: 0, //MEMBUAT Y axis di dua sisi
                    data: seriesTarget,
                    color: color1,
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    marker: {
                        symbol: 'diamond',
                        // fillColor: '#FFFFFF',
                        lineWidth: 1,
                        lineColor: null, // inherit from series
                        width: 50,
                        height: 50
                    },

                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' %'
                    }
                }
            ]
        });
    }
    makeChartBLU() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []

        for (let i in data) {
            if (data[i].namaindikator.indexOf('Modernisasi Pengelolaan BLU') > -1) {
                seriesCapaian.push({
                    y: parseFloat(data[i].capaian)
                })
                seriesTarget.push({
                    y: parseFloat(data[i].target),
                    color: data[i].warnagrafik
                })
                var color1 = data[i].warnagrafik;
            }
        }
        // var seriesCapaian = [
        //     { "y": 81 }, { "y": 80 }, { "y": 78 }, { "y": 79 },
        //     { "y": 83 }, { "y": 71 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 80;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartBLU = new Chart({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: ''
            },

            subtitle: {
                text: 'Target & Capaian'
            },
            xAxis: [{
                categories: this.categoriesMonth,
                crosshair: true
            }],
            yAxis: [{
                labels: {
                    // format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Persentase',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '',
                    style: {
                        color: color1
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: color1
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
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
            plotOptions: {

                spline: {
                    // url:"#",
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        color: this.colors[1],

                        formatter: function () {
                            return this.y //'Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',');
                        }
                    },
                    showInLegend: true
                },

                series: {
                    cursor: 'pointer',
                }
            },
            series: [
                {
                    name: 'Target',
                    type: 'area',
                    // // yAxis: 1,
                    data: seriesTarget,
                    color: color1,
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' %'
                    }
                }
            ]
        });
    }
    makeChartVisite() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Visite Dokter Spesialis') > -1) {
                seriesCapaian.push({
                    y: parseFloat(data[i].capaian)
                })
                seriesTarget.push({
                    y: parseFloat(data[i].target),
                    color: data[i].warnagrafik
                })
                var color1 = data[i].warnagrafik;
            }
        }
        // var seriesCapaian = [
        //     { "y": 0.1 }, { "y": 0.2 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0.019 }, { "y": 0 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var seriesTarget = [
        //     { "y": 3, "color": color1 }, { "y": 3, "color": color1 }, { "y": 3, "color": color1 }, { "y": 3, "color": color1 },
        //     { "y": 3, "color": color1 }, { "y": 3, "color": color1 }, { "y": 3, "color": color1 }, { "y": 3, "color": color1 },
        //     { "y": 3, "color": color1 }, { "y": 3, "color": color1 }, { "y": 3, "color": color1 }, { "y": 3, "color": color1 },
        // ]

        this.chartVisite = new Chart({

            chart: {
                zoomType: 'xy'
            },
            title: {
                text: ''
            },

            subtitle: {
                text: 'Target & Realisasi'
            },
            xAxis: [{
                categories: this.categoriesMonth,
                crosshair: true
            }],
            yAxis: [{
                labels: {
                    // format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Persentase',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '',
                    style: {
                        color: color1
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: color1
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
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
            plotOptions: {

                spline: {
                    // url:"#",
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        color: this.colors[1],

                        formatter: function () {
                            return this.y //'Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',');
                        }
                    },
                    showInLegend: true
                },

                series: {
                    cursor: 'pointer',
                }
            },
            series: [
                {
                    name: 'Target',
                    type: 'area',
                    // yAxis: 1,
                    data: seriesTarget,
                    color: color1,
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' %'
                    }
                }
            ]
        });
    }

    makeChartKTTP() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Ketersediaan Tempat Tidur') > -1) {
                seriesCapaian.push({
                    y: parseFloat(data[i].capaian)
                })
                seriesTarget.push({
                    y: parseFloat(data[i].target),
                    color: data[i].warnagrafik
                })
                var color1 = data[i].warnagrafik;
            }
        }

        this.chartKTT = new Chart({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: ''
            },

            subtitle: {
                text: 'Target & Capaian'
            },
            xAxis: [{
                categories: this.categoriesMonth,
                crosshair: true
            }],
            yAxis: [{
                labels: {
                    // format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Persentase',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '',
                    style: {
                        color: color1
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: color1
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
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
            plotOptions: {

                spline: {
                    // url:"#",
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        color: this.colors[1],

                        formatter: function () {
                            return this.y //'Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',');
                        }
                    },
                    showInLegend: true
                },

                series: {
                    cursor: 'pointer',
                }
            },
            series: [
                {
                    name: 'Target',
                    type: 'area',
                    // yAxis: 1,
                    data: seriesTarget,
                    color: color1,
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' %'
                    }
                }
            ]
        });
    }

    makechartPRM() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Rekam Medik') > -1) {
                seriesCapaian.push({
                    y: parseFloat(data[i].capaian)
                })
                seriesTarget.push({
                    y: parseFloat(data[i].target),
                    color: data[i].warnagrafik
                })
                var color1 = data[i].warnagrafik;
            }
        }
        // var seriesCapaian = [
        //     { "y": 78 }, { "y": 88 }, { "y": 70 }, { "y": 72 },
        //     { "y": 72 }, { "y": 78 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 80;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartPRM = new Chart({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: ''
            },

            subtitle: {
                text: 'Target & Capaian'
            },
            xAxis: [{
                categories: this.categoriesMonth,
                crosshair: true
            }],
            yAxis: [{
                labels: {
                    // format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Persentase',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '',
                    style: {
                        color: color1
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: color1
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
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
            plotOptions: {

                spline: {
                    // url:"#",
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        color: this.colors[1],

                        formatter: function () {
                            return this.y //'Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',');
                        }
                    },
                    showInLegend: true
                },

                series: {
                    cursor: 'pointer',
                }
            },
            series: [
                {
                    name: 'Target',
                    type: 'area',
                    // yAxis: 1,
                    data: seriesTarget,
                    color: color1,
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' %'
                    }
                }
            ]
        });
    }
    makechartPB() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Rasio PNBP') > -1) {
                seriesCapaian.push({
                    y: parseFloat(data[i].capaian)
                })
                seriesTarget.push({
                    y: parseFloat(data[i].target),
                    color: data[i].warnagrafik
                })
                var color1 = data[i].warnagrafik;
            }
        }


        this.chartPB = new Chart({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: ''
            },

            subtitle: {
                text: 'Target & Capaian'
            },
            xAxis: [{
                categories: this.categoriesMonth,
                crosshair: true
            }],
            yAxis: [{
                labels: {
                    // format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Persentase',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '',
                    style: {
                        color: color1
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: color1
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
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
            plotOptions: {

                spline: {
                    // url:"#",
                    cursor: 'pointer',

                    dataLabels: {
                        enabled: true,
                        color: this.colors[1],

                        formatter: function () {
                            return this.y //'Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',');
                        }
                    },
                    showInLegend: true
                },

                series: {
                    cursor: 'pointer',
                }
            },
            series: [
                {
                    name: 'Target',
                    type: 'area',
                    // yAxis: 1,
                    data: seriesTarget,
                    color: color1,
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' %'
                    }
                }
            ]
        });
    }
    /**
     * @method ngAfterViewInit
     */
    ngAfterViewInit() {
        Prism.highlightAll();

    }


}
