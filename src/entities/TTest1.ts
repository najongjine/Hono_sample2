import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("t_test1_pkey", ["id"], { unique: true })
@Entity("t_test1", { schema: "public" })
export class TTest1 {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "name",
    nullable: true,
    length: 100,
    default: () => "''",
  })
  name: string | null;

  @Column("text", { name: "description", nullable: true, default: () => "''" })
  description: string | null;
}
