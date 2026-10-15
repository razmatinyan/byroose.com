<script setup lang="ts">
import { computed, nextTick, reactive, shallowRef, useTemplateRef } from "vue";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	contactFormFields,
	contactFormSchema,
	contactHoneypotField,
	contactIdeaMaxLength,
	createEmptyContactForm,
	getContactFormErrors,
} from "@/lib/contact-form";
import type { ContactFormErrors, ContactFormField } from "@/lib/contact-form";
import { siteEmail } from "@/lib/site";

type ContactFormStatus = "idle" | "sending" | "sent" | "failed";

interface ContactFieldConfig {
	name: ContactFormField;
	label: string;
	placeholder: string;
	autocomplete?: string;
	type?: "email" | "text";
	multiline?: boolean;
}

const contactEndpoint = "/api/contact";
const submitLabel = "Send message";
const sendingLabel = "Sending";

const fields: readonly ContactFieldConfig[] = [
	{
		name: "name",
		label: "Name",
		placeholder: "Your name",
		autocomplete: "name",
		type: "text",
	},
	{
		name: "email",
		label: "Email address",
		placeholder: "Your email address",
		autocomplete: "email",
		type: "email",
	},
	{
		name: "idea",
		label: "Tell us your idea",
		placeholder: "What are you building, and what should it achieve?",
		multiline: true,
	},
];

const contactForm = useTemplateRef<HTMLFormElement>("contactForm");
const values = reactive(createEmptyContactForm());
const attempted = shallowRef(false);
const status = shallowRef<ContactFormStatus>("idle");
const honeypot = shallowRef("");

const validation = computed(() => contactFormSchema.safeParse(values));
const errors = computed<ContactFormErrors>(() => {
	if (!attempted.value || validation.value.success) return {};
	return getContactFormErrors(validation.value.error);
});
const sending = computed(() => status.value === "sending");

function fieldId(field: string) {
	return `contact-${field}`;
}

function errorId(field: ContactFormField) {
	return `contact-${field}-error`;
}

async function focusFirstInvalidField() {
	await nextTick();
	const field = contactFormFields.find((name) => errors.value[name]);
	if (!field) return;

	const control = contactForm.value?.elements.namedItem(field);
	if (control instanceof HTMLElement) control.focus();
}

async function submit() {
	if (sending.value) return;

	attempted.value = true;
	const result = validation.value;
	if (!result.success) {
		await focusFirstInvalidField();
		return;
	}

	status.value = "sending";

	try {
		await $fetch(contactEndpoint, {
			method: "POST",
			body: { ...result.data, [contactHoneypotField]: honeypot.value },
		});
		Object.assign(values, createEmptyContactForm());
		attempted.value = false;
		status.value = "sent";
	} catch {
		status.value = "failed";
	}
}
</script>

<template>
	<form
		ref="contactForm"
		class="contact-form"
		:aria-busy="sending || undefined"
		novalidate
		@submit.prevent="submit"
	>
		<div
			v-for="field in fields"
			:key="field.name"
			class="contact-field"
			data-contact-hero-reveal
			data-contact-hero-field
		>
			<Label class="contact-field-label" :for="fieldId(field.name)">
				{{ field.label }}
			</Label>
			<Textarea
				v-if="field.multiline"
				:id="fieldId(field.name)"
				v-model="values[field.name]"
				class="contact-field-control contact-field-textarea"
				:name="field.name"
				:placeholder="field.placeholder"
				:maxlength="contactIdeaMaxLength"
				:aria-invalid="errors[field.name] ? true : undefined"
				:aria-describedby="
					errors[field.name] ? errorId(field.name) : undefined
				"
				:disabled="sending"
				required
				data-lenis-prevent
			/>
			<Input
				v-else
				:id="fieldId(field.name)"
				v-model="values[field.name]"
				class="contact-field-control"
				:name="field.name"
				:type="field.type"
				:autocomplete="field.autocomplete"
				:placeholder="field.placeholder"
				:aria-invalid="errors[field.name] ? true : undefined"
				:aria-describedby="
					errors[field.name] ? errorId(field.name) : undefined
				"
				:disabled="sending"
				required
			/>
			<p
				v-if="errors[field.name]"
				:id="errorId(field.name)"
				class="contact-field-error"
			>
				{{ errors[field.name] }}
			</p>
		</div>

		<div class="contact-form-trap" aria-hidden="true">
			<label :for="fieldId(contactHoneypotField)">Website</label>
			<input
				:id="fieldId(contactHoneypotField)"
				v-model="honeypot"
				:name="contactHoneypotField"
				type="text"
				tabindex="-1"
				autocomplete="off"
			/>
		</div>

		<div
			class="contact-form-footer"
			data-contact-hero-reveal
			data-contact-hero-field
		>
			<Button
				class="contact-submit"
				type="submit"
				variant="dark"
				size="cta-lg"
				:disabled="sending"
			>
				{{ sending ? sendingLabel : submitLabel }}
				<template #icon>
					<ButtonIcon />
				</template>
			</Button>
			<p class="contact-form-status" role="status">
				<template v-if="status === 'sent'">
					Thanks, your message is on its way. We'll reply with next steps.
				</template>
				<template v-else-if="status === 'failed'">
					We couldn't send your message. Email us at
					<a
						class="contact-form-status-link"
						:href="`mailto:${siteEmail}`"
						>{{ siteEmail }}</a
					>
					instead.
				</template>
			</p>
		</div>
	</form>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.contact-form {
	@apply grid gap-8 md:gap-10;
}

.contact-field {
	@apply grid content-start gap-3;
}

.contact-field-label {
	@apply text-lg leading-tight font-medium tracking-[-0.02em] md:text-xl;
}

.contact-field-control {
	@apply h-14 rounded-md border-border px-5 text-xl shadow-none md:h-16 md:text-lg;
}

.contact-field-textarea {
	@apply h-auto min-h-40 resize-y py-4 leading-snug md:min-h-48;
}

.contact-field-error {
	@apply m-0 text-sm font-medium text-destructive md:text-base;
}

.contact-form-footer {
	@apply grid gap-5 pt-4;
}

.contact-form-trap {
	@apply pointer-events-none absolute -left-[100vw] size-px overflow-hidden opacity-0;
}

.contact-submit {
	@apply w-full justify-between px-6 sm:w-1/2;
	min-height: 3.75rem;
}

.contact-form-status {
	@apply m-0 max-w-[36em] text-base font-medium text-pretty text-muted-foreground empty:hidden md:text-lg;
}

.contact-form-status-link {
	@apply text-foreground underline underline-offset-4 transition-colors hover:text-primary;
}
</style>
