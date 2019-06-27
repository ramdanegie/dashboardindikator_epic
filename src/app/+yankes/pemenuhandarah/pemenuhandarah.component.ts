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
  selector: 'app-pemenuhandarah',
  templateUrl: './pemenuhandarah.component.html',
  styleUrls: ['./pemenuhandarah.component.css'],
  providers: [ConfirmationService]
})
export class PemenuhandarahComponent implements OnInit {
  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  tahun: any = new Date();
  bulanChar: any = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  listPemeriksaan: SelectItem[];
  listPemeriksaanTemp: any = [];
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
      'norec': new FormControl(null),
      'kode': new FormControl(null),
      'tanggal': new FormControl(null),
      'pemenuhan_darah': new FormControl(null),
      'permintaan_terpakai': new FormControl(null),
    });
    this.column = [
      { field: 'tgl', header: 'Bulan' },
      // { field: 'tahun', header: 'Tahun' },
      // { field: 'tglkirim', header: 'Tgl Kirim' },
      { field: 'pemenuhan_darah', header: 'Pemenuhan Darah' },
      { field: 'permintaan_terpakai', header: 'Permintaan Terpakai' },
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
    var urlSave = 'yankes/insert-pemenuhandarah';
    var formControl = this.formTambah.value
    if (formControl.tanggal == null) {
      this.messageService.add({ severity: 'error', summary: 'Tanggal Harus di isi' });
      return
    }
    var pemenuhan_darah = null
    if (formControl.pemenuhan_darah != null)
      pemenuhan_darah = formControl.pemenuhan_darah

    var permintaan_terpakai = 0
    if (formControl.permintaan_terpakai != null)
      permintaan_terpakai = formControl.permintaan_terpakai



    var kode_kirim = null
    if (this.formTambah.value.kode != null)
      kode_kirim = this.formTambah.value.kode

    var jsonSave = {
      "data": {
        "kode_kirim": kode_kirim,
        "bulan": moment(formControl.tanggal).format('MM'),
        "pemenuhan_darah": pemenuhan_darah,
        "permintaan_terpakai": permintaan_terpakai,

      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-pemenuhandarah';
    }
    this.httpservice.postTransaksi(urlSave, jsonSave).subscribe(response => {
      var resp: any = response
      if (resp[0] != undefined) {
        kode_kirim = resp[0] 
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
        "pemenuhan_darah": pemenuhan_darah,
        "permintaan_terpakai": permintaan_terpakai,
      }
      this.httpservice.postTransaksi('yankes/save-local-pemenuhandarah', jsonSave2).subscribe(res => {
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
    this.formTambah.get('pemenuhan_darah').setValue(selected.pemenuhan_darah);
    this.formTambah.get('permintaan_terpakai').setValue(selected.permintaan_terpakai);
    this.formTambah.get('norec').setValue(selected.norec);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-pemenuhandarah?kode=' + selected.kode_kirim).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.httpservice.deleteTransaksi('yankes/delete-local-pemenuhandarah?norec=' + selected.norec).subscribe(response => {
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
    this.formTambah.get('pemenuhan_darah').reset();
    this.formTambah.get('permintaan_terpakai').reset();
    this.formTambah.get('norec').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tahun = ''
    if (this.tahun != null)
      tahun = moment(this.tahun).format('YYYY-MM')
    this.httpservice.getTransaksi('yankes/get-local-pemenuhandarah?tgl=' + tahun)
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
    this.httpservice.getTransaksi('yankes/get-master-golongandarah')
      .subscribe(res => {
        var result: any = res
        if (result.list !== undefined) {
          this.listPemeriksaan = [];
          this.listPemeriksaan.push({ label: '--Pilih--', value: '' });
          for (var i = 0; i < result.list.length; i++) {
            this.listPemeriksaan.push({ label: result.list[i].deskripsi, value: result.list[i].kode_golongan_darah });
            this.listPemeriksaanTemp.push(result.list[i])
          };
        } else {
          this.listPemeriksaan = [];
          this.listPemeriksaan.push({ label: '--Data Tidak Ada--', value: '' });
        }
      },
        error => {
          this.listPemeriksaan = [];
          this.listPemeriksaan.push({ label: '--Koneksi Error--', value: '' })
        });

  }
  
  /**
     * @method ngAfterViewInit
     */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}
