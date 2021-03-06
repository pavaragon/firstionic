import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { map } from  'rxjs/operators'
import { firestore } from 'firebase';
import { Friend } from '../models/friend';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  allMessages: Observable<Message[]>;
  messageCollection: AngularFirestoreCollection<Message>; // pipeline to firebase database

  allFriends: Observable<Friend[]>;
  friendsCollection: AngularFirestoreCollection<Friend>; // pipeline to furebase datase

  constructor(private fb: AngularFirestore) {
    this.messageCollection = fb.collection<Message>('posts'); // initializa connecion app > firebase
    this.friendsCollection = fb.collection<Friend>('friends'); // initialize connection
  
  }


   //// GOOD WAY TO READ DATA WITHOUT DATE /////

//   retrieveMessagesFromDB() {
//     this.allMessages = this.messageCollection.valueChanges();
//   }

retrieveFriendsFromDB(){
  this.allFriends = this.friendsCollection.valueChanges();
} 

retrieveMessagesFromDB(){
  this.allMessages = this.messageCollection.snapshotChanges().pipe(
    map(actions => {
        return actions.map(a => {
            let data = a.payload.doc.data();
            var d: any = data.createdOn; // <- firebase data format
            if(d){
              data.createdOn = new firestore.Timestamp(d.seconds, d.nanoseconds).toDate();
            }
            return {... data }
        })
    })
  );
}


  public saveMessage(message) {
    var plain = Object.assign({}, message);
    this.messageCollection.add(plain);
  }

  public getAllMessages() {
    this.retrieveMessagesFromDB(); // subscribe to changes
    return this.allMessages;
  }

  public saveFriend(friend){
    var plain = Object.assign({}, friend);
    this.friendsCollection.add(plain);
  }
  
  public getAllFriends(){
    this.retrieveFriendsFromDB();
    return this.allFriends;
  }

}
