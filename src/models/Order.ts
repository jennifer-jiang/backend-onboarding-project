import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { Item } from './Item';
import { User } from './user';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  createdAt: Date

  @ManyToOne(() => User, user => user.orders,
    { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Item, item => item.orders,
    { onDelete: 'CASCADE' })
  item: Item
}