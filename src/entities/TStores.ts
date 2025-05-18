import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("t_stores_pkey", ["id"], { unique: true })
@Index("idx_stores_location", ["location"], {})
@Entity("t_stores", { schema: "public" })
export class TStores {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name" })
  name: string;

  @Column("geography", { name: "location" })
  location: string;
}
