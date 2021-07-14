import { User } from '../auth/user.model';

export class CarRental{
  id: number;
  name: string;
  city: string;
  address: string;
  owner: any;
  contactNumber: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
}
