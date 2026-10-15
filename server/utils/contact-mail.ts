import type { ContactFormPayload } from '../../app/lib/contact-form'
import { siteEmail, siteName } from '../../app/lib/site'

const resendEmailsEndpoint = 'https://api.resend.com/emails'
const contactMailSender = `${siteName} website <contact@hello.byroose.com>`


function singleLine(value: string) {
	return value.replace(/\s+/g, ' ').trim()
}

function contactMailText({ name, email, idea }: ContactFormPayload) {
	return [
		`New enquiry from the ${siteName} contact form.`,
		'',
		`Name: ${name}`,
		`Email: ${email}`,
		'',
		'Idea:',
		idea || 'No idea shared.',
	].join('\n')
}

async function idempotencyKey({ name, email, idea }: ContactFormPayload) {
	const source = new TextEncoder().encode([name, email, idea].join('\n'))
	const digest = await crypto.subtle.digest('SHA-256', source)

	return Array.from(new Uint8Array(digest), byte =>
		byte.toString(16).padStart(2, '0'),
	).join('')
}

function resendErrorName(body: unknown) {
	if (typeof body !== 'object' || body === null) return undefined
	const name: unknown = Reflect.get(body, 'name')
	return typeof name === 'string' ? name : undefined
}

interface ContactMailSettings {
	apiKey: string
	inboxEmail: string
}

function contactMailRecipients(inboxEmail: string) {
	return [...new Set([siteEmail, inboxEmail].filter(Boolean))]
}

export async function sendContactMail(
	{ apiKey, inboxEmail }: ContactMailSettings,
	payload: ContactFormPayload,
) {
	const response = await $fetch.raw(resendEmailsEndpoint, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Idempotency-Key': `contact-${await idempotencyKey(payload)}`,
		},
		body: {
			from: contactMailSender,
			to: contactMailRecipients(inboxEmail),
			reply_to: payload.email,
			subject: `New enquiry from ${singleLine(payload.name)}`,
			text: contactMailText(payload),
		},
		ignoreResponseError: true,
	})

	if (response.ok) return

	console.error({
		event: 'contact_mail_failed',
		status: response.status,
		reason: resendErrorName(response._data),
	})

	throw createError({
		statusCode: 502,
		statusMessage: 'The message could not be sent',
	})
}
