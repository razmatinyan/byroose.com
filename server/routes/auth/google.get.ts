import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { admins } from '../../database/schema'

const googleUserSchema = z.object({
	email: z.email(),
	email_verified: z.literal(true),
	name: z.string().optional(),
})

export default defineOAuthGoogleEventHandler({
	async onSuccess(event, { user }) {
		const googleUser = googleUserSchema.safeParse(user)

		if (!googleUser.success) {
			return sendRedirect(event, '/g?error=unauthorized')
		}

		const [admin] = await useDb(event)
			.update(admins)
			.set({ lastLoginAt: new Date() })
			.where(eq(admins.email, googleUser.data.email.toLowerCase()))
			.returning({ id: admins.id, email: admins.email, name: admins.name })

		if (!admin) {
			return sendRedirect(event, '/g?error=unauthorized')
		}

		await replaceUserSession(event, {
			user: { id: admin.id, email: admin.email, name: admin.name ?? googleUser.data.name ?? null },
		})

		return sendRedirect(event, '/work')
	},
	onError(event, error) {
		console.error('Google sign in failed', error.message)
		return sendRedirect(event, '/g?error=failed')
	},
})
