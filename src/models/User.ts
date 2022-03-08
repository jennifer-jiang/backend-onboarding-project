import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { Order } from './Order';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  name: string

  @Column()
  password: string

  @OneToMany(() => Order, order => order.user,
    { onDelete: 'CASCADE' })
  orders: Order[]
}