import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {UserAddressEntity} from "./user-address.entity";
import {Role} from "../common/enum/Role.enum";
import {JwtEntity} from "./jwt.entity";

@Entity({name: "users"})
@Unique(["email"])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;
    @Column({name: 'email', unique: true, nullable: false})
    email: string;
    @Column({name: "password"})
    _password: string;
    @Column()
    fullName?: string;
    @Column({nullable: true})
    phone?: string;
    @Column({nullable: true})
    avatar?: string;
    @Column({default: Role.USER, type: "varchar"})
    role?: Role;

    @OneToMany(() => UserAddressEntity, userAddressEntity => userAddressEntity.user, {
        cascade: ["remove", "insert", "update"],
        orphanedRowAction: "delete"
    })
    userAddresses?: UserAddressEntity[];

    @OneToMany(() => JwtEntity, jwtEntity => jwtEntity.user, {
        cascade: ["remove", "insert", "update"],
        orphanedRowAction: "delete"
    })
    jwts?: JwtEntity[];
}