import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ProductVariantType')
export class ProductVariantTypeEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;
	@Column({ nullable: false })
	name: string;
	@Column({ nullable: true })
	description: string;
}