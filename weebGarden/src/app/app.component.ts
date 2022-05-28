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
  formattedData: Array<any> = [];
  tabSelected: number = 1;
  selectedManga: any;
  groupByAuthor: Array<any> = [];
  dataByScore: Array<any> = [];
  dataByLength: Array<any> = [];
  dataByPublishDate: Array<any> = [];;

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
    this.tabSelected = 1;
    this.formattedData = JSON.parse(this.jsonInput)?.filter((x: any) => x.error == undefined).map((x: any) => x.data);
    console.log("JSON: ", this.formattedData);
    this.groupByMangaByAuthor();
    this.dataByLength = this.sortByLength();
    this.dataByScore = this.sortByScore();
    this.dataByPublishDate = this.sortByPublishDate()
  }

  cleanTextArea = () => { this.jsonInput = ""; this.formattedData = [] }

  getName = (manga: any) => { return manga.title_english ? manga.title_english : manga.title }

  formatMangakaName(name: string){
     let nameSplitted = name.split(',');
     return nameSplitted[1] + " " + nameSplitted[0];
  }
  
  open(content: any, id: number) {
    this.selectedManga = this.formattedData.find((x: any) => x.mal_id == id);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' });
  }

  closeModal() {
    this.modalService.dismissAll();
    this.selectedManga = undefined;
  }

  groupByMangaByAuthor() {
    this.groupByAuthor = Object.values(this.groupBy(this.formattedData, x => x.authors[0].mal_id)).sort().reverse();
  }

  sortByLength() {
    let tempData = [ ...this.formattedData.filter(x => x.chapters != null)];
    return tempData.sort((a: any, b:any) => b.chapters - a.chapters);
  }

  sortByPublishDate() {
    let tempData = [ ...this.formattedData.filter(x => x.chapters != null)];
    return tempData.sort((a: any, b:any) => new Date(a.published.from).getTime() - new Date(b.published.from).getTime());
  }

  sortByScore() {
    let tempData = [ ...this.formattedData];
    return tempData.sort((a: any, b:any) => b.score - a.score);
  }
  
  groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
}
