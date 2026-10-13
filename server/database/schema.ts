import { sql } from 'drizzle-orm'
import {
	type AnyPgColumn,
	boolean,
	check,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'
import type { ProjectContent, ProjectResult } from '../../shared/schemas/project-content'
import { reservedProjectSlugs, slugPattern } from '../../shared/schemas/project-slug'

export const projectStatus = pgEnum('project_status', ['draft', 'published', 'archived'])
export const workService = pgEnum('work_service', ['ai-content', 'website-development'])
export const mediaKind = pgEnum('media_kind', ['image', 'video'])

const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow()
const updatedAt = () =>
	timestamp({ withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())

const quoteSqlText = (value: string) => `'${value.replaceAll("'", "''")}'`
const slugPatternSql = sql.raw(quoteSqlText(slugPattern))
const reservedProjectSlugsSql = sql.raw(reservedProjectSlugs.map(quoteSqlText).join(', '))
const emptyProjectContent: ProjectContent = { version: 1, blocks: [] }

export const mediaAssets = pgTable(
	'media_assets',
	{
		id: uuid().primaryKey().defaultRandom(),
		key: text().notNull().unique(),
		kind: mediaKind().notNull(),
		contentType: text().notNull(),
		size: integer().notNull(),
		width: integer().notNull(),
		height: integer().notNull(),
		durationSeconds: real(),
		posterAssetId: uuid().references((): AnyPgColumn => mediaAssets.id, { onDelete: 'set null' }),
		createdAt: createdAt(),
	},
	(table) => [
		check('media_assets_size_check', sql`${table.size} > 0`),
		check('media_assets_dimensions_check', sql`${table.width} > 0 and ${table.height} > 0`),
	],
)

export const categories = pgTable(
	'categories',
	{
		id: uuid().primaryKey().defaultRandom(),
		name: text().notNull().unique(),
		slug: text().notNull().unique(),
		service: workService().notNull(),
		createdAt: createdAt(),
	},
	(table) => [check('categories_slug_check', sql`${table.slug} ~ ${slugPatternSql}`)],
)

export const projects = pgTable(
	'projects',
	{
		id: uuid().primaryKey().defaultRandom(),
		name: text().notNull(),
		slug: text().notNull().unique(),
		description: text().notNull().default(''),
		status: projectStatus().notNull().default('draft'),
		coverAssetId: uuid().references(() => mediaAssets.id, { onDelete: 'restrict' }),
		content: jsonb().$type<ProjectContent>().notNull().default(emptyProjectContent),
		client: text(),
		clientUrl: text(),
		year: integer(),
		liveUrl: text(),
		results: jsonb().$type<ProjectResult[]>().notNull().default([]),
		seoDescription: text(),
		seoKeywords: text().array().notNull().default(sql`'{}'::text[]`),
		ogImageAssetId: uuid().references(() => mediaAssets.id, { onDelete: 'set null' }),
		showOnHome: boolean().notNull().default(false),
		position: integer().notNull().default(0),
		publishedAt: timestamp({ withTimezone: true }),
		createdAt: createdAt(),
		updatedAt: updatedAt(),
	},
	(table) => [
		index('projects_status_position_index').on(table.status, table.position),
		check('projects_slug_check', sql`${table.slug} ~ ${slugPatternSql}`),
		check('projects_slug_reserved_check', sql`${table.slug} not in (${reservedProjectSlugsSql})`),
		check('projects_year_check', sql`${table.year} between 1900 and 2200`),
	],
)

export const projectCategories = pgTable(
	'project_categories',
	{
		projectId: uuid()
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		categoryId: uuid()
			.notNull()
			.references(() => categories.id, { onDelete: 'restrict' }),
	},
	(table) => [
		primaryKey({ columns: [table.projectId, table.categoryId] }),
		index('project_categories_category_index').on(table.categoryId),
	],
)

export const admins = pgTable(
	'admins',
	{
		id: uuid().primaryKey().defaultRandom(),
		email: text().notNull().unique(),
		name: text(),
		createdAt: createdAt(),
		lastLoginAt: timestamp({ withTimezone: true }),
	},
	(table) => [check('admins_email_lowercase_check', sql`${table.email} = lower(${table.email})`)],
)
