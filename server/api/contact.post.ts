import {
	contactFormSchema,
	contactHoneypotField,
	getContactFormErrors,
} from '../../app/lib/contact-form'

const contactRateLimit = { limit: 5, windowMs: 10 * 60 * 1000 }

function readHoneypot(body: unknown) {
	if (typeof body !== 'object' || body === null) return ''
	const value: unknown = Reflect.get(body, contactHoneypotField)
	return typeof value === 'string' ? value : ''
}

export default defineEventHandler(async (event) => {
	const body: unknown = await readBody(event)
	if (readHoneypot(body)) return { sent: true }

	const result = contactFormSchema.safeParse(body)
	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid contact form',
			data: { fieldErrors: getContactFormErrors(result.error) },
		})
	}

	const clientKey = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
	if (isRateLimited(`contact:${clientKey}`, contactRateLimit)) {
		throw createError({
			statusCode: 429,
			statusMessage: 'Too many messages, try again later',
		})
	}

	const { contactInboxEmail, resendApiKey } = useRuntimeConfig(event)
	if (!resendApiKey) {
		console.error({ event: 'contact_mail_unconfigured' })
		throw createError({
			statusCode: 503,
			statusMessage: 'The contact form is not available',
		})
	}

	await sendContactMail(
		{ apiKey: resendApiKey, inboxEmail: contactInboxEmail },
		result.data,
	)
	return { sent: true }
})
