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
  dataByScoreBest: Array<any> = [];
  dataByScoreWorst: Array<any> = [];
  dataByLength: Array<any> = [];
  dataByPublishDate: Array<any> = [];
  dataAuthorsChapters: Array<any> = [];

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
    this.dataByScoreBest = this.sortByScoreBest();
    this.dataByScoreWorst = this.sortByScoreWorst();
    this.dataByPublishDate = this.sortByPublishDate();
    this.dataAuthorsChapters = this.sortByAuthorsLength();
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

  countChapters() {
    let tempData = [ ...this.formattedData.filter(x => x.chapters != null)];
    return this.sumChaptersReduce(tempData);
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

  sortByScoreBest() {
    let tempData = [ ...this.formattedData];
    return tempData.sort((a: any, b:any) => b.score - a.score);
  }

  sortByScoreWorst() {
    let tempData = [ ...this.formattedData];
    return tempData.sort((a: any, b:any) => a.score - b.score);
  }

  sortByAuthorsLength() {
    let authorsTotalChapters: any[] = [];
    
    this.groupByAuthor.forEach(mangaList => {
      authorsTotalChapters.push({
        name: mangaList[0].authors[0].name,
        totalChapters: this.sumChaptersReduce(mangaList)
      })
    })

    return authorsTotalChapters.sort((a: any, b: any) => b.totalChapters - a.totalChapters);
  }

  sumChaptersReduce(list: any) {
    return list.reduce((accumulator: any, obj: any) => {
      return accumulator + obj.chapters;
    }, 0)
  }
  
  groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
}
