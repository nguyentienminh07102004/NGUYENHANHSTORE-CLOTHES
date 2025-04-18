import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductTypeEntity} from "./product-type.entity";
import {ProductReviewEntity} from "./product-review.entity";
import {ProductFavouriteEntity} from "./product-favourite.entity";

@Entity("products")
export class ProductEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
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

    @OneToMany(() => ProductReviewEntity, (productReview) => productReview.product, {
        cascade: ['insert', "remove", 'update'],
        orphanedRowAction: 'delete'
    })
    productReviews: ProductReviewEntity[];

    @OneToMany(() => ProductFavouriteEntity, productFavourite => productFavourite.product, {
        cascade: ['insert', "remove", 'update'],
        orphanedRowAction: 'delete',
        onDelete: 'CASCADE'
    })
    productFavourites: ProductFavouriteEntity[];
}