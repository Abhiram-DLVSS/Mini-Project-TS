import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { Location } from "./Location";

@Entity()
export class EmployeeDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  experience: string;

  @OneToOne(() => Employee, { cascade: true, eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  employee: Employee;

  @ManyToOne(() => Location, (location) => location.employeeDetails, {
    eager: true,
    onDelete: "CASCADE",
  })
  location: Location;
}
