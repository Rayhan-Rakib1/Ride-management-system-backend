import crypto from "crypto";
import { User } from "../user/user.model";
import AppError from "../../ErrorHandler/AppError";
import { redisClient } from "../../config/redisClient";
import { sendEmail } from "../../utils/sendEmail";
import { Rider } from "../Rider/rider.model";
import { Driver } from "../driver/driver.model";

const OTP_EXPIRATION = 5 * 60;

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length);
  return otp;
};

const sendOTP = async ( name: string, email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(401, "User not found");
  }

//   if (user.isVerified) {
//     throw new AppError(401, "You are all ready verified");
//   }

  const otp = generateOtp();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    templateName: "otp",
    subjects: "Your otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};
const verifyOTP = async (email: string, otp: string) => {
    // const user = await User.findOne({ email, isVerified: false })
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isVerified) {
        throw new AppError(401, "You are already verified")
    }

    const redisKey = `otp:${email}`

    const savedOtp = await redisClient.get(redisKey)

    if (!savedOtp) {
        throw new AppError(401, "Invalid OTP");
    }

    if (savedOtp !== otp) {
        throw new AppError(401, "Invalid OTP");
    }


    await Promise.all([
        User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        Rider.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        Driver.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        
        redisClient.del([redisKey])
    ])

};

export const OTPServices = {
  sendOTP,
  verifyOTP,
};
