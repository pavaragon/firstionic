import { Component } from '@angular/core';
import { Friend } from '../models/friend';
import { SharedService } from '../services/shared.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  friend: Friend = new Friend();
  myFriends: Friend[] = [];

  constructor(private shared: SharedService, private data: DataService) {
    this.data.getAllFriends().subscribe(list => {
      // NOTE: the list contains all the firends in the DB, not only mine
      // this.myFriends = list;
      this.myFriends = [];
      for(let i =0; i< list.length; i++){
        var f = list[i];
        if(f.belongsto == this.shared.userName){
          this.myFriends.push(f);
        }
      }
    });
  }

  onSave(){
    this.friend.belongsto = this.shared.userName;
    console.log(this.friend);
    this.data.saveFriend(this.friend);
  }

}
