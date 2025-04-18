import {ProductEntity} from "./product.entity";
import {UserEntity} from "./user.entity";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity('productReviews')
export class ProductReviewEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    rating: number;
    @Column()
    review: string;
    @ManyToOne(() => ProductEntity, product => product.productReviews)
    @JoinColumn({ name: "productId", referencedColumnName: "id" })
    product: ProductEntity;
    @ManyToOne(() => UserEntity, user => user.productReviews)
    @JoinColumn({ name: "userEmail", referencedColumnName: "email" })
    user: UserEntity;
}