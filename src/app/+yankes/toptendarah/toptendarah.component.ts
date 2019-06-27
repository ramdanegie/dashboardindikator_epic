import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Highcharts, Chart } from 'angular-highcharts';
import { AppService } from 'src/app/shared/app.service';
import * as Prism from 'prismjs';
import { MessageService, Message } from 'primeng/api';
import { MenuItem, StepsModule, FieldsetModule, SelectItem, LazyLoadEvent, ConfirmDialogModule, ConfirmationService, InputMaskModule } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import * as $ from 'jquery';
import * as moment from 'moment';
@Component({
  selector: 'app-toptendarah',
  templateUrl: './toptendarah.component.html',
  styleUrls: ['./toptendarah.component.css'],
  providers: [ConfirmationService]
})
export class ToptendarahComponent implements OnInit {

  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  listICD_: any;
  tahun: any = new Date();
  bulanChar: any = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  listICD: SelectItem[];
  listICDTemp: any = [];
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public httpservice: AppService,
  ) {

  }
  showAndHide() {
    $('#boxCollapse').slideToggle("fast", "linear");
  }
  ngOnInit() {
    this.getCombo()
    this.formTambah = this.fb.group({
      'kode': new FormControl(null),
      'tanggal': new FormControl(null),
      'kode_icd': new FormControl(null),
      'jumlah': new FormControl(null),
      'norec': new FormControl(null),
    });
    this.column = [
      { field: 'tgl', header: 'Bulan' },
      // { field: 'tahun', header: 'Tahun' },
      // { field: 'tglkirim', header: 'Tgl Kirim' },
      { field: 'kode_icd', header: 'Kode ICD' },
      { field: 'nama_icd', header: 'ICD' },
      { field: 'jumlah', header: 'Jumlah' },
    ];
    this.getDataSource()
  }

  showDialogToAdd() {
    this.resetForm()
    this.displayDialog = true;
  }

  monthNameToNum(monthname) {
    var month = this.bulanChar.indexOf(monthname);
    return month ? month : 0;
  }

  simpan() {
    var urlSave = 'yankes/insert-toptendarah';
    var formControl = this.formTambah.value
    if (formControl.tanggal == null) {
      this.messageService.add({ severity: 'error', summary: 'Tanggal Harus di isi' });
      return
    }
    var kode_icd = null
    if (formControl.kode_icd != null)
    kode_icd = formControl.kode_icd.kddiagnosa

    var jumlah = 0
    if (formControl.jumlah != null)
    jumlah = formControl.jumlah

    var kode_kirim = null
    if (this.formTambah.value.kode != null)
      kode_kirim = this.formTambah.value.kode

    var jsonSave = {
      "data": {
        "kode_kirim": kode_kirim,
        "bulan": moment(formControl.tanggal).format('MM'),
        "kode_icd": kode_icd,
        "jumlah": jumlah,
      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-toptendarah';
    }
    this.httpservice.postTransaksi(urlSave, jsonSave).subscribe(response => {
      var resp: any = response
      if (resp[0] != undefined) {
        kode_kirim =resp[0]
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Success' });
      }
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
      }
      var jsonSave2 = {
        "norec": formControl.norec,
        "kode_kirim": kode_kirim,
        "tanggal": moment(formControl.tanggal).format('YYYY-MM-01'),
        "bulan":  moment(formControl.tanggal).format('MM'),
        "kode_icd": kode_icd,
        "nama_icd": formControl.kode_icd.namadiagnosa,
        "jumlah": jumlah,
      }
      this.httpservice.postTransaksi('yankes/save-local-toptendarah', jsonSave2).subscribe(res => {
      })
      this.ngOnInit();
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Simpan' });
    });
  }
  Ubah(selected) {
    var bulan = this.monthNameToNum(selected.periode)
    var tahun = moment(this.tahun).format('YYYY')
    var fulldate = tahun + '-' + bulan + '-01'
    this.formTambah.get('kode').setValue(selected.kode_kirim);
    this.formTambah.get('tanggal').setValue(new Date(selected.tanggal))
    this.formTambah.get('kode_icd').setValue({kddiagnosa:selected.kode_icd,namadiagnosa:selected.nama_icd});
    this.formTambah.get('jumlah').setValue(selected.jumlah);
    this.formTambah.get('norec').setValue(selected.norec);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-toptendarah?kode=' + selected.kode_kirim).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.httpservice.deleteTransaksi('yankes/delete-local-toptendarah?norec=' + selected.norec).subscribe(response => {
          this.ngOnInit();
        })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Hapus' });
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Hapus' });

    });
  }

  resetForm() {
    this.formTambah.get('kode').reset();
    this.formTambah.get('tanggal').reset();
    this.formTambah.get('kode_icd').reset();
    this.formTambah.get('jumlah').reset();
    this.formTambah.get('norec').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tahun = moment(this.tahun).format('YYYY-MM')
    this.httpservice.getTransaksi('yankes/get-local-toptendarah?tgl=' + tahun)
      .subscribe(res => {
        var result: any = res
        if (result.list != undefined && result.list.length > 0) {
          for (let i = 0; i < result.list.length; i++) {
           
            result.list[i].tgl = moment(new Date(result.list[i].tanggal)).format('MM-YYYY')
      
          }
        }
        this.dataSource = result.list
        this.loading = false
      }, error => {
        this.loading = false
      })

  }
  getCombo() {
  //   this.httpservice.getService('list-generic/?table=Diagnosa&select=*')
  //     .subscribe(res => {
  //       var result: any = res
  //       if (result !== undefined) {
  //         this.listICD = [];
  //         this.listICD.push({ label: '--Pilih--', value: '' });
  //         for (var i = 0; i < result.length; i++) {
  //           this.listICD.push({ label: result[i].namadiagnosa, value: result[i].kddiagnosa });
  //           this.listICD.push(result[i])
  //         };
  //       } else {
  //         this.listICD = [];
  //         this.listICD.push({ label: '--Data Tidak Ada--', value: '' });
  //       }
  //     },
  //       error => {
  //         this.listICD = [];
  //         this.listICD.push({ label: '--Koneksi Error--', value: '' })
  //       });
}
  getICD(event) {
    this.httpservice.getTransaksi('yankes/get-diagnosa-part?kddiagnosa='+event.query).subscribe(data => {
      this.listICD_ = data;
    });
  }
  /**
     * @method ngAfterViewInit
     */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}
