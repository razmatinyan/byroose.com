export default defineNuxtRouteMiddleware(() => {
	const { loggedIn } = useUserSession()

	if (!loggedIn.value) {
		return abortNavigation(createError({ statusCode: 404, statusMessage: 'Page Not Found' }))
	}
})
