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
  decades: Array<number> = [];

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

    this.decades = this.countByDecades();
  }

  setPieChart(data: number[]) {
    return <EChartsOption>{
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {value: data[0], name: '40s'},
            {value: data[1], name: '50s'},
            {value: data[2], name: '60s'},
            {value: data[3], name: '70s'},
            {value: data[4], name: '80s'},
            {value: data[5], name: '90s'},
            {value: data[6], name: '00s'},
            {value: data[7], name: '10s'},
            {value: data[8], name: '20s'},
          ]
        }
      ]
    };
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
    let tempData = [ ...this.formattedData];
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

  countByDecades() {
    let tempData = [ ...this.formattedData];
    let countByDecade: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    tempData.map(x => x.published.from).forEach((data: Date) => {
      let year = new Date(data).getFullYear();


      if (year < 1950)
        countByDecade[0] += 1; 
      if (year >= 1950 && year < 1960)
        countByDecade[1] += 1; 
      if (year >= 1960 && year < 1970)
        countByDecade[2] += 1; 
      if (year >= 1970 && year < 1980)
        countByDecade[3] += 1; 
      if (year >= 1980 && year < 1990)
        countByDecade[4] += 1; 
      if (year >= 1990 && year < 2000)
        countByDecade[5] += 1; 
      if (year >= 2000 && year < 2010)
        countByDecade[6] += 1; 
      if (year >= 2010 && year < 2020)
        countByDecade[7] += 1; 
      if (year >= 2020)
        countByDecade[8] += 1; 
    });

    return countByDecade;
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
