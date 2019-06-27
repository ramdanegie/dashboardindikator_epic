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
  selector: 'app-ketersediaandarah',
  templateUrl: './ketersediaandarah.component.html',
  styleUrls: ['./ketersediaandarah.component.css'],
  providers: [ConfirmationService]
})
export class KetersediaandarahComponent implements OnInit {
  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  tanggalCari: any ;
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
      'kode': new FormControl(null),
      'norec': new FormControl(null),
      'tanggal': new FormControl(null),
      'kode_gol_darah': new FormControl(null),
      'jumlah': new FormControl(null),
      'penggunaan': new FormControl(null),
    });
    this.column = [
      { field: 'tanggal', header: 'Tanggal' },
      // { field: 'tahun', header: 'Tahun' },
      // { field: 'tglkirim', header: 'Tgl Kirim' },
      { field: 'gol_darah', header: 'Golongan Darah' },
      { field: 'jumlah', header: 'Jumlah' },
      { field: 'penggunaan', header: 'Penggunaan' },
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
    var urlSave = 'yankes/insert-stokdarah';
    var formControl = this.formTambah.value
    if (formControl.tanggal == null) {
      this.messageService.add({ severity: 'error', summary: 'Tanggal Harus di isi' });
      return
    }
    var kode_gol_darah = null
    if (formControl.kode_gol_darah != null)
      kode_gol_darah = formControl.kode_gol_darah

    var jumlah = 0
    if (formControl.jumlah != null)
      jumlah = formControl.jumlah

    var penggunaan = 0
    if (formControl.penggunaan != null)
      penggunaan = formControl.penggunaan

    var kode_kirim = null
    if (this.formTambah.value.kode != null)
      kode_kirim = this.formTambah.value.kode

    var jsonSave = {
      "data": {
        "kode_kirim": kode_kirim,
        "tanggal": moment(formControl.tanggal).format('YYYY-MM-DD'),
        "kode_gol_darah": kode_gol_darah,
        "jumlah": jumlah,
        "penggunaan": penggunaan
      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-stokdarah';
    }
    this.httpservice.postTransaksi(urlSave, jsonSave).subscribe(response => {
      var resp: any = response
      if (resp[0] != undefined) {
        kode_kirim = resp[0] 
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Success' });
      }
      if (resp.kode == 200) {
        // var kode_kirimss = resp.kode 
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
      }
      // var norec = null
      // if (urlSave == 'yankes/update-stokdarah')
      //   norec = formControl.norec

      var gol_darah = null
      for (let i in this.listPemeriksaanTemp) {
        if (this.listPemeriksaanTemp[i].kode_golongan_darah == kode_gol_darah) {
          gol_darah = this.listPemeriksaanTemp[i].deskripsi
          break
        }
      }
      var jsonSave2 = {
        "norec": formControl.norec,
        "kode_kirim": kode_kirim,
        "tanggal": moment(formControl.tanggal).format('YYYY-MM-DD'),
        "kode_gol_darah": kode_gol_darah,
        "gol_darah": gol_darah,
        "jumlah": jumlah,
        "penggunaan": penggunaan
      }
      this.httpservice.postTransaksi('yankes/save-local-stokdarah', jsonSave2).subscribe(res => {
      })

      this.ngOnInit();
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Simpan' });
    });
  }
  Ubah(selected) {
    // var bulan = this.monthNameToNum(selected.periode)
    // var tahun = moment(this.tahun).format('YYYY')
    // var fulldate = tahun + '-' + bulan + '-01'
    this.formTambah.get('kode').setValue(selected.kode_kirim);
    this.formTambah.get('tanggal').setValue(new Date(selected.tanggal))
    this.formTambah.get('kode_gol_darah').setValue(selected.kode_gol_darah);
    this.formTambah.get('jumlah').setValue(selected.jumlah);
    this.formTambah.get('penggunaan').setValue(selected.penggunaan);
    this.formTambah.get('norec').setValue(selected.norec);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-stokdarah?kode=' + selected.kode_kirim).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.httpservice.deleteTransaksi('yankes/delete-local-stokdarah?norec=' + selected.norec).subscribe(response => {
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
    this.formTambah.get('kode_gol_darah').reset();
    this.formTambah.get('jumlah').reset();
    this.formTambah.get('penggunaan').reset();
    this.formTambah.get('norec').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tgl = ''
    if (this.tanggalCari != null)
      tgl = moment(this.tanggalCari).format('YYYY-MM-DD')
    this.httpservice.getTransaksi('yankes/get-local-stokdarah?tgl=' + tgl)
      .subscribe(res => {
        var result: any = res
        if (result.list != undefined && result.list.length > 0) {
          for (let i = 0; i < result.list.length; i++) {
            result.list[i].tanggal = moment(new Date(result.list[i].tanggal)).format('YYYY-MM-DD')
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
