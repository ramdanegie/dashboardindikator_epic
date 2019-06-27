
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
  selector: 'app-rujukan',
  templateUrl: './rujukan.component.html',
  styleUrls: ['./rujukan.component.css'],
  providers: [ConfirmationService]
})
export class RujukanComponent implements OnInit {
  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  jmlRujukanMasuk: any = 0;
  jmlRujukanKeluar: any = 0;
  tanggal: any = new Date();
  columnTopTen: any;
  dataSourceTopTen: any;
  tanggalTopTen: any = new Date();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public httpservice: AppService,
    public alertService:AlertService
  ) {

  }
  showAndHide() {
    $('#boxCollapse').slideToggle("fast", "linear");
  }
  ngOnInit() {
    this.getSisrute()
    this.formTambah = this.fb.group({
      'kode': new FormControl(null),
      'tanggal': new FormControl(null),
      'jumlah_rujukan': new FormControl(null),
      'jumlah_rujuk_balik': new FormControl(null),
    });
    this.column = [
      { field: 'tanggal', header: 'Tanggal' },
      { field: 'jumlah_rujukan', header: 'Jumlah Rujukan' },
      { field: 'jumlah_rujuk_balik', header: 'Jumlah Rujuk Balik' },
      { field: 'kode', header: 'Kode' },

    ];
    this.columnTopTen = [
      { field: 'tanggal', header: 'Tanggal' },
      { field: 'jumlah_rujukan', header: 'Jumlah Rujukan' },
      { field: 'jumlah_rujuk_balik', header: 'Jumlah Rujuk Balik' },
      { field: 'kode', header: 'Kode' },

    ];
    this.getDataSource()
   this.postOtomatis()
  }
  postOtomatis(){
    let status = false
    this.httpservice.getTransaksi('yankes/get-rujukan?tgl=' + moment(this.now).format('YYYY-MM-DD'))
    .subscribe(res => {
      var resultData: any = res
      resultData = resultData.list
    if( resultData!= undefined && resultData.length> 0){
      for (let i in resultData) {
        if (moment(this.now).format('YYYY-MM-DD') ==resultData[i].tanggal) {
          status = true
          var jsonSave = {
            "data": {
              "kode_kirim": resultData[i].kode,
              "tanggal": resultData[i].tanggal,
              "jumlah_rujukan": this.jmlRujukanMasuk,
              "jumlah_rujuk_balik": this.jmlRujukanKeluar,
      
            }
          }
      
          this.httpservice.postTransaksi('yankes/update-rujukan', jsonSave).subscribe(response => {
            var resp: any = response
            if (resp.kode == 200) {
              this.displayDialog = false
              this.alertService.success('Success', 'Post Rujukan Otomatis')
            }
            this.getDataSource();
          }, error => {
            this.alertService.error('Error', 'Post Rujukan Otomatis Gagal')
          });
          break
        }
      }
    }
 
    if(status ==  false){
      var da = {
        "data": {
          "kode_kirim": null,
          "tanggal": moment(this.now).format('YYYY-MM-DD'),
          "jumlah_rujukan": this.jmlRujukanMasuk,
          "jumlah_rujuk_balik": this.jmlRujukanKeluar,
  
        }
      }
  
      this.httpservice.postTransaksi('yankes/insert-rujukan', da).subscribe(response => {
        var resp: any = response
        if (resp.kode == 200) {
          this.displayDialog = false
          this.alertService.success('Success', 'Post Rujukan Otomatis')
        }
        this.getDataSource();
      }, error => {
        this.alertService.error('Error', 'Post Rujukan Otomatis Gagal')
      });
    }
  })

  }
  getSisrute() {
    var now = moment(new Date()).format('YYYY-MM-DD')
    this.httpservice.getTransaksi('sisrute/rujukan/get?tanggal=' + now).subscribe(response => {
      var res: any = response
      this.jmlRujukanMasuk = res.total
      console.log(res)
    })
    this.httpservice.getTransaksi('sisrute/rujukan/get?tanggal=' + now + '&create=true').subscribe(e => {
      var s: any = e
      this.jmlRujukanKeluar = s.total
      console.log(s)
    })

  }

  showDialogToAdd() {
    this.resetForm()
    this.displayDialog = true;
  }
  simpan() {
    var urlSave = 'yankes/insert-rujukan';
    if (this.formTambah.value.tanggal == null) {
      this.messageService.add({ severity: 'error', summary: 'Tanggal Harus di isi' });
      return
    }
    var jumlah_rujukan = 0
    if (this.formTambah.value.jumlah_rujukan != null)
      jumlah_rujukan = this.formTambah.value.jumlah_rujukan
    var jumlah_rujuk_balik = 0
    if (this.formTambah.value.jumlah_rujuk_balik != null)
      jumlah_rujuk_balik = this.formTambah.value.jumlah_rujuk_balik

    var kode_kirim = null
    if (this.formTambah.value.kode != null)
      kode_kirim = this.formTambah.value.kode

    var jsonSave = {
      "data": {
        "kode_kirim": kode_kirim,
        "tanggal": moment(this.formTambah.value.tanggal).format('YYYY-MM-DD'),
        "jumlah_rujukan": jumlah_rujukan,
        "jumlah_rujuk_balik": jumlah_rujuk_balik,

      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-rujukan';
    }
    this.httpservice.postTransaksi(urlSave, jsonSave).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Success' });
      }
      this.getDataSource();
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Simpan' });
    });
  }
  Ubah(selected) {
    this.formTambah.get('kode').setValue(selected.kode);
    this.formTambah.get('tanggal').setValue(new Date(selected.tanggal))
    this.formTambah.get('jumlah_rujukan').setValue(selected.jumlah_rujukan);
    this.formTambah.get('jumlah_rujuk_balik').setValue(selected.jumlah_rujuk_balik);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-rujukan?kode=' + selected.kode).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' });
      }
      this.getDataSource();
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Hapus' });

    });
  }


  resetForm() {
    this.formTambah.get('kode').reset();
    this.formTambah.get('tanggal').reset();
    this.formTambah.get('jumlah_rujukan').reset();
    this.formTambah.get('jumlah_rujuk_balik').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tanggal = moment(this.tanggal).format('YYYY-MM-DD')
    this.httpservice.getTransaksi('yankes/get-rujukan?tgl=' + tanggal)
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
