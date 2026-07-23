const {z} = require('zod');

const registerSchema = z.object({

   name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

module.exports = {registerSchema}; 