import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EChartsOption } from 'echarts';

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
  selectedManga: any;

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

  constructor(private modalService: NgbModal) { }

  toJSON() {
    console.log("JSON: ", JSON.parse(this.jsonInput).filter((x: any) => x.error == undefined));
    this.tabSelected = 1;
    this.formattedData = JSON.parse(this.jsonInput)?.filter((x: any) => x.error == undefined).map((x: any) => x.data);
  }

  cleanTextArea = () => { this.jsonInput = ""; this.formattedData = [] }

  getName = (manga: any) => { return manga.title_english ? manga.title_english : manga.title_japanese }
  
  open(content: any, id: number) {
    this.selectedManga = this.formattedData.find((x: any) => x.mal_id == id);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  closeModal() {
    this.modalService.dismissAll();
    this.selectedManga = undefined;
  }
}
