import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyZW5zYXIifQ.17VTLd-5zv4kDpj-d4NAn6ZH5BoaggOF4_Kaom0KuFMkTaI_ATyU6FX2hkuyvycD9TxxtP3d5mu1Rytv8SC7Fw';

let authorization = localStorage.getItem('X-AUTH-TOKEN');
if (authorization == null)
  authorization = token

const httpHeaders = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-AUTH-TOKEN': authorization
  })
};

@Injectable({
  providedIn: 'root'
})

export class AppService {
  dataPasienRajal: any[];
  dataTempatTidurTerpakai: any[];
  dataSourceInfoKedatangan: any[];
  http: HttpClient;
  urlPrefix: string;
  urlRoute:string;
  urlLogin: string;
  urlLogin2: string;
  urlLogout: string;
  urlLogout2: string;
  apiTimer: any;
  counter = 10;

  constructor(http: HttpClient, @Inject(Window) private window: Window) {
    this.http = http;
     if (this.window.location.hostname.indexOf('localhost') > -1) {
      this.urlPrefix = 'http://localhost:8000/service/transaksi/';
      this.urlLogin = 'http://localhost:8000/service/auth/sign-in';
      this.urlLogout = 'http://localhost:8000/service/auth/sign-out';
    } else if (this.window.location.hostname.indexOf('jasamedika') > -1) {
      this.urlPrefix = 'http://36.89.61.226:8000/service/transaksi/';
      this.urlLogin = 'http://36.89.61.226:8000/service/auth/sign-in';
      this.urlLogout = 'http://36.89.61.226:8000/service/auth/sign-out';
    } else {
      this.urlPrefix = 'http://36.89.61.226:8000/service/transaksi/';
      this.urlLogin = 'http://36.89.61.226:8000/service/auth/sign-in';
      this.urlLogout = 'http://36.89.61.226:8000/service/auth/sign-out';
    }
  }

  getTransaksi(url) {
    return this.http.get(this.urlPrefix + url, httpHeaders);
  }

  getService(url) {
    return this.http.get(this.urlRoute + url, httpHeaders);
  }


  postTransaksi(url, data) {
    return this.http.post(this.urlPrefix + url, data, httpHeaders);
  }

  deleteTransaksi(url) {
    return this.http.delete(this.urlPrefix + url, httpHeaders);
  }
  
  putTransaksi(url, data) {
    return this.http.put(this.urlPrefix + url, data, httpHeaders);
  }

  postLogin(data) {
    return this.http.post(this.urlLogin, data);
  }

  logout(datauserlogin, headersPost) {
    return this.http.post(this.urlLogout, datauserlogin, headersPost);
  }

  getColor() {
    return ['#7cb5ec', '#FF0000', '#C71585', '#434348', '#90ed7d', '#f7a35c',
      '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b',
      '#91e8e1', '#CD5C5C', '#FF69B4', '#FF8C00', '#9370DB', '#ADFF2F',
      '#00FF00', '#9ACD32', '#66CDAA', '#00FFFF', '#4682B4', '#800000',
      '#CD853F', '#191970', '#1E90FF', '#00CED1'];
  }
  getColorGiw() {
    return ['#7cb5ec', '#75b2a3', '#9ebfcc', '#acdda8', '#d7f4d2', '#ccf2e8',
      '#468499', '#088da5', '#00ced1', '#3399ff', '#00ff7f',
      '#b4eeb4', '#a0db8e', '#999999', '#6897bb', '#0099cc', '#3b5998',
      '#000080', '#191970', '#8a2be2', '#31698a', '#87ff8a', '#49e334',
      '#13ec30', '#7faf7a', '#408055', '#09790e'];
  }
  getUrlExternal(url) {
    return this.http.get(url);
  }
  goLogout() {
    var urlLogout = '#/login'
    var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"))
    var headersPost = {
      headers: {
        "AlamatUrlForm": urlLogout
      }
    }
    this.logout(datauserlogin, headersPost)
    window.localStorage.clear();
  }

}
