import { CarRental } from '../car-rental/car-rental.model';
import { Image } from '../shared/image.model';

export class Vehicle{
  id: number;
  mark: string;
  model: string;
  modelYear: any;
  manufactureYear: any;
  gears: number;
  color: string;
  gearbox: string;
  status: string;
  power: number;
  type: string;
  price: number;
  fuelType: string;
  gateNumber: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
  carRental: CarRental;
}
