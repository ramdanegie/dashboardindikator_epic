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
  selector: 'app-darah',
  templateUrl: './darah.component.html',
  styleUrls: ['./darah.component.css'],
  providers: [ConfirmationService]
})
export class DarahComponent implements OnInit {

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
      'kode': new FormControl(null),
      'periode': new FormControl(null),
      'kode_darah': new FormControl(null),
      'jumlah': new FormControl(null),
    });
    this.column = [
      { field: 'periode', header: 'Bulan' },
      { field: 'tahun', header: 'Tahun' },
      { field: 'tglkirim', header: 'Tgl Kirim' },
      // { field: 'pemeriksaan', header: 'Pemeriksaan' },
      { field: 'darah', header: 'Golongan Darah' },
      { field: 'jumlah', header: 'Jumlah' },
      // { field: 'kode', header: 'Kode' },
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
    var urlSave = 'yankes/insert-golongandarah';
    var formControl = this.formTambah.value
    if (formControl.periode == null) {
      this.messageService.add({ severity: 'error', summary: 'Periode Harus di isi' });
      return
    }
    var kode_darah = null
    if (formControl.kode_darah != null)
      kode_darah = formControl.kode_darah

    var jumlah = 0
    if (formControl.jumlah != null)
      jumlah = formControl.jumlah

    var kode_kirim = null
    if (this.formTambah.value.kode != null)
      kode_kirim = this.formTambah.value.kode

    var jsonSave = {
      "data": {
        "kode_kirim": kode_kirim,
        "bulan": moment(formControl.periode).format('MM'),
        "tahun": moment(formControl.periode).format('YYYY'),
        "kode_darah": kode_darah,
        "jumlah": jumlah
      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-golongandarah';
    }
    this.httpservice.postTransaksi(urlSave, jsonSave).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Success' });
      }
      this.ngOnInit();
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Simpan' });
    });
  }
  Ubah(selected) {
    var bulan = this.monthNameToNum(selected.periode)
    var tahun = moment(this.tahun).format('YYYY')
    var fulldate = tahun + '-' + bulan + '-01'
    this.formTambah.get('kode').setValue(selected.kode);
    this.formTambah.get('periode').setValue(new Date(fulldate))
    // this.formTambah.get('kode_pemeriksaan').setValue( selected.k)
    this.formTambah.get('kode_darah').setValue(selected.kode_darah);
    this.formTambah.get('jumlah').setValue(selected.jumlah);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-golongandarah?kode=' + selected.kode).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.ngOnInit();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Hapus' });
      }

    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Hapus' });

    });
  }

  resetForm() {
    this.formTambah.get('kode').reset();
    this.formTambah.get('periode').reset();
    this.formTambah.get('kode_darah').reset();
    this.formTambah.get('jumlah').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tahun = moment(this.tahun).format('YYYY')
    this.httpservice.getTransaksi('yankes/get-golongandarah?tahun=' + tahun)
      .subscribe(res => {
        var result: any = res
        if (result.list != undefined && result.list.length > 0) {
          for (let i = 0; i < result.list.length; i++) {
            for (let j = 0; j < this.listPemeriksaanTemp.length; j++) {
              if (this.listPemeriksaanTemp[j].kode_golongan_darah == result.list[i].kode_darah) {
                result.list[i].darah = this.listPemeriksaanTemp[j].deskripsi
                break
              }
            }

            result.list[i].tahun = moment(this.tahun).format('YYYY')
            result.list[i].periode = this.bulanChar[parseFloat(result.list[i].periode)]

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
