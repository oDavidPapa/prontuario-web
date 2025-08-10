export interface JwtPayload {
    roles?: string[];
    sub?: string;
    exp?: number;
    iat?: number;
}