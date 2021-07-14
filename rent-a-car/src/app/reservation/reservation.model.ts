import { User } from "../auth/user.model";
import { Vehicle } from "../vehicle/vehicle.model";

export class Reservation{
  id: number;
  user: User;
  vehicle:Vehicle;
  startTime: Date;
  endTime: Date;
  status: string;
  paymentMethod: string;
  paymentAmount: number;
  info:string;
}
