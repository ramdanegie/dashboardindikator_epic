import { Component, AfterViewInit, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import * as Prism from 'prismjs';
import { AppService } from '../shared/app.service';
import { Chart, Highcharts, MapChart, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MatTableDataSource, MatPaginator, MatSort, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
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
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        ConfirmationService
    ],
})

export class HomeComponent implements AfterViewInit, OnInit {
    apiTimer: any;
    counter = 10;
    colors = Highcharts.getOptions().colors;
    colorNyieun = ['#7cb5ec', '#75b2a3', '#9ebfcc', '#acdda8', '#d7f4d2', '#ccf2e8',
        '#468499', '#088da5', '#00ced1', '#3399ff', '#00ff7f',
        '#b4eeb4', '#a0db8e', '#999999', '#6897bb', '#0099cc', '#3b5998',
        '#000080', '#191970', '#8a2be2', '#31698a', '#87ff8a', '#49e334',
        '#13ec30', '#7faf7a', '#408055', '#09790e'];
    public now: Date = new Date();
    chartKepatuhanClinicalPathway: any;
    chartJatuh: any;
    chartVAP: any;
    chartFormularium: any;
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
    categoriesMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agus', 'Sept', 'Okt', 'Nov', 'Des'];
    resultApiIndikator: any;
    loading: boolean;
    dataSource: any;
    column: any[];
    showLoading: boolean = false;
    formGroup: FormGroup;
    moment: _moment.Moment
    date = new FormControl(moment());

