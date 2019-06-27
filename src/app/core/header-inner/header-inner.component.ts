import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppService } from '../../shared/app.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-header-inner',
  templateUrl: './header-inner.component.html',
  providers: [MessageService]
})
export class HeaderInnerComponent implements OnInit {
  constructor(public appservice: AppService, private messageService: MessageService, private router: Router,
  ) { }
  http: HttpClient;
  listMenuHeader: any;
  userLogin: string;
  resultLogout: any;
  apiTimer: any;
  counter = 10;
  jamSekarang:any;
  
  ngOnInit() {
    // this.apiTimer = setInterval(() => {
    //   this.getdate()
    // }, (1000)); //60 detik
    // setTimeout(function () {this.getdate() }, 1000);


    var temp = [];
    var pegawai = JSON.parse(window.localStorage.getItem('user-data'));
    if (pegawai == undefined) {
      this.router.navigate(['/']);
    }
    this.userLogin = pegawai.namaLengkap;
    temp.push({
      caption: "Logout (" + pegawai.namaLengkap + ")",
      link: "/app/Logout",
    });
    this.listMenuHeader = temp;
  }
  logout(): void {
    var urlLogout = '#/login';
    var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
    var dataRuangan = JSON.parse(window.localStorage.getItem('dataRuangan'));
    if (datauserlogin == undefined || datauserlogin == null) {
      return null;
    }

    if (dataRuangan == undefined || dataRuangan == null) {
      dataRuangan = {
        ruanganId: 0
      };
    }

    var headersPost = {
      headers: {
        "AlamatUrlForm": urlLogout,
        "kdRuangan": dataRuangan.ruanganId
      }
    }

    this.appservice.logout(datauserlogin, headersPost).subscribe(data => {
      this.resultLogout = data;
      window.localStorage.clear();
      this.router.navigate(['/login']);
    }, error => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Logout Gagal' });
    });
  }
  getdate() {
    var today = new Date();
    var h: any = today.getHours();
    var m: any = today.getMinutes();
    var s: any = today.getSeconds();
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }

    var months :any= ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays :any= ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var date :any = new Date();
    var day :any= date.getDate();
    var month :any= date.getMonth();
    var thisDay :any = date.getDay(),
      thisDay = myDays[thisDay];
    var yy :any = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;

    var tgl = ("Hari : " + thisDay + ', ' + day + ' ' + months[month] + ' ' + year);
    var jam = (h + ":" + m + ":" + s + " wib");
    // $("#timer").html(tgl + ' ' + jam);
    // setTimeout(function () {this.getdate() }, 1000);
    var el: HTMLElement = document.getElementById('timer');
    // console.log(el)
    this.jamSekarang = tgl + ' ' + jam
  
  }

}
