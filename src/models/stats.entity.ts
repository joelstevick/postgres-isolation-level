import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity('stats')
export class Stats {
    @Field(() => Int)
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;
    
    @Field(() => Int)
    @Column()
    value: number;
}