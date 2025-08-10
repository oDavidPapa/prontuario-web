export interface JwtPayload {
    roles?: string[];
    sub?: string;
    nome?: string;
    exp?: number;
    iat?: number;
}