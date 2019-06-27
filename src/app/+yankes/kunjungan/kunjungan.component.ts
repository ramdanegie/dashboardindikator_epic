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
  selector: 'app-kunjungan',
  templateUrl: './kunjungan.component.html',
  styleUrls: ['./kunjungan.component.css'],
  providers: [ConfirmationService]
})
export class KunjunganComponent implements OnInit, AfterViewInit {
  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  item: any;
  newCar: boolean;
  selectedCar: any;
  tanggal: any = new Date();
  d_Indikator: SelectItem[];


  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public httpservice: AppService,
    private alertService: AlertService,
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
      'kunjungan_rj': new FormControl(null),
      'kunjungan_igd': new FormControl(null),
      'pasien_ri': new FormControl(null),

    });
    this.column = [
      { field: 'tanggal', header: 'Tanggal' },
      { field: 'kunjungan_rj', header: 'Jumlah Kunjungan RJ' },
      { field: 'kunjungan_igd', header: 'Jumlah Kunjungan IGD' },
      { field: 'pasien_ri', header: 'Jumlah Pasien RI' },
      { field: 'kode', header: 'Kode' },

    ];
    this.getDataSource()
    this.postDataKunjungan()
  }
  postDataKunjungan() {
    let status = false
    var tanggal = moment(this.tanggal).format('YYYY-MM-DD')
    this.httpservice.getTransaksi('yankes/get-kunjungan?tgl=' + tanggal)
      .subscribe(res => {
        var result: any = res
        if (result.list != undefined && result.list.length > 0) {
          for (let i in result.list) {
            if (moment(this.now).format('YYYY-MM-DD') == result.list[i].tanggal) {
              status = true
              this.httpservice.getTransaksi('yankes/count-kunjungan-pasien')
                .subscribe(res => {
                  let resData: any = res
                  var jsonSave = {
                    "data": {
                      "kode_kirim":  result.list[i].kode,
                      "tanggal": moment(this.now).format('YYYY-MM-DD'),
                      "kunjungan_rj": resData.data.rawat_jalan,
                      "kunjungan_igd": resData.data.igd,
                      "pasien_ri": resData.masihDirawat// result.data.rawat_inap,
                    }
                  }

                  this.httpservice.postTransaksi('yankes/update-kunjungan', jsonSave).subscribe(response => {
                    var resp: any = response
                    if (resp.kode == 200) {
                      this.displayDialog = false
                      this.alertService.success('Success', 'Post Kunjungan Otomatis')
                    }
                    this.getDataSource()
                  }, error => {
                    this.alertService.error('error', 'Post Kunjungan Gagal')
                  });
                })
              break
            }
          }
        }
        if (status == false) {
          this.httpservice.getTransaksi('yankes/count-kunjungan-pasien')
            .subscribe(res => {
              let result: any = res
              var jsonSave = {
                "data": {
                  "kode_kirim": null,
                  "tanggal": moment(this.now).format('YYYY-MM-DD'),
                  "kunjungan_rj": result.data.rawat_jalan,
                  "kunjungan_igd": result.data.igd,
                  "pasien_ri": result.masihDirawat// result.data.rawat_inap,
                }
              }

              this.httpservice.postTransaksi('yankes/insert-kunjungan', jsonSave).subscribe(response => {
                var resp: any = response
                if (resp.kode == 200) {
                  this.displayDialog = false
                  this.alertService.success('Success', 'Post Kunjungan Otomatis')
                }
                this.getDataSource()
              }, error => {
                this.alertService.error('error', 'Post Kunjungan Gagal')
              });
            })
        }
      }, error => {

      })




  }
  getCombo() {
    this.httpservice.getTransaksi('rensar/get-combo')
      .subscribe(res => {
        var result: any = res
        if (result.indikator !== undefined) {
          this.d_Indikator = [];
          this.d_Indikator.push({ label: '--Pilih Indikator--', value: '' });
          for (var i = 0; i < result.indikator.length; i++) {
            this.d_Indikator.push({ label: result.indikator[i].indikator, value: result.indikator[i].id });
          };
        } else {
          this.d_Indikator = [];
          this.d_Indikator.push({ label: '--Data Indikator Kosong--', value: '' });
        }
      },
        error => {
          this.d_Indikator = [];
          this.d_Indikator.push({ label: '--Koneksi Error--', value: '' })
        });

  }
  showDialogToAdd() {
    this.resetForm()
    this.displayDialog = true;
  }
  simpan() {
    var urlSave = 'yankes/insert-kunjungan';
    if (this.formTambah.value.tanggal == null) {
      this.alertService.warn('error', 'Tanggal harus di isi')
      return
    }
    var kunjungan_rj = 0
    if (this.formTambah.value.kunjungan_rj != null)
      kunjungan_rj = this.formTambah.value.kunjungan_rj
    var kunjungan_rj = 0
    if (this.formTambah.value.kunjungan_rj != null)
      kunjungan_rj = this.formTambah.value.kunjungan_rj
    var pasien_ri = 0
    if (this.formTambah.value.pasien_ri != null)
      pasien_ri = this.formTambah.value.pasien_ri
    var kode_kirim = null
    if (this.formTambah.value.kode != null)
      kode_kirim = this.formTambah.value.kode

    var jsonSave = {
      "data": {
        "kode_kirim": kode_kirim,
        "tanggal": moment(this.formTambah.value.tanggal).format('YYYY-MM-DD'),
        "kunjungan_rj": kunjungan_rj,
        "kunjungan_igd": kunjungan_rj,
        "pasien_ri": pasien_ri
      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-kunjungan';
    }
    this.httpservice.postTransaksi(urlSave, jsonSave).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        // this.messageService.add({ severity: 'success', summary: 'Success' });
        this.alertService.success('Success', '')
      }
      this.getDataSource()
    }, error => {
      this.alertService.error('error', 'Data Gagal Di Simpan')
    });
  }
  Ubah(selected) {
    this.formTambah.get('kode').setValue(selected.kode);
    this.formTambah.get('tanggal').setValue(new Date(selected.tanggal))
    this.formTambah.get('kunjungan_rj').setValue(selected.kunjungan_rj);
    this.formTambah.get('kunjungan_igd').setValue(selected.kunjungan_igd);
    this.formTambah.get('pasien_ri').setValue(selected.pasien_ri);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-kunjungan?kode=' + selected.kode).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.alertService.success('Success', '')
      }

      this.getDataSource()
      // this.visible = false;
      // setTimeout(() => this.visible = true, 0);
    }, error => {
      this.alertService.error('error', 'Data Gagal Di Dihapus')

    });
  }


  resetForm() {
    this.formTambah.get('kode').reset();
    this.formTambah.get('tanggal').reset();
    this.formTambah.get('kunjungan_rj').reset();
    this.formTambah.get('kunjungan_igd').reset();
    this.formTambah.get('pasien_ri').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tanggal = moment(this.tanggal).format('YYYY-MM-DD')
    this.httpservice.getTransaksi('yankes/get-kunjungan?tgl=' + tanggal)
      .subscribe(res => {
        var result: any = res
        this.dataSource = result.list
        this.loading = false
      }, error => {
        this.loading = false
      })

  }
  /**
     * @method ngAfterViewInit
     */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}
