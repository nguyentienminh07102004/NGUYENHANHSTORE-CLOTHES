import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "users"})
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({name: 'email', unique: true, nullable: false})
    email: string;
    @Column()
    password: string;
    @Column()
    fullName: string;
    @Column()
    phone: string;
    @Column({nullable: true})
    avatar: string;
    @Column({default: "USER"})
    role: string;
}