import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "resident", "tenant", "accountant"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Communities/Condominiums table
 */
export const communities = mysqlTable("communities", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 2 }).default("CL").notNull(), // ISO country code
  taxId: varchar("taxId", { length: 50 }), // RUT in Chile, CNPJ in Brazil
  adminId: int("adminId").notNull(),
  logo: text("logo"),
  settings: text("settings"), // JSON for country-specific settings
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Community = typeof communities.$inferSelect;
export type InsertCommunity = typeof communities.$inferInsert;

/**
 * Properties/Units within a community
 */
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  unitNumber: varchar("unitNumber", { length: 50 }).notNull(),
  floor: int("floor"),
  area: decimal("area", { precision: 10, scale: 2 }), // Square meters
  ownerId: int("ownerId"),
  tenantId: int("tenantId"),
  type: mysqlEnum("type", ["apartment", "house", "commercial", "parking", "storage"]).default("apartment").notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

/**
 * Common expenses (gastos comunes)
 */
export const commonExpenses = mysqlTable("commonExpenses", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  propertyId: int("propertyId").notNull(),
  period: date("period").notNull(), // YYYY-MM-DD (first day of month)
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  baseAmount: decimal("baseAmount", { precision: 10, scale: 2 }).notNull(),
  serviceCharge: decimal("serviceCharge", { precision: 10, scale: 2 }).default("0").notNull(),
  dueDate: date("dueDate").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "overdue", "partial"]).default("pending").notNull(),
  paidAt: timestamp("paidAt"),
  paidAmount: decimal("paidAmount", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommonExpense = typeof commonExpenses.$inferSelect;
export type InsertCommonExpense = typeof commonExpenses.$inferInsert;

/**
 * Expense items breakdown
 */
export const expenseItems = mysqlTable("expenseItems", {
  id: int("id").autoincrement().primaryKey(),
  commonExpenseId: int("commonExpenseId").notNull(),
  category: mysqlEnum("category", ["operating", "maintenance", "salary", "insurance", "fund", "other"]).notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["fixed", "variable", "percentage"]).default("fixed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpenseItem = typeof expenseItems.$inferSelect;
export type InsertExpenseItem = typeof expenseItems.$inferInsert;

/**
 * Community expenses/egresos
 */
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  description: text("description").notNull(),
  vendor: varchar("vendor", { length: 255 }),
  category: varchar("category", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("paymentDate").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "cancelled"]).default("pending").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 100 }),
  invoiceUrl: text("invoiceUrl"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

/**
 * Payments
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  commonExpenseId: int("commonExpenseId").notNull(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Publications/Posts
 */
export const publications = mysqlTable("publications", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: int("authorId").notNull(),
  category: varchar("category", { length: 100 }),
  isPinned: boolean("isPinned").default(false).notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Publication = typeof publications.$inferSelect;
export type InsertPublication = typeof publications.$inferInsert;

/**
 * Votations/Polls
 */
export const votations = mysqlTable("votations", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  status: mysqlEnum("status", ["draft", "active", "closed"]).default("draft").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Votation = typeof votations.$inferSelect;
export type InsertVotation = typeof votations.$inferInsert;

/**
 * Votation options
 */
export const votationOptions = mysqlTable("votationOptions", {
  id: int("id").autoincrement().primaryKey(),
  votationId: int("votationId").notNull(),
  optionText: varchar("optionText", { length: 255 }).notNull(),
  voteCount: int("voteCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VotationOption = typeof votationOptions.$inferSelect;
export type InsertVotationOption = typeof votationOptions.$inferInsert;

/**
 * User votes
 */
export const votes = mysqlTable("votes", {
  id: int("id").autoincrement().primaryKey(),
  votationId: int("votationId").notNull(),
  optionId: int("optionId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Vote = typeof votes.$inferSelect;
export type InsertVote = typeof votes.$inferInsert;

/**
 * Packages/Encomiendas
 */
export const packages = mysqlTable("packages", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  propertyId: int("propertyId").notNull(),
  carrier: varchar("carrier", { length: 100 }),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  receivedBy: int("receivedBy").notNull(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  pickedUpBy: int("pickedUpBy"),
  pickedUpAt: timestamp("pickedUpAt"),
  status: mysqlEnum("status", ["pending", "picked_up"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;

/**
 * Visits
 */
export const visits = mysqlTable("visits", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  propertyId: int("propertyId").notNull(),
  visitorName: varchar("visitorName", { length: 255 }).notNull(),
  visitorId: varchar("visitorId", { length: 50 }),
  visitDate: timestamp("visitDate").notNull(),
  authorizedBy: int("authorizedBy").notNull(),
  checkInAt: timestamp("checkInAt"),
  checkOutAt: timestamp("checkOutAt"),
  status: mysqlEnum("status", ["scheduled", "checked_in", "checked_out", "cancelled"]).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Visit = typeof visits.$inferSelect;
export type InsertVisit = typeof visits.$inferInsert;

/**
 * Incidents/Maintenance requests
 */
export const incidents = mysqlTable("incidents", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  propertyId: int("propertyId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  reportedBy: int("reportedBy").notNull(),
  assignedTo: int("assignedTo"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;

/**
 * Insurance policies
 */
export const insurances = mysqlTable("insurances", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  propertyId: int("propertyId"),
  policyNumber: varchar("policyNumber", { length: 100 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  coverage: text("coverage"),
  premium: decimal("premium", { precision: 10, scale: 2 }).notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
  documentUrl: text("documentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Insurance = typeof insurances.$inferSelect;
export type InsertInsurance = typeof insurances.$inferInsert;

/**
 * Funds (reserve, aguinaldo, etc.)
 */
export const funds = mysqlTable("funds", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["fixed", "percentage"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0").notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Fund = typeof funds.$inferSelect;
export type InsertFund = typeof funds.$inferInsert;

/**
 * Documents/Files
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  url: text("url").notNull(),
  category: varchar("category", { length: 100 }),
  uploadedBy: int("uploadedBy").notNull(),
  size: int("size"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedProperties: many(properties, { relationName: "owner" }),
  rentedProperties: many(properties, { relationName: "tenant" }),
  payments: many(payments),
  publications: many(publications),
  incidents: many(incidents),
}));

export const communitiesRelations = relations(communities, ({ many }) => ({
  properties: many(properties),
  expenses: many(expenses),
  publications: many(publications),
  votations: many(votations),
  funds: many(funds),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  community: one(communities, {
    fields: [properties.communityId],
    references: [communities.id],
  }),
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  tenant: one(users, {
    fields: [properties.tenantId],
    references: [users.id],
    relationName: "tenant",
  }),
  commonExpenses: many(commonExpenses),
  packages: many(packages),
  visits: many(visits),
}));

export const commonExpensesRelations = relations(commonExpenses, ({ one, many }) => ({
  property: one(properties, {
    fields: [commonExpenses.propertyId],
    references: [properties.id],
  }),
  items: many(expenseItems),
  payments: many(payments),
}));

export const expenseItemsRelations = relations(expenseItems, ({ one }) => ({
  commonExpense: one(commonExpenses, {
    fields: [expenseItems.commonExpenseId],
    references: [commonExpenses.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  commonExpense: one(commonExpenses, {
    fields: [payments.commonExpenseId],
    references: [commonExpenses.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const votationsRelations = relations(votations, ({ one, many }) => ({
  community: one(communities, {
    fields: [votations.communityId],
    references: [communities.id],
  }),
  options: many(votationOptions),
  votes: many(votes),
}));

export const votationOptionsRelations = relations(votationOptions, ({ one, many }) => ({
  votation: one(votations, {
    fields: [votationOptions.votationId],
    references: [votations.id],
  }),
  votes: many(votes),
}));

/**
 * Messages between users and admin
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  communityId: int("communityId").notNull(),
  senderId: int("senderId").notNull(),
  receiverId: int("receiverId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Notifications for users
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["info", "warning", "error", "success"]).default("info").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  link: text("link"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
