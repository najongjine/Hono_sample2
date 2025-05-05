import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("t_user_pkey", ["id"], { unique: true })
@Entity("t_user", { schema: "public" })
export class TUser {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "username", length: 50 })
  username: string;

  @Column("character varying", { name: "password", length: 1000 })
  password: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
