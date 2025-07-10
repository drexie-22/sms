import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  schoolName: text("school_name").notNull(),
  dateOfDeployment: text("date_of_deployment").notNull(),
  completeAddress: text("complete_address").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  recipientName: text("recipient_name").notNull(),
  schoolType: text("school_type").notNull(), // "Elementary" or "Secondary"
  province: text("province").notNull(),
  yearDistributed: integer("year_distributed").notNull(),
  mouDocumentPath: text("mou_document_path"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;
