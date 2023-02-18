import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Employee, { cascade: true, eager: true, onDelete: "CASCADE" })
  @JoinTable()
  employee: Employee[];
}