    constructor(public appservice: AppService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {

    }


    chosenYearHandler(normalizedYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
        datepicker.close();
        this.getData(this.date.value.year())
    }


    ngOnInit() {
        this.formGroup = this.fb.group({
            'filterTahun': new FormControl(new Date),
        });
        // this.apiTimer = setInterval(() => {
        //     this.getdate()
        // }, (1000)); //60 detik

        //   setTimeout(function () {this.getdate() }, 1000);
        this.showLoading = true

        this.getData(this.date.value.year())
        this.column = [
            { field: 'namaindikator', header: 'Indikator' },
            { field: 'target', header: 'Target' },
            { field: 'capaian', header: 'Capaian' },
            { field: 'tanggal', header: 'Bulan' },
            { field: 'tahun', header: 'Tahun' },
            { field: 'pic', header: 'PIC' },


        ];

        // this.apiTimer = setInterval(() => {
        //     //  didieu get servie meh auto refresh
        //     this.makeChartClinicalPathway()
        //     this.makeChartPasienJatuh()
        //     this.makeChartVAP()
        // }, (this.counter * 6000)); //60 detik

    }
    loadData(event: MatDatepickerInputEvent<Date>) {
        debugger
    }
    getData(tahun) {
        this.showLoading = true
        this.appservice.getTransaksi('eis/get-indikator-rensar?tahun=' + tahun).subscribe(data => {
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
            this.makeChartClinicalPathway()
            this.makeChartPasienJatuh()
            this.makeChartVAP()
            this.makeChartFormularium()
            this.makeChartIDO()
            this.makeChartKejadianPendarahan()
            this.makeChartKejadianSSepsis()
            this.makeChartBBLRS()
            this.makeChartTindakanOperasi()
            this.makechartKetepatanIndeksiPasien()
            this.makechartKRK()
            this.makechartERT()
            this.makechartWTRJ()
            this.makechartWTE()
            this.makechartWTPR()
            this.makechartWTPL()
            this.makechartPRM()
            this.makechartPB()
            this.showLoading = false
            this.setDataSource()
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
                for (let z = 0; z < groupData.length; z++) {
                    if (arr[i].namaindikator == groupData[z].namaindikator) {
                        if (arr[i].monthmm == '01') {
                            groupData[z].jan = arr[i].capaian
                            groupData[z].jantarget = arr[i].target
                        }
                        if (arr[i].monthmm == '02')
                            groupData[z].feb = arr[i].capaian
                        if (arr[i].monthmm == '03')
                            groupData[z].mar = arr[i].capaian
                        if (arr[i].monthmm == '04')
                            groupData[z].apr = arr[i].capaian
                        if (arr[i].monthmm == '05')
                            groupData[z].mei = arr[i].capaian
                        if (arr[i].monthmm == '06')
                            groupData[z].jun = arr[i].capaian
                        if (arr[i].monthmm == '07')
                            groupData[z].jul = arr[i].capaian
                        if (arr[i].monthmm == '08')
                            groupData[z].ags = arr[i].capaian
                        if (arr[i].monthmm == '09')
                            groupData[z].sep = arr[i].capaian
                        if (arr[i].monthmm == '10')
                            groupData[z].okt = arr[i].capaian
                        if (arr[i].monthmm == '11')
                            groupData[z].nov = arr[i].capaian
                        if (arr[i].monthmm == '12')
                            groupData[z].des = arr[i].capaian
                    }
                }
            }
            for (let i in groupData) {
                groupData[i].totalcapaian = (parseFloat(groupData[i].jan) + parseFloat(groupData[i].feb) + parseFloat(groupData[i].mar) + parseFloat(groupData[i].apr) +
                    parseFloat(groupData[i].mei) + parseFloat(groupData[i].jun) + parseFloat(groupData[i].jul) + parseFloat(groupData[i].ags) +
                    parseFloat(groupData[i].sep) + parseFloat(groupData[i].okt) + parseFloat(groupData[i].nov) + parseFloat(groupData[i].des)) / 12
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
    makeChartClinicalPathway() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Kepatuhan terhadap Clinical Pathway') > -1) {
                seriesCapaian.push({
                    y: parseFloat(data[i].capaian),
                    color: data[i].warnacapaian
                })
                seriesTarget.push({
                    y: parseFloat(data[i].target),
                    color: data[i].warnagrafik
                })
                var color1 = data[i].warnagrafik;
            }
        }
        // var seriesCapaian = [
        //     { "y": 75 }, { "y": 82 }, { "y": 80 }, { "y": 79 },
        //     { "y": 78 }, { "y": 78 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 100;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartKepatuhanClinicalPathway = new Chart({
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
    makeChartFormularium() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []

        for (let i in data) {
            if (data[i].namaindikator.indexOf('Kepatuhan penggunaan Formularium Nasional (Fornas)') > -1) {
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

        this.chartFormularium = new Chart({
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
    makeChartPasienJatuh() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Persentase kejadian pasien jatuh') > -1) {
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

        this.chartJatuh = new Chart({

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
    makeChartIDO() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Infeksi Daerah Operasi (IDO)') > -1) {
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
        //     { "y": 0.5 }, { "y": 0 }, { "y": 0.45 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 2;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartIDO = new Chart({
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
    makeChartVAP() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Ventilator Associated Pneumonia (VAP)') > -1) {
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
        //     { "y": 0 }, { "y": 0.46 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 5.8;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartVAP = new Chart({
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
    makeChartKejadianPendarahan() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Kejadian kematian ibu saat persalinan k/ perdarahan') > -1) {
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
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 1;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartKejadianPendarahan = new Chart({
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
    makeChartKejadianSSepsis() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Kejadian kematian ibu saat persalinan k/ Sepsis') > -1) {
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
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 0.2;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartSepsis = new Chart({
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
    makeChartBBLRS() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Kemampuan menangani BBLSR') > -1) {
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
        //     { "y": 69 }, { "y": 88 }, { "y": 82 }, { "y": 84 },
        //     { "y": 89 }, { "y": 91 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 60;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartBBLSR = new Chart({
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
    makeChartTindakanOperasi() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Tindakan operasi di ruang NICU') > -1) {
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
        //     { "y": 69 }, { "y": 88 }, { "y": 82 }, { "y": 84 },
        //     { "y": 89 }, { "y": 91 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 60;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartTindakanOperasi = new Chart({
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
    makechartKetepatanIndeksiPasien() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('Ketepatan Identifikasi') > -1) {
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
        //     { "y": 99.9 }, { "y": 100 }, { "y": 100 }, { "y": 100 },
        //     { "y": 100 }, { "y": 100 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 100;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartKetepatanIndeksiPasien = new Chart({
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
    makechartKRK() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('KRK') > -1) {
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
        //     { "y": 100 }, { "y": 100 }, { "y": 100 }, { "y": 100 },
        //     { "y": 100 }, { "y": 100 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 75;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartKRK = new Chart({
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
    makechartERT() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('ERT') > -1) {
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
        //     { "y": 76.3 }, { "y": 72.6 }, { "y": 53.3 }, { "y": 70 },
        //     { "y": 70 }, { "y": 67 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 120;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartERT = new Chart({
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
                    text: 'Menit',
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
                        valueSuffix: ' menit'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' menit'
                    }
                }
            ]
        });
    }
    makechartWTRJ() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('WTRJ') > -1) {
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
        //     { "y": 52.6 }, { "y": 51.4 }, { "y": 55.8 }, { "y": 57.9 },
        //     { "y": 55.7 }, { "y": 54.6 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 60;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartWTRJ = new Chart({
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
                    text: 'Menit',
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
                        valueSuffix: ' menit'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' menit'
                    }
                }
            ]
        });
    }
    makechartWTE() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('WTE') > -1) {
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
        //     { "y": 24.8 }, { "y": 21.5 }, { "y": 22 }, { "y": 23.9 },
        //     { "y": 22 }, { "y": 20.6 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 48;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartWTE = new Chart({
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
                    text: 'Jam',
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
                        valueSuffix: ' jam'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' jam'
                    }
                }
            ]
        });
    }
    makechartWTPR() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('WTPR') > -1) {
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
        //     { "y": 75.3 }, { "y": 58.1 }, { "y": 59.7 }, { "y": 55.3 },
        //     { "y": 81.3 }, { "y": 82.3 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 180;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartWTPR = new Chart({
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
                    text: 'Menit',
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
                        valueSuffix: ' menit'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' menit'
                    }
                }
            ]
        });
    }
    makechartWTPL() {
        var data = this.resultApiIndikator.data
        var seriesCapaian = []
        var seriesTarget = []
        // var color1 = "rgb(255, 188, 117)";
        for (let i in data) {
            if (data[i].namaindikator.indexOf('WTPL') > -1) {
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
        //     { "y": 48.33 }, { "y": 65.42 }, { "y": 56.57 }, { "y": 60 },
        //     { "y": 82.08 }, { "y": 60.30 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 120;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

        this.chartWTPL = new Chart({
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
                    text: 'Menit',
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
                        valueSuffix: ' menit'
                    }
                }, {
                    name: 'Capaian',
                    type: 'spline',
                    data: seriesCapaian,
                    color: 'black',

                    tooltip: {
                        valueSuffix: ' menit'
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
            if (data[i].namaindikator.indexOf('PRM') > -1) {
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
            if (data[i].namaindikator.indexOf('PB') > -1) {
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
        //     { "y": 99.60 }, { "y": 97.48 }, { "y": 96.95 }, { "y": 94.88 },
        //     { "y": 95.50 }, { "y": 87.24 }, { "y": 0 }, { "y": 0 },
        //     { "y": 0 }, { "y": 0 }, { "y": 0 }, { "y": 0 }
        // ]
        // var color1 = "rgb(255, 188, 117)";
        // var target = 65;
        // var seriesTarget = [
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        //     { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 }, { "y": target, "color": color1 },
        // ]

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

