import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  orders = [
    { id: 1, status: 'Shipped', totalPrice: 250 },
    { id: 2, status: 'Delivered', totalPrice: 150 },
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
