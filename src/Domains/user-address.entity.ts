import {UserEntity} from "./user.entity";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity("userAddresses")
export class UserAddressEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({nullable: false})
    address: string;

    @ManyToOne(() => UserEntity, user => user.userAddresses)
    @JoinColumn({name: "userEmail", referencedColumnName: "email"})
    user: UserEntity;
}