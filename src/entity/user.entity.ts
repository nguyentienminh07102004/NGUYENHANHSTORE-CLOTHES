import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {UserAddressEntity} from "./user-address.entity";
import {Role} from "../common/enum/Role.enum";
import {JwtEntity} from "./jwt.entity";
import {ProductReviewEntity} from "./product-review.entity";
import {ProductFavouriteEntity} from "./product-favourite.entity";

@Entity("users")
@Unique(["email"])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({name: 'email', unique: true, nullable: false})
    email!: string;
    @Column({name: "password"})
    _password: string;
    @Column({nullable: true})
    fullName: string;
    @Column({nullable: true})
    phone?: string;
    @Column({nullable: true})
    avatar?: string;
    @Column({default: Role.USER, type: "varchar"})
    role: Role;

    @OneToMany(() => UserAddressEntity, userAddressEntity => userAddressEntity.user, {
        cascade: ["remove", "insert", "update"],
        orphanedRowAction: "delete"
    })
    userAddresses?: UserAddressEntity[];

    @OneToMany(() => JwtEntity, jwtEntity => jwtEntity.user, {
        cascade: ["remove", "insert", "update"],
        orphanedRowAction: "delete"
    })
    jwts: JwtEntity[];

    @ManyToOne(() => ProductReviewEntity, (productReview) => productReview.user, {
        cascade: ["insert", "remove", 'update'],
        orphanedRowAction: "delete",
        onDelete: "CASCADE"
    })
    productReviews: ProductReviewEntity[];

    @OneToMany(() => ProductFavouriteEntity, (productFavourite) => productFavourite.user, {
        cascade: ["remove", "insert", "update"],
        orphanedRowAction: "delete",
        onDelete: "CASCADE"
    })
    productFavourites: ProductFavouriteEntity[];
}