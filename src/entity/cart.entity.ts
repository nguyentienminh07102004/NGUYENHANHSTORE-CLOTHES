import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("carts")
export class CartEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string | null;
    @Column()
    quantity: number;
}