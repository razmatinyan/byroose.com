import { z } from "zod";

export const contactIdeaMaxLength = 2000;
export const contactHoneypotField = "website";

export const contactFormSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, "Enter your name")
      .max(120, "Keep your name under 120 characters"),
   email: z
      .string()
      .trim()
      .pipe(
         z
            .email("Enter a valid email address")
            .max(254, "Keep your email under 254 characters"),
      ),
   idea: z
      .string()
      .trim()
      .min(1, "Tell us about your idea")
      .max(
         contactIdeaMaxLength,
         `Keep your idea under ${contactIdeaMaxLength} characters`,
      ),
});

export type ContactFormValues = z.input<typeof contactFormSchema>;
export type ContactFormPayload = z.output<typeof contactFormSchema>;
export type ContactFormField = keyof ContactFormValues;
export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export const contactFormFields = [
   "name",
   "email",
   "idea",
] as const satisfies readonly ContactFormField[];

export function createEmptyContactForm(): ContactFormValues {
   return { name: "", email: "", idea: "" };
}

export function getContactFormErrors(
   error: z.ZodError<ContactFormValues>,
): ContactFormErrors {
   const { fieldErrors } = z.flattenError(error);

   return Object.fromEntries(
      contactFormFields.flatMap((field) => {
         const message = fieldErrors[field]?.[0];
         return message ? [[field, message]] : [];
      }),
   );
}
