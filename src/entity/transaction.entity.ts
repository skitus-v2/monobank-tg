import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  amount: number;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'timestamp' })
  time: Date;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  account: string;

  @Column({ type: 'varchar' })
  accountHolder: string;

  constructor() {
    this.id = 0; 
    this.amount = 0;
    this.currency = '';
    this.time = new Date();
    this.description = '';
    this.account = '';
    this.accountHolder = '';
  }
}
