import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/app.service';
import { MessageService, Message } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  checked = false;
  username: string
  password: string
  result: any;
  resultAkses: any;
  loading = false;
  showLoading: boolean = false;
  constructor(public appservice: AppService, private messageService: MessageService, private router: Router,
  ) { }

  ngOnInit() {
    window.localStorage.clear();
  }
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.login();
    }
  }
  login(): void {
    this.showLoading = true
    this.loading = true;
    window.localStorage.clear();
    var delete_cookie = function (name) {
      var today = new Date();
      var expr = new Date(today.getTime() + (-1 * 24 * 60 * 60 * 1000));
      document.cookie = name + '=;expires=' + (expr.toUTCString());
    }
    delete_cookie('authorization');
    delete_cookie('statusCode');
    delete_cookie('io');
    var obj = {
      'namaUser': this.username,
      'kataSandi': this.password
    }
    this.appservice.postLogin(obj).subscribe(data => {
      this.showLoading = false
      this.loading = false;
      this.result = data;
      this.messageService.add({ severity: 'success', summary: 'Sukses', detail: 'Login Sukses' });
      var cookieStr = "statusCode=" + this.result.data.kelompokUser.kelompokUser + ';';
      document.cookie = cookieStr;
      document.cookie = 'authorization=' + this.result.messages['X-AUTH-TOKEN'] + ";";
      var dataUserLogin = {
        id: this.result.data.id,
        kdUser: this.result.data.namaUser,
        waktuLogin: new Date()
      };
      window.localStorage.setItem('datauserlogin', JSON.stringify(dataUserLogin));
      window.localStorage.setItem('user-data', JSON.stringify(this.result.data.pegawai));

      this.router.navigate(['/home']);
      // this.appservice.getTransaksi('eis/hakakses?pegawaiId=' + this.result.data.pegawai.id).subscribe(data => {
      //   this.resultAkses = data;
      //   if (this.resultAkses == 'sukses') {
      //     this.router.navigate(['home']);
      //   }
      //   else
      //     this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Anda tidak memiliki hak akses' });
      // }, error => {
      //   console.log(error);
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Terjadi Kesalahan' });
      // });

    }, error => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login Gagal' });
    });




  }
}