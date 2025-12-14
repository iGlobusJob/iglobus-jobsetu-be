declare namespace Express {
    export interface Request {
        file?: Multer.File;
        user?: {
            vendorId?: string;
            adminId?: string;
            candidateId?: string;
            email?: string;
            organizationName?: string;
            [key: string]: any;
        };
    }
}
