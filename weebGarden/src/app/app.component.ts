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
  tabSelected: number = 1;

  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  constructor() { }

  toJSON() {
    console.log("JSON: ", JSON.parse(this.jsonInput).filter((x: any) => x.error == undefined));
    this.tabSelected = 1;
    this.formattedData = JSON.parse(this.jsonInput)?.filter((x: any) => x.error == undefined).map((x: any) => x.data);
  }

  cleanTextArea = () => { this.jsonInput = ""; this.formattedData = [] }

  getName = (manga: any) => { return manga.title_english ? manga.title_english : manga.title_japanese }
}
