import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value = '';
  data: any;
  jsonInput: string = "";
  formattedData: any;

  constructor() { }

  toJSON() {
    console.log("JSON: ", JSON.parse(this.jsonInput))
    let data = JSON.parse(this.jsonInput);
    console.log("JSON: ", data.filter((x: any) => x.error == undefined))
    this.formattedData = data.filter((x: any) => x.error == undefined)
  }

  getName = (manga: any) => { return manga.title_english ? manga.title_english : manga.title_japanese}
}
