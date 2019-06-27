import { Component, OnInit, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Highcharts, Chart } from 'angular-highcharts';
import { AppService } from 'src/app/shared/app.service';
import * as Prism from 'prismjs';
import { MessageService, Message } from 'primeng/api';
import { MenuItem, StepsModule, FieldsetModule, SelectItem, LazyLoadEvent, ConfirmDialogModule, ConfirmationService, InputMaskModule } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import * as $ from 'jquery';
import * as moment from 'moment';
import { AlertService } from '../../component/alert/alert.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-toptenpenyakit',
  templateUrl: './toptenpenyakit.component.html',
  styleUrls: ['./toptenpenyakit.component.css'],
  providers: [ConfirmationService],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})
export class ToptenpenyakitComponent implements OnInit {

  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  listICD_: any;
  displayDialog: boolean;
  tahun: any = new Date();
  listJenis: SelectItem[];
  bulanChar: any = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  dataSourceICD: any;
  columnICD: any[];
  tempDataGrid: any = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public httpservice: AppService,
    // public toastr: ToastsManager, 
    // vcr: ViewContainerRef
    private alertService: AlertService,
  ) {
    // this.toastr.setRootViewContainerRef(vcr)
  }
  showAndHide() {
    $('#boxCollapse').slideToggle("fast", "linear");
  }
  ngOnInit() {
    this.formTambah = this.fb.group({
      'kode': new FormControl(null),
      'bulan': new FormControl(null),
      'tahun': new FormControl(null),
      'rawatjalan': new FormControl(null),
      'rawatinap': new FormControl(null),
      'kode_icd': new FormControl(null),
      'jumlah': new FormControl(null),
      'nomor': new FormControl(null),

    });
    this.column = [
      { field: 'periode', header: 'Periode' },
      // { field: 'tglkirim', header: 'Tgl Kirim' },
      { field: 'jenis', header: 'Jenis' },
      // { field: 'kode', header: 'Kode' },
    ];
    this.columnICD = [
      { field: 'diagnosa', header: 'ICD' },
      { field: 'jumlah', header: 'Jumlah' },
    ];
    this.getDataSource()
  }
  monthNameToNum(monthname) {
    var month = this.bulanChar.indexOf(monthname);
    return month ? month : 0;
  }

  showDialogToAdd() {
    this.resetForm()
    this.displayDialog = true;
  }
  simpan() {
    let urlSave = '';
    let formControl = this.formTambah.value
    if (formControl.bulan == null) {
      this.alertService.error("Error", "Periode Harus Diisi")
      return
    }
    if (this.tempDataGrid.length == 0) {
      this.alertService.error("Error", "Icd masih kosong")
      return
    }

    let kode_kirim = null
    if (formControl.kode != null)
      kode_kirim = formControl.kode

    let departemenS = ''
    if (formControl.rawatjalan != null) {
      urlSave = 'yankes/insert-toptenrajal'
      departemenS = 'rawat_jalan'
    } else if (formControl.rawatinap != null) {
      urlSave = 'yankes/insert-toptenranap'
      departemenS = 'rawat_inap'
    }

    let array = []
    for (let i in this.tempDataGrid) {
      array.push({
        "kode_icd_10": this.tempDataGrid[i].kddiagnosa,
        "jumlah": this.tempDataGrid[i].jumlah
      })
    }
    let jsonSave: any;
    if (departemenS == 'rawat_jalan') {
      jsonSave = {
        "data": {
          "kode_kirim": kode_kirim,
          "bulan": parseFloat(moment(formControl.bulan).format('MM')),
          "tahun": parseFloat(moment(formControl.bulan).format('YYYY')),
          "rawat_jalan": array
        }
      }
    }
    if (departemenS == 'rawat_inap') {
      jsonSave = {
        "data": {
          "kode_kirim": kode_kirim,
          "bulan": parseFloat(moment(formControl.bulan).format('MM')),
          "tahun": parseFloat(moment(formControl.bulan).format('YYYY')),
          "rawat_inap": array
        }
      }
    }

    if (this.formTambah.value.kode != null && formControl.rawatjalan != null) {
      urlSave = 'yankes/update-toptenrajal';
    } else if (this.formTambah.value.kode != null && formControl.rawatinap != null) {
      urlSave = 'yankes/update-toptenranap';
    }
    this.httpservice.postTransaksi(urlSave, jsonSave).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.alertService.success("Success", "Sukses")
        this.tempDataGrid = []
        this.dataSourceICD = []
      }
      this.ngOnInit();
    }, error => {
      this.alertService.error("Error", "Data Gagal Disimpan")
    });
  }
  Ubah(selected) {
    var bulan = this.monthNameToNum(selected.periode)
    var tahun = moment(this.tahun).format('YYYY')
    var fulldate = tahun + '-' + bulan + '-01'
    // this.formTambah.get('kode').setValue(selected.kode);
    // this.formTambah.get('periode').setValue(new Date(fulldate))
    // this.formTambah.get('bor').setValue(selected.bor);
    // this.formTambah.get('alos').setValue(selected.alos);
    // this.formTambah.get('bto').setValue(selected.bto);
    // this.formTambah.get('toi').setValue(selected.toi);
    // this.formTambah.get('ndr').setValue(selected.ndr);
    // this.formTambah.get('gdr').setValue(selected.gdr);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-indikator?kode=' + selected.kode).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.alertService.success("Success", "Sukses")
      }
      this.ngOnInit();
    }, error => {
      this.alertService.error("Error", "Data Gagal Dihapus !")

    });
  }

  resetForm() {
    this.formTambah.get('kode').reset();
    this.formTambah.get('bulan').reset();
    this.formTambah.get('tahun').reset();
    this.formTambah.get('rawatjalan').reset();
    this.formTambah.get('rawatinap').reset();
    this.formTambah.get('kode_icd').reset();
    this.formTambah.get('jumlah').reset();
    this.formTambah.get('nomor').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tahun = moment(this.tahun).format('YYYY')
    // this.httpservice.getTransaksi('yankes/get-toptenranap?tahun=' + tahun)
    //   .subscribe(res1 => {
    //     this.httpservice.getTransaksi('yankes/get-toptenrajal?tahun=' + tahun)
    //       .subscribe(res2 => {
    //         var result: any = res1
    //         var result2: any = res2
    //         var data2: any = []
    //         if (result.list != undefined && result.list.length > 0) {
    //           data2.push(result.list)
    //         }
    //         if (result.result2 != undefined && result2.list.length > 0) {
    //           data2.push(result2.list)
    //         }
    //         this.dataSource = data2
    //         this.loading = false
    //       })

    //   }, error => {
    //     this.loading = false
    //   })
    let data2 = [{
      'periode': '2019-01-01',
      'jenis': 'Rawat Inap',
      'details': [
        { "diagnosa": "Z01", "jumlah": 10 },
        { "diagnosa": "A001", "jumlah": 12 },
        { "diagnosa": "B11", "jumlah": 3 }
      ],
    }]
    this.loading = false
    this.dataSource = data2


  }
  getICD(event) {
    this.httpservice.getTransaksi('yankes/get-diagnosa-part?kddiagnosa=' + event.query).subscribe(data => {
      for (let i in data) {
        data[i].diagnosa = data[i].kddiagnosa + ' - ' + data[i].namadiagnosa
      }
      this.listICD_ = data;
    });
  }
  add() {
    let formControl = this.formTambah.value
    if (formControl.kode_icd == null) {
      this.alertService.error("Error", "ICD harus di isi !")
      return
    }
    if (formControl.jumlah == null) {
      this.alertService.error("Error", "Jumlah harus di isi !")
      return
    }
    let nomor = 0
    if (this.dataSourceICD == undefined || this.dataSourceICD.length == 0) {
      nomor = 1
    } else {
      nomor = this.tempDataGrid.length + 1
    }
    let data: any = {};

    if (formControl.nomor != null) {
      for (var i = this.tempDataGrid.length - 1; i >= 0; i--) {
        if (this.tempDataGrid[i].no == formControl.nomor) {
          data.no = formControl.nomor
          data.diagnosa = formControl.kode_icd.diagnosa
          data.jumlah = formControl.jumlah
          data.kddiagnosa = formControl.kode_icd.kddiagnosa

          this.tempDataGrid[i] = data;
          this.dataSourceICD = this.tempDataGrid
        }
      }

    } else {
      data = {
        no: nomor,
        diagnosa: formControl.kode_icd.diagnosa,
        kddiagnosa: formControl.kode_icd.kddiagnosa,
        jumlah: formControl.jumlah
      }
      this.tempDataGrid.push(data)
      this.dataSourceICD = this.tempDataGrid
      this.clearFormAdd()
    }
  }
  del() {
    let formControl = this.formTambah.value
    if (formControl.nomor == null) {
      this.alertService.warn('Warn', 'Pilih data dulu')
      return
    }
    var data: any = {};
    if (formControl.nomor != null) {
      for (var i = this.tempDataGrid.length - 1; i >= 0; i--) {
        if (this.tempDataGrid[i].no == formControl.nomor) {
          this.tempDataGrid.splice(i, 1);
          for (var i = this.tempDataGrid.length - 1; i >= 0; i--) {
            this.tempDataGrid[i].no = i + 1
          }
          this.dataSourceICD = this.tempDataGrid
        }
      }
    }
    this.clearFormAdd()
  }
  batal() {
    this.clearFormAdd()
  }
  clearFormAdd() {
    this.formTambah.get('kode_icd').reset();
    this.formTambah.get('jumlah').reset();
    this.formTambah.get('nomor').reset();
    // this.tempDataGrid = []
  }

  onRowSelect(event) {
    this.formTambah.get('kode_icd').setValue({ kddiagnosa: event.data.kddiagnosa, diagnosa: event.data.diagnosa });
    this.formTambah.get('jumlah').setValue(event.data.jumlah);
    this.formTambah.get('nomor').setValue(event.data.no);
  }

  /**
     * @method ngAfterViewInit
     */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}
