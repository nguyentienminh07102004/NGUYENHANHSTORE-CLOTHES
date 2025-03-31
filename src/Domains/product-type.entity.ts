import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";

@Entity("productTypes")
export class ProductTypeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({unique: true, nullable: false})
    name: string;
    @Column()
    description: string;

    @OneToMany(() => ProductEntity, (productType) => productType.typeProduct, {
        cascade: ['insert', 'update', 'remove'],
        orphanedRowAction: "delete"
    })
    products: ProductEntity[];
}