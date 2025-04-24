<template>
<form @submit.prevent="submitForm" class="needs-validation" novalidate>
    <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input v-model="form.name" id="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" @input="validateField('name')" />
        <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
    </div>

    <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input v-model="form.email" id="email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" @input="validateField('email')" />
        <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
    </div>

    <div class="mb-3">
        <label for="phone" class="form-label">Phone:</label>
        <input v-model="form.phone" id="phone" type="tel" class="form-control" :class="{ 'is-invalid': errors.phone }" @input="validateField('phone')" />
        <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
    </div>

    <div class="mb-3">
        <label for="age" class="form-label">Age:</label>
        <input v-model="form.age" id="age" type="number" class="form-control" :class="{ 'is-invalid': errors.age }" @input="validateField('age')" />
        <div class="invalid-feedback" v-if="errors.age">{{ errors.age }}</div>
    </div>

    <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input v-model="form.password" id="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" @input="validateField('password')" />
        <div class="invalid-feedback" v-if="errors.password">{{ errors.password }}</div>
    </div>

    <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password:</label>
        <input v-model="form.confirmPassword" id="confirmPassword" type="password" class="form-control" :class="{ 'is-invalid': errors.confirmPassword }" @input="validateField('confirmPassword')" />
        <div class="invalid-feedback" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
    </div>

    <button type="submit" class="btn btn-primary">Submit</button>
</form>
</template>

  
  
<script>
import {
    Form
} from "vform";
import * as yup from "yup";
import axios from "axios";

// Define the schema outside the submitForm method
const formSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .matches(/^[A-Za-z\s]+$/, "Name must only contain letters and spaces"),

    email: yup
        .string()
        .email("Invalid email address")
        .min(5, "Email must be at least 5 characters")
        .required("Email is required"),

    phone: yup
        .string()
        .required("Phone number is required"),

    age: yup
        .number()
        .required("Age is required")
        .positive("Age must be a positive number")
        .integer("Age must be an integer")
        .min(18, "You must be at least 18 years old")
        .max(100, "Age cannot exceed 100 years"),

    password: yup
        .string()
        .required("Password is required")
        .min(3, "Password must be at least 8 characters"),

    confirmPassword: yup
        .string()
        .required("Confirm password is required"),
});

export default {
    data() {
        return {
            form: new Form({
                name: "",
                email: "",
                phone: "",
                age: "",
                password: "",
                confirmPassword: "",
            }),
            errors: {}, // For Yup validation errors
        };
    },
    methods: {
        async submitForm() {
            try {
                // Reset errors before validation
                this.errors = {}; // Clear errors
                // Validate using the schema defined outside the method
                await formSchema.validate(this.form, {
                    abortEarly: false
                });

                // Simulating server-side validation and response
                //   await this.form.post("/api/submit");
                //   alert("Form submitted successfully!");
                //   this.form.reset();
                const mockServerResponse = {
                    status: 400, // Simulate a bad request
                    data: {
                        errors: {
                            email: "Email already exists", // Simulated error response from the server
                            phone: "Phone number is already registered", // Another simulated error
                        },
                    },
                };

                // Check if the response has validation errors from the server
                if (
                    mockServerResponse.status === 400 &&
                    mockServerResponse.data.errors
                ) {
                    // Handle server-side validation errors
                    this.errors = mockServerResponse.data.errors;
                }
            } catch (err) {
                if (err.name === "ValidationError") {
                    // Handle Yup validation errors
                    err.inner.forEach((error) => {
                        this.errors[error.path] = error.message; // Direct assignment in Vue 3
                    });
                } else {
                    // Handle server-side errors
                    if (err.response && err.response.data.errors) {
                        this.errors = err.response.data.errors;
                    }
                    console.error("Submission failed:", err);
                }
            }
        },

        // Simulate server-side submit with stubbed response
        async serverSubmit() {
            // Simulating a server response
            const simulatedErrorResponse = {
                status: 400,
                data: {
                    errors: {
                        name: "Name is already taken",
                        email: "This email is already registered",
                    }
                }
            };

            // Simulating a successful response (for testing purposes)
            const simulatedSuccessResponse = {
                status: 200
            };

            // Simulate an error response for testing
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(simulatedErrorResponse);
                }, 1000);

                // Uncomment below line to simulate success:
                // resolve(simulatedSuccessResponse);
            });
        },

        // Validate individual field
        async validateField(field) {
            this.errors = {}; // Clear all errors
            try {
                await formSchema.validateAt(field, this.form); // Validate just the field being edited
            } catch (err) {
                if (err.name === "ValidationError") {
                    this.errors[err.path] = err.message; // Update errors for that field only
                }
            }
        },
    },
};
</script>
  
  
<style scoped>
/* Optional custom styles for form validation */
</style>
