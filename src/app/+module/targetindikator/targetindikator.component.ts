import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Highcharts, Chart } from 'angular-highcharts';
import { AppService } from 'src/app/shared/app.service';
import * as Prism from 'prismjs';
import { MessageService, Message } from 'primeng/api';
import { MenuItem, StepsModule, FieldsetModule, SelectItem, LazyLoadEvent, ConfirmDialogModule, ConfirmationService, InputMaskModule } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-targetindikator',
  templateUrl: './targetindikator.component.html',
  styleUrls: ['./targetindikator.component.css'],
  providers: [ConfirmationService]
})
export class TargetindikatorComponent implements AfterViewInit, OnInit {
  public now: Date = new Date();
  formTambah: FormGroup;
  loading: boolean;
  dataSource: any;
  column: any[];
  displayDialog: boolean;
  item: any;
  newCar: boolean;
  selectedCar: any;
  d_Indikator: SelectItem[];
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public httpservice: AppService,
  ) {

  }

  ngOnInit() {
    this.getCombo()
    this.formTambah = this.fb.group({
      'Id': new FormControl(null),
      'Indikator': new FormControl(null),
      'Tahun': new FormControl(null),
      'Target': new FormControl(null),
      'Keterangan': new FormControl(null),

    });
    this.column = [
      { field: 'indikator', header: 'Nama Indikator' },
      { field: 'tahuns', header: 'Target' },
      { field: 'target', header: 'Target' },
      { field: 'pic', header: 'PIC' },
      { field: 'keterangan', header: 'Keterangan' },

    ];
    this.getDataSource()
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
    if (this.formTambah.value.Tahun instanceof Date) {
      var tahun = this.formTambah.value.Tahun.getFullYear()
    } else
      var tahun = this.formTambah.value.Tahun
    this.formTambah.value.Tahun = tahun
    this.httpservice.postTransaksi('rensar/save-target-indikator', this.formTambah.value).subscribe(response => {
      var resp: any = response
      if (resp.status == 201) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' });
      }

      this.ngOnInit();
      // this.visible = false;
      // setTimeout(() => this.visible = true, 0);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Simpan' });

    });
  }
  Ubah(selected) {
    this.formTambah.get('Id').setValue(selected.id);
    this.formTambah.get('Indikator').setValue(selected.indikatorrensarfk);
    this.formTambah.get('Tahun').setValue(new Date(selected.tahuns));
    this.formTambah.get('Target').setValue(selected.target);
    this.formTambah.get('Keterangan').setValue(selected.keterangan);
    this.displayDialog = true;
  }
  Hapus(selected) {
    var data = {
      "id": selected.id
    }
    this.httpservice.postTransaksi('rensar/delete-target-indikator', data).subscribe(response => {
      var resp: any = response
      if (resp.status == 201) {
        this.displayDialog = false
        this.messageService.add({ severity: 'success', summary: 'Sukses' });
      }

      this.ngOnInit();
      // this.visible = false;
      // setTimeout(() => this.visible = true, 0);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Data Gagal Di Hapus' });

    });
  }


  resetForm() {
    this.formTambah.get('Id').reset();
    this.formTambah.get('Indikator').reset();
    this.formTambah.get('Tahun').reset();
    this.formTambah.get('Target').reset();
    this.formTambah.get('Keterangan').reset();

  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        // control.markAsDirty();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  getDataSource() {
    this.loading = true
    this.httpservice.getTransaksi('rensar/get-target-indikator')
      .subscribe(res => {
        var result: any = res
        this.dataSource = result.data
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
