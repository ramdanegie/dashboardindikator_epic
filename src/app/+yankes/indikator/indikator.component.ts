
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/shared/app.service';
import * as Prism from 'prismjs';
import { MessageService, Message } from 'primeng/api';
import { MenuItem, StepsModule, FieldsetModule, SelectItem, LazyLoadEvent, ConfirmDialogModule, ConfirmationService, InputMaskModule } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import * as moment from 'moment';

@Component({
  selector: 'app-indikator',
  templateUrl: './indikator.component.html',
  styleUrls: ['./indikator.component.css'],
  providers: [ConfirmationService]
})
export class IndikatorComponent implements OnInit {
  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  tahun: any = new Date();
  bulanChar: any = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

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
    this.formTambah = this.fb.group({
      'kode': new FormControl(null),
      'periode': new FormControl(null),
      'tahun': new FormControl(null),
      'bto': new FormControl(null),
      'bor': new FormControl(null),
      'alos': new FormControl(null),
      'toi': new FormControl(null),
      'ndr': new FormControl(null),
      'gdr': new FormControl(null),
    });
    this.column = [
      { field: 'periode', header: 'Periode' },
      { field: 'tglkirim', header: 'Tgl Kirim' },
      { field: 'bor', header: 'BOR' },
      { field: 'alos', header: 'ALOS' },
      { field: 'toi', header: 'TOI' },
      { field: 'ndr', header: 'NDR' },
      { field: 'gdr', header: 'GDR' },
      // { field: 'kode', header: 'Kode' },
    ];
    this.getDataSource()
  }

  showDialogToAdd() {
    this.resetForm()
    this.displayDialog = true;
  }
  simpan() {
    var urlSave = 'yankes/insert-indikator';
    var formControl = this.formTambah.value
    if (formControl.periode == null) {
      this.messageService.add({ severity: 'error', summary: 'Periode Harus di isi' });
      return
    }
    var bor = 0
    if (formControl.bor != null)
      bor = formControl.bor

    var alos = 0
    if (formControl.alos != null)
      alos = formControl.alos

    var bto = 0
    if (formControl.bto != null)
      bto = formControl.bto

    var toi = 0
    if (formControl.toi != null)
      toi = formControl.toi

    var ndr = 0
    if (formControl.ndr != null)
      ndr = formControl.ndr

    var gdr = 0
    if (formControl.gdr != null)
      gdr = formControl.gdr

    var kode_kirim = null
    if (this.formTambah.value.kode != null)
      kode_kirim = this.formTambah.value.kode

    var jsonSave = {
      "data": {
        "kode_kirim": kode_kirim,
        "periode": parseFloat(moment(formControl.periode).format('MM')),
        "bor": bor,
        "alos": alos,
        "bto": bto,
        "toi": toi,
        "ndr": ndr,
        "gdr": gdr,
        "tahun": moment(formControl.periode).format('YYYY'),
      }
    }
    if (this.formTambah.value.kode != null) {
      urlSave = 'yankes/update-indikator';
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
  monthNameToNum(monthname) {
    var month = this.bulanChar.indexOf(monthname);
    return month ? month : 0;
  }
  Ubah(selected) {
    var bulan = this.monthNameToNum(selected.periode)
    var tahun = moment(this.tahun).format('YYYY')
    var fulldate = tahun + '-' + bulan + '-01'
    this.formTambah.get('kode').setValue(selected.kode);
    this.formTambah.get('periode').setValue(new Date(fulldate))
    this.formTambah.get('bor').setValue(selected.bor);
    this.formTambah.get('alos').setValue(selected.alos);
    this.formTambah.get('bto').setValue(selected.bto);
    this.formTambah.get('toi').setValue(selected.toi);
    this.formTambah.get('ndr').setValue(selected.ndr);
    this.formTambah.get('gdr').setValue(selected.gdr);
    this.displayDialog = true;
  }
  Hapus(selected) {
    this.httpservice.deleteTransaksi('yankes/delete-indikator?kode=' + selected.kode).subscribe(response => {
      var resp: any = response
      if (resp.kode == 200) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' });
      }
      this.ngOnInit();
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Hapus' });

    });
  }

  resetForm() {
    this.formTambah.get('kode').reset();
    this.formTambah.get('periode').reset();
    this.formTambah.get('bor').reset();
    this.formTambah.get('alos').reset();
    this.formTambah.get('bto').reset();
    this.formTambah.get('toi').reset();
    this.formTambah.get('ndr').reset();
    this.formTambah.get('gdr').reset();
  }
  Cari() {
    this.getDataSource()
  }
  getDataSource() {
    this.loading = true
    var tahun = moment(this.tahun).format('YYYY')
    this.httpservice.getTransaksi('yankes/get-indikator?tahun=' + tahun)
      .subscribe(res => {
        var result: any = res
        if (result.list != undefined && result.list.length > 0) {
          for (let i = 0; i < result.list.length; i++) {
            // result.list[i].periodeChar = '01-'+result.list[i].periode + '-'+ result.list[i].periode
            result.list[i].periode = this.bulanChar[parseFloat(result.list[i].periode)]
       
          }
        }

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
