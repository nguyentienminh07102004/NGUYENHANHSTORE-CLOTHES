import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProductVariantTypeEntity } from './product-variant-type.entity';

@Entity('productVariants')
export class ProductVariantEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string | null;
    @Column()
    stock: number;
    @Column({ nullable: true })
    image: string;
    @Column({ nullable: true })
    price: number | null;


    productVariantType: ProductVariantTypeEntity;
}