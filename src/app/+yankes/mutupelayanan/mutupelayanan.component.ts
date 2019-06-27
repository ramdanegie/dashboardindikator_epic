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
  selector: 'app-mutupelayanan',
  templateUrl: './mutupelayanan.component.html',
  styleUrls: ['./mutupelayanan.component.css'],
  providers: [ConfirmationService]
})
export class MutupelayananComponent implements OnInit {
  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  tahun: any = new Date();
  bulanChar: any = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  listMutu: SelectItem[];
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
      'tanggal': new FormControl(null),
      'kode_mutu': new FormControl(null),
      'nilai': new FormControl(null),
      'norec': new FormControl(null),
    
    });
    this.column = [
      { field: 'tgl', header: 'Bulan' },
      // { field: 'tahun', header: 'Tahun' },
      // { field: 'tglkirim', header: 'Tgl Kirim' },
      { field: 'mutu_pelayanan', header: 'Mutu Pelayanan' },
      { field: 'nilai', header: 'Nilai' },
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
    var urlSave = 'yankes/insert-mutupelayanan';
    var formControl = this.formTambah.value
    if (formControl.tanggal == null) {
      this.messageService.add({ severity: 'error', summary: 'Tanggal Harus di isi' });
      return
    }
    var kode_mutu = null
    if (formControl.kode_mutu != null)
    kode_mutu = formControl.kode_mutu

    var nilai = 0
    if (formControl.nilai != null)
    nilai = formControl.nilai 

    var kode_kirim = null
    if (this.formTambah.value.kode != null)
      kode_kirim = this.formTambah.value.kode

    var jsonSave = {
      "data": {
        "kode_kirim": kode_kirim,
        "bulan": moment(formControl.tanggal).format('MM'),
        "kode_mutu": kode_mutu,
        "nilai": nilai,
       
      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-mutupelayanan';
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
      var mutu_pelayanan = null
      for(let i in this.listPemeriksaanTemp){
        if(this.listPemeriksaanTemp[i].kodeexternal == kode_mutu){
          mutu_pelayanan = this.listPemeriksaanTemp[i].mutupelayanan
          break
        }
      }
      var jsonSave2 = {
        "norec": formControl.norec,
        "kode_kirim": kode_kirim,
        "tanggal": moment(formControl.tanggal).format('YYYY-MM-01'),
        "bulan": moment(formControl.tanggal).format('MM'),
        "kode_mutu": kode_mutu,
        "mutu_pelayanan":mutu_pelayanan,
        "nilai": nilai,
      }
      this.httpservice.postTransaksi('yankes/save-local-mutupelayanan', jsonSave2).subscribe(res => {
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
    this.formTambah.get('kode').setValue(selected.kode);
    this.formTambah.get('tanggal').setValue(new Date(selected.tanggal))
    this.formTambah.get('kode_mutu').setValue(selected.kode_mutu);
    this.formTambah.get('nilai').setValue(selected.nilai);
    this.formTambah.get('norec').setValue(selected.norec);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-mutupelayanan?kode=' + selected.kode_kirim).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' })
        this.httpservice.deleteTransaksi('yankes/delete-local-mutupelayanan?norec=' + selected.norec).subscribe(response => {
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
    this.formTambah.get('kode_mutu').reset();
    this.formTambah.get('nilai').reset();
    this.formTambah.get('norec').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tahun = moment(this.tahun).format('YYYY-MM-DD')
    this.httpservice.getTransaksi('yankes/get-local-mutupelayanan?tgl=' + tahun)
      .subscribe(res => {
        var result: any = res
        if (result.list != undefined && result.list.length > 0) {
          for (let i = 0; i < result.list.length; i++) {
           
            result.list[i].tgl = moment(new Date( result.list[i].tanggal)).format('MM-YYYY')
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
    this.httpservice.getTransaksi('yankes/get-master-mutupelayanan')
      .subscribe(res => {
        var result: any = res
        if (result.list !== undefined) {
          this.listMutu = [];
          this.listMutu.push({ label: '--Pilih--', value: '' });
          for (var i = 0; i < result.list.length; i++) {
            this.listMutu.push({ label: result.list[i].mutupelayanan, value: result.list[i].kodeexternal });
            this.listPemeriksaanTemp.push(result.list[i])
          };
        } else {
          this.listMutu = [];
          this.listMutu.push({ label: '--Data Tidak Ada--', value: '' });
        }
      },
        error => {
          this.listMutu = [];
          this.listMutu.push({ label: '--Koneksi Error--', value: '' })
        });

  }
  /**
     * @method ngAfterViewInit
     */
  ngAfterViewInit() {
    Prism.highlightAll();
  }
}
