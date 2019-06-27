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
import { AlertService } from 'src/app/component/alert/alert.service';

@Component({
  selector: 'app-hasilradiologi',
  templateUrl: './hasilradiologi.component.html',
  styleUrls: ['./hasilradiologi.component.css'],
  providers: [ConfirmationService]
})
export class HasilradiologiComponent implements OnInit {

  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  tahun: any = new Date();
  bulanChar: any = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  hasilRadiologi: any;
  listPemeriksaan: SelectItem[];
  listPemeriksaanTemp: any = [];
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public httpservice: AppService,
    public alertService: AlertService
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
      'kode_rad': new FormControl(null),
      'jumlah': new FormControl(null),
    });
    this.column = [
      { field: 'periode', header: 'Bulan' },
      { field: 'tahun', header: 'Tahun' },
      { field: 'tglkirim', header: 'Tgl Kirim' },
      { field: 'pemeriksaan', header: 'Pemeriksaaan' },
      { field: 'jumlah', header: 'Jumlah' },
    ];
    this.getDataSource()
    this.countHasilRad()
  }
  countHasilRad() {
    let statusLoad = false
    this.httpservice.getTransaksi('yankes/get-radiologi?tahun=' + moment(this.now).format('YYYY'))
      .subscribe(e => {
        var es: any = e
        if (es.list.length > 0) {
          // DELETE DATANAN HEULA
          for (let z in es.list) {
            this.httpservice.deleteTransaksi('yankes/delete-radiologi?kode=' + es.list[z].kode).subscribe(a => { })
          }
          // TERUS INSERT DEUI
          this.httpservice.getTransaksi('yankes/count-hasil-radiologi').subscribe(response => {
            // debugger
            this.hasilRadiologi = response
            let arrKanker = this.hasilRadiologi.kankerparu
            let arrTBC = this.hasilRadiologi.tbc
            if (arrKanker.length > 0) {
              for (let i in arrKanker) {
                var jsonSave = {
                  "data": {
                    "bulan": arrKanker[i].bulan,
                    "tahun": arrKanker[i].tahun,
                    "kode_rad": 2,
                    "jumlah": arrKanker[i].jumlah
                  }
                }
                this.httpservice.postTransaksi('yankes/insert-radiologi', jsonSave)
                  .subscribe(response => {
                    statusLoad == true
                  }, error => {
                  });
              }
            }
            if (arrTBC.length > 0) {
              for (let u in arrTBC) {
                var jsonSave = {
                  "data": {
                    "bulan": arrTBC[u].bulan,
                    "tahun": arrTBC[u].tahun,
                    "kode_rad": 1,
                    "jumlah": arrTBC[u].jumlah
                  }
                }
                this.httpservice.postTransaksi('yankes/insert-radiologi', jsonSave)
                  .subscribe(response => {
                    statusLoad == true
                  }, error => {
                  });
              }
            }
          })

          if (statusLoad) {
            this.getDataSource()
          }
        }
      })
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
    var urlSave = 'yankes/insert-radiologi';
    var formControl = this.formTambah.value
    if (formControl.periode == null) {
      this.messageService.add({ severity: 'error', summary: 'Periode Harus di isi' });
      return
    }
    var kode_rad = null
    if (formControl.kode_rad != null)
      kode_rad = formControl.kode_rad

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
        "kode_rad": kode_rad,
        "jumlah": jumlah
      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-radiologi';
    }
    this.httpservice.postTransaksi(urlSave, jsonSave).subscribe(response => {
      var resp: any = response
      if (resp[0] != undefined) {

        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Success' });
      }
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
      }
      this.getDataSource();
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
    this.formTambah.get('kode_rad').setValue(selected.kode_rad);
    this.formTambah.get('jumlah').setValue(selected.jumlah);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-radiologi?kode=' + selected.kode).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.getDataSource();
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
    this.formTambah.get('kode_rad').reset();
    this.formTambah.get('jumlah').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tahun = moment(this.tahun).format('YYYY')
    this.httpservice.getTransaksi('yankes/get-radiologi?tahun=' + tahun)
      .subscribe(res => {
        var result: any = res
        if (result.list != undefined && result.list.length > 0) {
          for (let i = 0; i < result.list.length; i++) {
            for (let j = 0; j < this.listPemeriksaanTemp.length; j++) {
              if (this.listPemeriksaanTemp[j].kode_diagnosis == result.list[i].kode_rad) {
                result.list[i].pemeriksaan = this.listPemeriksaanTemp[j].deskripsi
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
    this.httpservice.getTransaksi('yankes/get-master-radiologi')
      .subscribe(res => {
        var result: any = res
        if (result.list !== undefined) {
          this.listPemeriksaan = [];
          this.listPemeriksaan.push({ label: '--Pilih--', value: '' });
          for (var i = 0; i < result.list.length; i++) {
            this.listPemeriksaan.push({ label: result.list[i].deskripsi, value: result.list[i].kode_diagnosis });
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
