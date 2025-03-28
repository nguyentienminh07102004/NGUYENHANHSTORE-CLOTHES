import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductTypeEntity} from "./product-type.entity";

@Entity("products")
export class ProductEntity {
    @PrimaryGeneratedColumn("uuid")
    id?: string;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    image: string;
    @Column()
    price: number;

    @ManyToOne(() => ProductTypeEntity, (productType) => productType.products)
    @JoinColumn({name: "productTypeId"})
    typeProduct: ProductTypeEntity;
}