interface RateLimitOptions {
	limit: number
	windowMs: number
}

const requestLog = new Map<string, number[]>()

export function isRateLimited(key: string, { limit, windowMs }: RateLimitOptions) {
	const now = Date.now()
	const windowStart = now - windowMs

	for (const [entryKey, times] of requestLog) {
		const recent = times.filter(time => time > windowStart)
		if (recent.length) requestLog.set(entryKey, recent)
		else requestLog.delete(entryKey)
	}

	const recent = requestLog.get(key) ?? []
	if (recent.length >= limit) return true

	requestLog.set(key, [...recent, now])
	return false
}
