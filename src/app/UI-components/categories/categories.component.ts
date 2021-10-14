import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: {name: string, route: string, figPath: string}[] = [
    {name: "Humans", route: "#", figPath: "/assets/icons/Categories/cat-humans.png"},
    {name: "Animals", route: "#", figPath: "/assets/icons/Categories/cat-animals.png"},
    {name: "Insects", route: "#", figPath: "/assets/icons/Categories/cat-insects.png"},
    {name: "Nature", route: "#", figPath: "/assets/icons/Categories/cat-nature.png"},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
