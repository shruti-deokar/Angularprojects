import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farmer-profile',
  templateUrl: './farmer-profile.component.html',
  styleUrls: ['./farmer-profile.component.css']
})
export class FarmerProfileComponent implements OnInit {
  farmer = {
    name: 'Ramesh Singh',
    bio: 'Experienced farmer growing organic vegetables and grains in Maharashtra.',
    imageUrl: 'assets/images/farmer.jpg',
    products: [
      { name: 'Carrots', price: 40 },
      { name: 'Wheat', price: 100 },
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }
}
