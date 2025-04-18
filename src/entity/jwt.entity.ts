import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("jwts")
export class JwtEntity {
    @PrimaryColumn()
    id: string;
    @Column()
    refreshToken: string;
    @Column({ type: "timestamp" })
    expireRefreshToken: Date;
    @ManyToOne(() => UserEntity, (user) => user.jwts)
    @JoinColumn({ name: "email", referencedColumnName: "email" })
    user: UserEntity;
}