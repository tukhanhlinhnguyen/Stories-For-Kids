import { Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from 'src/app/model/story.model';
import { Storybook } from 'src/app/model/storybook.model';
import { Student } from 'src/app/model/student.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnChanges {

  strname: any;

  storybookLevelRefObj = [
    'aa', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Z1', 'Z2'
  ];
  displayLevel: string = "aa";
  bookLevelImage: string;
  bookLevelLetterImgs = {
    "aa": "../../../../assets/icons/StudentLevel/svg/studentLevel_aa.svg",
    "A": "../../../../assets/icons/StudentLevel/svg/studentLevel_a.png",
    "B": "../../../../assets/icons/StudentLevel/svg/studentLevel_b.png",
    "C": "../../../../assets/icons/StudentLevel/svg/studentLevel_c.png",
    "D": "../../../../assets/icons/StudentLevel/svg/studentLevel_d.png",
    "E": "../../../../assets/icons/StudentLevel/svg/studentLevel_e.png",
    "F": "../../../../assets/icons/StudentLevel/svg/studentLevel_f.png",
    "G": "../../../../assets/icons/StudentLevel/svg/studentLevel_g.png",
    "H": "../../../../assets/icons/StudentLevel/svg/studentLevel_h.png",
    "I": "../../../../assets/icons/StudentLevel/svg/studentLevel_i.png",
    "J": "../../../../assets/icons/StudentLevel/svg/studentLevel_j.png",
    "K": "../../../../assets/icons/StudentLevel/svg/studentLevel_k.png",
    "L": "../../../../assets/icons/StudentLevel/svg/studentLevel_l.png",
    "M": "../../../../assets/icons/StudentLevel/svg/studentLevel_m.png",
    "N": "../../../../assets/icons/StudentLevel/svg/studentLevel_n.png",
    "O": "../../../../assets/icons/StudentLevel/svg/studentLevel_o.png",
    "P": "../../../../assets/icons/StudentLevel/svg/studentLevel_p.png",
    "Q": "../../../../assets/icons/StudentLevel/svg/studentLevel_q.png",
    "R": "../../../../assets/icons/StudentLevel/svg/studentLevel_r.png",
    "S": "../../../../assets/icons/StudentLevel/svg/studentLevel_s.png",
    "T": "../../../../assets/icons/StudentLevel/svg/studentLevel_t.png",
    "U": "../../../../assets/icons/StudentLevel/svg/studentLevel_u.png",
    "V": "../../../../assets/icons/StudentLevel/svg/studentLevel_v.png",
    "W": "../../../../assets/icons/StudentLevel/svg/studentLevel_w.png",
    "X": "../../../../assets/icons/StudentLevel/svg/studentLevel_x.png",
    "Y": "../../../../assets/icons/StudentLevel/svg/studentLevel_y.png",
    "Z": "../../../../assets/icons/StudentLevel/svg/studentLevel_z.png"
  }

  @Input() books: { storyName: string; hasAudio: boolean }[] = [];
  @Input() storybooks: string;
  storybookObjects: Storybook[] = [];
  currentDisplayStorybookObjects: Storybook[] = [];
  playableStorybookLevels: string[] = [];
  @Output() bookOpened = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit(): void {

    // check before
    if (this.storybooks == null || this.storybooks.length == 0)
      return;

    //
    this.storybookObjects = JSON.parse(this.storybooks);
    this.calculatePlayableStorybookLevels();
    this.filterStorybooks();
  }

  ngOnChanges() {

    // YA210928 we add this so when storybooks is not empty anymore, the list of books does show

    // check before
    if (this.storybooks == null || this.storybooks.length == 0)
      return;

    //
    this.storybookObjects = JSON.parse(this.storybooks);
    this.calculatePlayableStorybookLevels();
    this.filterStorybooks();
  }

  emitBookName(book: { storyName: string; hasAudio: boolean }) {
    this.bookOpened.emit(book);
  }

  f1(strname) {
    this.strname = strname;
    localStorage.setItem("strname", JSON.stringify(this.strname));
  }

  filterStorybooks(): void {

    this.currentDisplayStorybookObjects = [];

    //
    for (var i = 0; i < this.storybookObjects.length; i++) {

      var currentStorybookLevel = this.storybookObjects[i].storybookReadingLevel;
      this.bookLevelImage = this.bookLevelLetterImgs[this.storybookObjects[i].storybookReadingLevel];
      if (currentStorybookLevel == this.displayLevel) {
        if (this.playableStorybookLevels.includes(currentStorybookLevel)) {
          this.storybookObjects[i].playable = true;
        }
        this.currentDisplayStorybookObjects.push(this.storybookObjects[i]);
      }
    }
  }

  calculatePlayableStorybookLevels() {
    var user: Student = JSON.parse(localStorage.getItem("user"));
    if (user) {
      var studentReadingLevel = user.studentReadingLevel
      for (var i = 0; i < this.storybookLevelRefObj.length; i++) {
        var currentStorybookLevel = this.storybookLevelRefObj[i];
        if (currentStorybookLevel == studentReadingLevel) {
          this.playableStorybookLevels.push(currentStorybookLevel);
          break;
        }
        this.playableStorybookLevels.push(currentStorybookLevel);
      }
    }
  }

  changeStorybookLevel(levelButton) {
    this.displayLevel = levelButton.target.attributes['storybookLevel'].value;
    this.filterStorybooks();
  }

  showQuiz(storyBook: Storybook) {
    this.f1(storyBook.storyName);
    localStorage.setItem("storybook", JSON.stringify(storyBook));
    this.router.navigate([`/story/${storyBook.quizId}/quiz`])
  }

  showStory(storyBook: Storybook) {
    localStorage.setItem("storybook", JSON.stringify(storyBook));
    this.router.navigate([`/story/${storyBook.storybookId}`])
  }

  storybookImageClicked(storyBook: Storybook) {
    localStorage.setItem("storybook", JSON.stringify(storyBook));
    this.router.navigate([`/story/${storyBook.storybookId}`])
  }
}
