import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "./product.entity";
import {UserEntity} from "./user.entity";

@Entity("productFavourites")
export class ProductFavouriteEntity {
    @PrimaryGeneratedColumn("uuid")
    id?: string;
    @ManyToOne(() => ProductEntity, product => product.productFavourites)
    @JoinColumn({name: "productId", referencedColumnName: "id"})
    product: ProductEntity;
    @ManyToOne(() => UserEntity, user => user.productFavourites)
    @JoinColumn({name: "userEmail", referencedColumnName: "email"})
    user: UserEntity;
}