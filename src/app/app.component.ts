import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Subscription, forkJoin, Subject, fromEvent, of, Observable } from 'rxjs';
import { mergeMap, map, switchMap, debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { AppService} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  users: any;
  usersSubscription: Subscription;
  userSubscription: Subscription;
  dateSubscription: Subscription;
  comment: any;
  postTitle: any;
  albums: object;
  photos: object;
  todo = {};
  userName = '';
  searchedText: any;
  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit() {
    this.usersSubscription = this.http.get('https://jsonplaceholder.typicode.com/users').subscribe(data => {
      console.log(data);
      this.users = data;
    }, err => console.log(err), () => console.log('Users fetched!'));
    this.mergeMapExample();
    this.forkJoinExample();
    this.debounceTimeExample();
    this.searchedUser();
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.dateSubscription.unsubscribe();
  }

  mergeMapExample() {
  this.http.get('https://jsonplaceholder.typicode.com/posts').pipe(map(posts => {
    const post = posts[0];
    this.postTitle = posts[0].title;
    console.log(this.postTitle);
    return post;
  }),
  mergeMap(post =>
    this.http.get('https://jsonplaceholder.typicode.com/comments/' + post.id)
  )).subscribe( comments => {
    this.comment = comments;
    console.log(this.comment);
  });
  }

  forkJoinExample() {
    const albums = this.http.get('https://jsonplaceholder.typicode.com/albums/');
    const photos = this.http.get('https://jsonplaceholder.typicode.com/photos/');

    forkJoin([albums, photos]).subscribe( result => {
      this.albums = result[0];
      this.photos = result[1];
    }, err => console.log(err), () => console.log('Both Items fetched'));
  }

 searchText(event) {
   console.log(event.target.value);
   this.service.sendText(event.target.value);
   this.searchedUser();
  }

  searchedUser() {
    this.userSubscription = this.service.getText().subscribe(
      data => { 
        console.log(data);
        this.userName = data;
        const index = this.users ? this.users.findIndex( x=> x.name === data) : -1;
        const id = index > -1 ? this.users[index].id : '';
        this.http.get('https://jsonplaceholder.typicode.com/todos/' + id).subscribe(todos => {
          console.log('Todos',todos);
          this.todo = todos;
        });
      }, err => console.log(err), ()=> console.log('Got the text'));
    
    this.searchedText = this.service.getText();
  }


  getChangedDate(event) {
    console.log(event);
    this.service.sendBdate(event);
    this.getDate();
  }

  getDate() {
    const date = this.service.getBdate();
    console.log(date);
  }

  debounceTimeExample(){
    const searchBox = document.getElementById('search');
    const keyup = fromEvent(searchBox, 'keyup');
    keyup.pipe(
     map((i: any) => console.log('Value',i.currentTarget.value)),
     debounceTime(1000)
    )
    .subscribe();
  }
  
}
