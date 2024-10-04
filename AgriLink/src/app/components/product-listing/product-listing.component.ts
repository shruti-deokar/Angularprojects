import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {
  products = [
    { name: 'Tomatoes', price: 50, imageUrl: 'assets/images/tomatoes.jpg' },
    { name: 'Potatoes', price: 30, imageUrl: 'assets/images/potatoes.jpg' },
    // Add more products here
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
