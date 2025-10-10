import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcryptjs";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";

// Register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
   
    try {
         // We need restriction for user and seller, so we want a utility function
    // We can use the same function for user and seller authentication

    validateRegistrationData(req.body, "user");
   
    // We want a Prisma Client
    // Create libs folder inside packages folder
    // In here, create a folder called prisma
    // Then create a file called index.ts inside prisma folder

    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({where: { email } });

    if(existingUser){
        return next(new ValidationError("User already exists with this email!"))
    };

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, "user-activation-mail")

    res.status(200).json({
        message: "OTP sent to email. Please verify your account"
    })

    } catch (error) {
        return next(error);
    }
};

// Verify user with otp
export const verifyUser = async(req:Request, res:Response, next: NextFunction) => {
    try {
        const {email, otp, password, name} = req.body;
        if(!email || !otp || !password || !name){
            return next(new ValidationError("All fields arre rrequired!"))
        }

        const existingUser = await prisma.users.findUnique({where: {email} });

        if(existingUser){
            return next(new ValidationError("User already exists with this email!"));
        };

        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.users.create({
            data: {name, email, password: hashedPassword}
        })

        res.json(201).json({
            success: true,
            message: "User registered successfully!"
        })

    } catch (error) {
        return next(error);
    }
}

