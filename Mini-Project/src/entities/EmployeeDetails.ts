import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./Employee";
import { Location } from "./Location";

@Entity()
export class EmployeeDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default : 0})
  experience: number;

  @Column({ default: 0 })
  salary: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_updated: Date;

  @OneToOne(() => Employee, { cascade: true, eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  employee: Employee;

  @ManyToOne(() => Location, (location) => location.employeeDetails, { eager: true, onDelete: "CASCADE" })
  location: Location;
}