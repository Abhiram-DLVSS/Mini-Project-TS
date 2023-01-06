import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EmployeeDetails } from "./EmployeeDetails";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @OneToMany(
    () => EmployeeDetails,
    (employeeDetails) => employeeDetails.location,
    { onDelete: "CASCADE" }
  )
  employeeDetails: EmployeeDetails[];
}
