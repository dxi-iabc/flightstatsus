import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100, unique: true })
  public username: string;

  @Column({ length: 50 })
  public password: string | undefined;

  @Column({ length: 50 })
  public iATACode: string | undefined;

  @Column({ length: 100 ,name: "fullName"})
  public fullName: string | undefined;

  @Column({ length: 255,name: "type" })
  public type: string | undefined;
  
  @Column()
  public flag: boolean | undefined;
  

  @Column()
  public isActive: boolean | undefined;
}
