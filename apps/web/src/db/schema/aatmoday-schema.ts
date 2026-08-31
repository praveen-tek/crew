import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const aatmodayGroup = pgTable("aatmoday_group", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aatmodayEvent = pgTable(
  "aatmoday_event",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => aatmodayGroup.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    location: text("location"),
    startsAt: timestamp("starts_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("aatmoday_event_groupId_idx").on(table.groupId)],
);

export const matchRequest = pgTable(
  "match_request",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    interestText: text("interest_text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("match_request_userId_idx").on(table.userId)],
);

export const matchResult = pgTable(
  "match_result",
  {
    id: text("id").primaryKey(),
    matchRequestId: text("match_request_id")
      .notNull()
      .references(() => matchRequest.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => aatmodayGroup.id, { onDelete: "cascade" }),
    eventId: text("event_id").references(() => aatmodayEvent.id, {
      onDelete: "set null",
    }),
    score: real("score").notNull(),
    reasoning: text("reasoning").notNull(),
    icebreaker: text("icebreaker").notNull(),
    rank: integer("rank").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("match_result_matchRequestId_idx").on(table.matchRequestId),
    index("match_result_groupId_idx").on(table.groupId),
  ],
);

export const aatmodayGroupRelations = relations(
  aatmodayGroup,
  ({ many }) => ({
    events: many(aatmodayEvent),
    matchResults: many(matchResult),
  }),
);

export const aatmodayEventRelations = relations(aatmodayEvent, ({ one }) => ({
  group: one(aatmodayGroup, {
    fields: [aatmodayEvent.groupId],
    references: [aatmodayGroup.id],
  }),
}));

export const matchRequestRelations = relations(
  matchRequest,
  ({ one, many }) => ({
    user: one(user, {
      fields: [matchRequest.userId],
      references: [user.id],
    }),
    results: many(matchResult),
  }),
);

export const matchResultRelations = relations(matchResult, ({ one }) => ({
  request: one(matchRequest, {
    fields: [matchResult.matchRequestId],
    references: [matchRequest.id],
  }),
  group: one(aatmodayGroup, {
    fields: [matchResult.groupId],
    references: [aatmodayGroup.id],
  }),
  event: one(aatmodayEvent, {
    fields: [matchResult.eventId],
    references: [aatmodayEvent.id],
  }),
}));

export type AatmodayGroup = typeof aatmodayGroup.$inferSelect;
export type NewAatmodayGroup = typeof aatmodayGroup.$inferInsert;
export type AatmodayEvent = typeof aatmodayEvent.$inferSelect;
export type NewAatmodayEvent = typeof aatmodayEvent.$inferInsert;
export type MatchRequest = typeof matchRequest.$inferSelect;
export type NewMatchRequest = typeof matchRequest.$inferInsert;
export type MatchResult = typeof matchResult.$inferSelect;
export type NewMatchResult = typeof matchResult.$inferInsert;
