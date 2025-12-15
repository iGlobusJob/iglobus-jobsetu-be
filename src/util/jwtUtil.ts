import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AdminTokenPayload } from '../interfaces/admin';
import { VendorTokenPayload } from '../interfaces/vendor';
import { CandidateTokenPayload } from '../interfaces/candidate';
import { RecruiterTokenPayload } from '../interfaces/recruiter';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY!;

type TokenPayload = VendorTokenPayload | CandidateTokenPayload | AdminTokenPayload | RecruiterTokenPayload

const generateToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: '24h'
    };
    return jwt.sign(payload, SECRET_KEY, options);
};

const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, SECRET_KEY) as TokenPayload;
    } catch (error) {
        return null;
    }
};

export default { generateToken, verifyToken };
