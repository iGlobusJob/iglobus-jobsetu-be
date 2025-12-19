declare namespace Express {
    export interface Request {
        file?: Multer.File;
        user?: {
            clientId?: string;
            adminId?: string;
            candidateId?: string;
            email?: string;
            organizationName?: string;
            [key: string]: any;
        };
    }
}
